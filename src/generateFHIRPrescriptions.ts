import { opendir, readFile, writeFile } from "fs/promises";
import { basename } from "path";

import { fromKEMHRRegimenToFHIRDosage, fromKMEHRFreeTextPosologyToFHIRDosage } from "./generateFHIRDosage";
import { generatePatient, generateAuthor, generateDrug } from "./generateFHIRMedicationLines";

import type {
    Bundle,
    Extension,
    MedicationRequest,
    MedicationRequestSubstitution
} from "fhir/r4";

import type { TransactionConfig} from "./generateTransaction";
import type { AuthorConfig } from "./generateHealthcareActor";

import type { OptionsConfig } from "./config";

type PrescriptionType = "P0" | "P1";

type Item = Exclude<
    TransactionConfig, 
    "suspensionReason" | "suspensionReference" | "version" | "transactionDate" | "transactionTime" | "id" | "author" | "version" | "isValidated"
> & {
    // Reimbursement instructions 
    // Refer to https://hl7-be.github.io/medication/branches/prescription/ValueSet-be-vs-medication-request-reimbursement-type.html for the complete list
    instructionforreimbursementCode?: "third-party-payer-applicable" | "first-dose" | "second-dose" | "third-dose" | "chronic-renal-failure-pathway" | "diabetes-care-pathway" | "diabetes-convention" | "non-reimbursable" | "startup-pathway-type-2-diabetes",
    // Is substitution authorized ?
    // Most of the time, implicitly, answer is yes, but some case, answer is no
    issubstitutionallowed?: boolean
};

// Config for external file
export type FHIRPrescriptionConfiguration = {
  /**
   * The drugs contained in that prescription (at least 1, max 10).
   * @minLength 1
   * @maxLength 10
   */
  transactions: Item[];
  /**
   * Who is the author of the last modification of this MS ?
   */
  author?: AuthorConfig;
  /**
   * Date when was the MS updated ? (YYYY-MM-DD)
   * @format date
   * @example: "2022-08-07"
   */
  date?: string;
  /**
   * Time when was the MS update (HH:MM:SS)
   * @example "08:17:42"
   * @pattern ^(0\d|1\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d{1,3})?((\+|-)(0\d|1[0-2]):[0-5]\d|Z)?$
   */
  time?: string;
  /**
   * Type of prescription
   */
  type: PrescriptionType
}

export async function generateOutput(filesConfig: OptionsConfig) {

    // Constants for file handling
    const CONFIGURATIONS_PATH = filesConfig.CONFIGURATIONS_PATH;
    const OUTPUT_PATH = filesConfig.OUTPUT_PATH;

    // Read configuration file(s)
    const dir = await opendir(CONFIGURATIONS_PATH);
    for await (const dirent of dir) {
        if (dirent.isFile()) {
          console.log(`Processing ${dirent.name}`);
          try {
            await processSingleFile(`${CONFIGURATIONS_PATH}/${dirent.name}`, OUTPUT_PATH);
          } catch (error) {
            console.log(error);
          }
        }
    }
}

async function processSingleFile(path: string, outputPath: string) {
  // Get filename without extension
  let name = basename(path);
  let filename = name.substring(0, name.lastIndexOf("."));
  let extension = name.substring(name.lastIndexOf(".") + 1);

  // Set up variable to retrieve the config
  let config: FHIRPrescriptionConfiguration;

    // Depending of the extension, different load strategies
    switch (extension) {
        case "ts":
        // TODO later find out how to use await() instead ...
        let module = require(`${path}`).default;
        config = module() as FHIRPrescriptionConfiguration;
        break;

        // It is considered as json by default
        default:
        // Read file
        let contents = await readFile(path, { encoding: "utf8" });
        // Turn that to a JSON payload
        config = JSON.parse(contents) as FHIRPrescriptionConfiguration;
    }

    let payload = generatePayload(config!);

    // Write result into a json file
    await writeFile(
        `${outputPath}/${filename}.json`,
        JSON.stringify(payload, null, "\t"),
        {
        encoding: "utf8",
        },
    );
}

function getCurrentInstant() {
    const now = new Date();
  
    const offset = now.getTimezoneOffset();
    const sign = offset > 0 ? '-' : '+';
    const offsetHours = String(Math.abs(offset) / 60).padStart(2, '0');
    const offsetMinutes = String(Math.abs(offset) % 60).padStart(2, '0');
    
    const timezoneOffset = `${sign}${offsetHours}:${offsetMinutes}`;
  
    // Format the current date with sub-millisecond precision
    const formattedDate = now.toISOString(); // ISO 8601 format (includes milliseconds)
    
    // Replace 'Z' with the timezone offset
    return formattedDate.replace('Z', timezoneOffset);
}

// Generate a RID-like identifier
function generateRid(type: PrescriptionType) {

    // The type of prescription
    const secondChar = type === "P0" ? '0' : '1';

    // Allowed characters (without O, Q, I, J, U, V)
    // Cf. https://recip-e.be/wp-content/uploads/2022/11/Recip-e_Integration_Specs_Hospitals_v1.0.8-KMEHR-1.28-20210315.pdf
    const allowedCharacters = '0123456789ABCDEFGHKLMNPRSTWXYZ';

    // Generate 8 random alphanumeric characters from allowed characters
    const randomString = Array.from({ length: 8 }, () => 
        allowedCharacters.charAt(Math.floor(Math.random() * allowedCharacters.length))
    ).join('');

    return `BEP${secondChar}${randomString}`;
}

// Keep a bundle for making stuff simple
export function generatePayload(config: FHIRPrescriptionConfiguration): Bundle {
    return {
        resourceType: "Bundle",
        type: "collection",
        entry: generateBody(config),
        total: config.transactions.length || 0,
        timestamp: getCurrentInstant()
    }
}

// https://hl7-be.github.io/medication/branches/prescription/StructureDefinition-BeMedicationPrescription.html
// For the final payload, use MedicationRequest as it will be the ressource of the prescriptions / ...
export function generateBody(config: FHIRPrescriptionConfiguration): MedicationRequest[] {

    // Generate the Recip-e Identifier (regardless of number of medications)
    const rid = generateRid(config.type);

    // As well that other information that won't change across prescription
    const authoredOn = getCurrentInstant();
    const patient = generatePatient();
    const author = generateAuthor(config.author);

    return config.transactions.map( (transaction, idx) => {

        const drug = transaction.drug;

        return {
            resourceType: "MedicationRequest",
            status: "active",
            intent: "order",
            authoredOn: authoredOn,
            extension: generateExtensions(transaction),
            substitution: generateSubstitution(transaction),
            subject: patient,
            requester: author,
            dosageInstruction: drug.regimen === undefined 
                ? [fromKMEHRFreeTextPosologyToFHIRDosage(drug)]
                : fromKEMHRRegimenToFHIRDosage(drug.regimen, drug),
            medicationCodeableConcept: generateDrug(drug, idx),
            identifier: [
                {
                    system: "http://ehealth.fgov.be/standards/fhir/medication/NamingSystem/be-ns-prescription",
                    value: rid
                }
            ]
        }
    });
}

function generateExtensions(entry: Item) : Extension[] | undefined {

    let extensions : Extension[] = [];

    // Let's care about only reimbursement (coded) for now
    if (entry.instructionforreimbursementCode !== undefined) {

        let reimbursementMap = {
            "third-party-payer-applicable": "Tiers-payant applicable",
            "first-dose": "1ère dose",
            "second-dose": "2ème dose + [date de la 1ère dose]",
            "third-dose": "3ème dose + [date de la 1ère et 2ème dose]",
            "chronic-renal-failure-pathway": "Trajet de soins insuffisance rénale chronique",
            "diabetes-care-pathway": "Trajet de soins diabète",
            "diabetes-convention": "Convention diabète",
            "non-reimbursable": "Non remboursable",
            "startup-pathway-type-2-diabetes": "Trajet de démarrage diabète type 2"
        } 

        extensions.push({
            url: "https://www.ehealth.fgov.be/standards/fhir/medication/StructureDefinition/InstructionsForReimbursement",
            valueCodeableConcept: {
                coding: [
                    {
                        system: "https://www.ehealth.fgov.be/standards/fhir/medication/CodeSystem/be-cs-medication-request-reimbursement-type",
                        code: entry.instructionforreimbursementCode
                    }
                ],
                text: reimbursementMap[entry.instructionforreimbursementCode]
            }
        });
    }

    return (extensions.length > 0) ? extensions : undefined;
} 

function generateSubstitution(entry: Item): MedicationRequestSubstitution | undefined {

    if (entry.issubstitutionallowed !== undefined) {
        return {
            allowedBoolean: entry.issubstitutionallowed
        }
    }

    return undefined;
}