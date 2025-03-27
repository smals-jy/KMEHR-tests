import { opendir, readFile, writeFile } from "fs/promises";
import { basename } from "path";

import { fromKEMHRRegimenToFHIRDosage, fromKMEHRFreeTextPosologyToFHIRDosage } from "./generateFHIRDosage";

import { PREDEFINED_FIELDS } from "./constants";

import type {
    MedicationEntry,
    Configuration,
    AuthorConfig
} from "./config";

import type {
    MedicationStatement,
    Reference,
    Period,
    CodeableConcept,
    Coding,
    Bundle
} from "fhir/r4";

import type { OptionsConfig } from "./config";

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
  let config: Configuration;

    // Depending of the extension, different load strategies
    switch (extension) {
        case "ts":
        // TODO later find out how to use await() instead ...
        let module = require(`${path}`).default;
        config = module() as Configuration;
        break;

        // It is considered as json by default
        default:
        // Read file
        let contents = await readFile(path, { encoding: "utf8" });
        // Turn that to a JSON payload
        config = JSON.parse(contents) as Configuration;
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

// A Medication scheme contains 0, 1 or * medications
export function generatePayload(config: Configuration): Bundle {
    return {
        resourceType: "Bundle",
        type: "collection",
        entry: generateBody(config),
        total: config.transactions.length || 0,
        timestamp: getCurrentInstant()
    }
}

// For the final payload, use MedicationStatement as it will be the ressource of the medication scheme line / ...
export function generateBody(config: Configuration): MedicationStatement[] {
    
    return config.transactions.map( (transaction, idx) => {

        const drug = transaction.drug;
        const author : AuthorConfig | undefined = transaction.author || config.author;

        return {
            resourceType: "MedicationStatement",
            status: "unknown",
            meta: {
                profile: [
                    "https://www.ehealth.fgov.be/standards/fhir/medication/StructureDefinition/be-medicationstatement"
                ]
            },
            extension: [
                // Two mandatory extensions to use
                // 1) The version of the medication line, default to 1
                {
                    url: "http://hl7.org/fhir/StructureDefinition/artifact-version",
                    valueString: `${transaction.version || 1}`
                },

                // 2) The adherence field, backported from R5 : https://hl7.org/fhir/medicationstatement-definitions.html#MedicationStatement.adherence
                // https://github.com/hl7-be/medication/issues/210
                {
                    url: "http://hl7.org/fhir/5.0/StructureDefinition/extension-MedicationStatement.adherence",
                    valueCode: "unknown"
                }
            ],
            subject: generatePatient(),
            informationSource: generateAuthor(author),
            medicationCodeableConcept: generateDrug(drug, idx),
            dosage : drug.regimen === undefined 
                ? [fromKMEHRFreeTextPosologyToFHIRDosage(drug)]
                : fromKEMHRRegimenToFHIRDosage(drug.regimen, drug),
            effectivePeriod: generateEffectivePeriod(drug)
        }
    })
    
}

// To generate the patient block
function generatePatient(patient?: AuthorConfig) : Reference {

    const firstname = patient?.firstname || PREDEFINED_FIELDS.PATIENT_FIRSTNAME;
    const lastname = patient?.familyname || PREDEFINED_FIELDS.AUTHOR_LASTNAME;
    const ssin = patient?.ssin || PREDEFINED_FIELDS.PATIENT_SSIN;

    const fullname = `${firstname} ${lastname}`;

    return {
        identifier: {
            system: "https://www.ehealth.fgov.be/standards/fhir/NamingSystem/ssin",
            value: ssin
        },
        display: fullname
    }
}

// To generate the author block
function generateAuthor(author?: AuthorConfig) : Reference {

    const firstname = author?.firstname || PREDEFINED_FIELDS.AUTHOR_FIRSTNAME;
    const lastname = author?.familyname || PREDEFINED_FIELDS.AUTHOR_LASTNAME;
    const nihii = author?.nihdi;
    const ssin = author?.ssin;

    const fullname = `${firstname} ${lastname}`;

    // If author has an nihii, use it otherwise use by default the ssin
    const identifierSystem = nihii 
        ? "https://www.ehealth.fgov.be/standards/fhir/core/NamingSystem/nihdi"
        : "https://www.ehealth.fgov.be/standards/fhir/core/NamingSystem/ssin";

    const identifierValue = nihii || ssin || PREDEFINED_FIELDS.AUTHOR_SSIN;

    return {
        identifier: {
            system: identifierSystem,
            value: identifierValue
        },
        display: fullname
    }
}

// To generate the period to take the medication
function generateEffectivePeriod(entry: MedicationEntry): Period {

    // At least one of them is going to be filled
    return {
        start: entry.beginmoment,
        end: entry.endmoment
    }
}

// To generate the medication that is going to be taken
function generateDrug(entry : MedicationEntry, idx: Number): CodeableConcept {

    // To distinguish if it is a official medication from a free text one
    let isProduct = (entry.deliveredcd || entry.intendedcd) !== undefined;

    // Magistral preparation are simple to handle
    if (!isProduct) {
        return {
            coding: [
                {
                    system: "https://www.ehealth.fgov.be/standards/fhir/medication/CodeSystem/medication-type",
                    code: "magistral"
                }
            ],
            text: entry.compoundprescriptionText || `Magistrale bereiding ${idx}`
        }
    }

    let productType = entry.drugType || "medicinalproduct";

    // Otherwise it is a product, with one or multiple indentifier(s)
    const finalProduct = entry.deliveredname || entry.intendedname || `${productType} ${idx}`;
    let codings : Coding[] = [
        // Intended product (mandatory)
        {
            // TODO, not always CNK
            system: "https://www.ehealth.fgov.be/standards/fhir/medication/NamingSystem/cnk-codes",
            code: entry.intendedcd || "0000000",
            display: entry.intendedname || `Intended product name ${idx}`
        }
    ];

    // Delivered product (mandatory)
    if (entry.deliveredcd) {
        codings.push({
            system: "https://www.ehealth.fgov.be/standards/fhir/medication/NamingSystem/cnk-codes",
            code: entry.deliveredcd,
            display: entry.deliveredname || `Delivered product name ${idx}`
        });
    }

    return {
        coding: codings,
        text: finalProduct
    }
}
