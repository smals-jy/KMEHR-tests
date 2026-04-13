import { opendir, readFile, writeFile } from "fs/promises";
import { basename } from "path";
import { v4 as uuidv4 } from "uuid";


import {
    fromKEMHRRegimenToFHIRDosage,
    fromKMEHRFreeTextPosologyToFHIRDosage,
} from "./generateFHIRDosage";
import { PREDEFINED_FIELDS } from "./constants";

import type { MedicationEntry, Configuration, AuthorConfig, OptionsConfig } from "./config";

import type {
    MedicationStatement,
    Reference,
    Period,
    CodeableConcept,
    Coding,
    Bundle,
    BundleEntry,
    Extension,
    Patient,
    Practitioner,
    PractitionerRole,
} from "fhir/r4";

type SingleTransaction = Configuration["transactions"][number];

/**
 * Default physician used when neither transaction.author nor config.author is defined.
 * All fields are sourced from PREDEFINED_FIELDS (predefined constants).
 */
const DEFAULT_AUTHOR: AuthorConfig = {
    nihdi: PREDEFINED_FIELDS.AUTHOR_NIHDI,
    firstname: PREDEFINED_FIELDS.AUTHOR_FIRSTNAME,
    familyname: PREDEFINED_FIELDS.AUTHOR_LASTNAME,
    type: PREDEFINED_FIELDS.AUTHOR_TYPE,
};

// ─── File I/O ─────────────────────────────────────────────────────────────────

export async function generateOutput(filesConfig: OptionsConfig) {
    const { CONFIGURATIONS_PATH, OUTPUT_PATH } = filesConfig;
    const dir = await opendir(CONFIGURATIONS_PATH);
    for await (const dirent of dir) {
        if (dirent.isFile()) {
            console.log(`Processing ${dirent.name}`);
            try {
                await processSingleFile(
                    `${CONFIGURATIONS_PATH}/${dirent.name}`,
                    OUTPUT_PATH,
                );
            } catch (error) {
                console.log(error);
            }
        }
    }
}

async function processSingleFile(path: string, outputPath: string) {
    const name = basename(path);
    const filename = name.substring(0, name.lastIndexOf("."));
    const extension = name.substring(name.lastIndexOf(".") + 1);

    let config: Configuration;
    switch (extension) {
        case "ts":
            const module = require(`${path}`).default;
            config = module() as Configuration;
            break;
        default:
            const contents = await readFile(path, { encoding: "utf8" });
            config = JSON.parse(contents) as Configuration;
    }

    const payload = generatePayload(config);
    await writeFile(
        `${outputPath}/${filename}.json`,
        JSON.stringify(payload, null, "\t"),
        { encoding: "utf8" },
    );
}

// ─── Timestamp helpers ────────────────────────────────────────────────────────

function getCurrentInstant(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const sign = offset > 0 ? "-" : "+";
    const offsetHours = String(Math.abs(offset) / 60).padStart(2, "0");
    const offsetMinutes = String(Math.abs(offset) % 60).padStart(2, "0");
    return now.toISOString().replace("Z", `${sign}${offsetHours}:${offsetMinutes}`);
}

function getTimezoneOffset(): string {
    const now = new Date();
    const offsetMinutes = now.getTimezoneOffset();
    if (offsetMinutes === 0) return "Z";
    const sign = offsetMinutes > 0 ? "-" : "+";
    const absMinutes = Math.abs(offsetMinutes);
    const hours = Math.floor(absMinutes / 60).toString().padStart(2, "0");
    const minutes = (absMinutes % 60).toString().padStart(2, "0");
    return `${sign}${hours}:${minutes}`;
}

export function generateDateTime(
    config: Configuration,
    transaction: SingleTransaction,
): string {
    const now = new Date();
    const defaultDate = now.toISOString().split("T")[0];
    const defaultTime = now.toTimeString().split(" ")[0];
    const date = transaction.transactionDate || config.date || defaultDate;
    const time = transaction.transactionTime || config.time || defaultTime;
    return `${date}T${time}${getTimezoneOffset()}`;
}

// ─── Author de-duplication ────────────────────────────────────────────────────

/**
 * Stable key used to de-duplicate authors.
 * Priority: NIHDI (rizivnr) > SSIN > fallback SSIN constant.
 * This key is also the value used in logical references:
 *   "Practitioner/<key>"  and  "PractitionerRole/<key>"
 */
function authorKey(author: AuthorConfig): string {
    return author.nihdi ?? author.ssin ?? PREDEFINED_FIELDS.AUTHOR_SSIN;
}

// ─── FHIR resource builders ───────────────────────────────────────────────────

/**
 * Produces a single FHIR Patient resource.
 * fullUrl = "Patient/<PATIENT_SSIN>"
 */
function buildPatientResource(): { resource: Patient } {
    const resource: Patient = {
        resourceType: "Patient",
        meta: {
           profile: [
               "https://www.ehealth.fgov.be/standards/fhir/core/StructureDefinition/be-patient"
           ]  
        },
        identifier: [
            {
                system: "https://www.ehealth.fgov.be/standards/fhir/core/NamingSystem/ssin",
                value: PREDEFINED_FIELDS.PATIENT_SSIN,
            },
        ],
        name: [
            {
                family: PREDEFINED_FIELDS.PATIENT_LASTNAME,
                given: [PREDEFINED_FIELDS.PATIENT_FIRSTNAME],
            },
        ]
    };
    return { resource };
}

/**
 * Produces a FHIR Practitioner resource from an AuthorConfig.
 *
 * Single identifier — priority: NIHDI > SSIN > fallback SSIN.
 * Returns `identifierValue` so the caller can build:
 *   fullUrl = "Practitioner/<identifierValue>"
 */
function buildPractitionerResource(
    author: AuthorConfig,
    configAuthor: AuthorConfig,
): { identifierValue: string; resource: Practitioner } {
    // Merge: transaction-level author takes priority over config-level author
    const resolved: AuthorConfig = { ...configAuthor, ...author };

    // Single identifier — NIHDI preferred, then SSIN, then fallback
    let system: string;
    let identifierValue: string;

    if (resolved.nihdi) {
        system = "https://www.ehealth.fgov.be/standards/fhir/core/NamingSystem/nihdi";
        identifierValue = resolved.nihdi;
    } else if (resolved.ssin) {
        system = "https://www.ehealth.fgov.be/standards/fhir/core/NamingSystem/ssin";
        identifierValue = resolved.ssin;
    } else {
        system = "https://www.ehealth.fgov.be/standards/fhir/core/NamingSystem/ssin";
        identifierValue = PREDEFINED_FIELDS.AUTHOR_SSIN;
    }

    const resource: Practitioner = {
        resourceType: "Practitioner",
        meta: {
           profile: [
               "https://www.ehealth.fgov.be/standards/fhir/core/StructureDefinition/be-practitioner"
           ]  
        },
        identifier: [{ system, value: identifierValue }],
        name: [
            {
                family: resolved.familyname ?? PREDEFINED_FIELDS.AUTHOR_LASTNAME,
                given: [resolved.firstname ?? PREDEFINED_FIELDS.AUTHOR_FIRSTNAME],
            },
        ],
    };

    return { identifierValue, resource };
}

/**
 * Produces a FHIR PractitionerRole resource.
 * `practitioner.reference` = "Practitioner/<practitionerIdentifierValue>"
 *   matching the Practitioner's fullUrl.
 * fullUrl for this resource = "PractitionerRole/<authorKey>"
 */
function buildPractitionerRoleResource(
    author: AuthorConfig,
    configAuthor: AuthorConfig,
    practitionerIdentifierValue: string,
): { resource: PractitionerRole } {
    const resolved: AuthorConfig = { ...configAuthor, ...author };

    const resource: PractitionerRole = {
        resourceType: "PractitionerRole",
        meta: {
           profile: [
               "https://www.ehealth.fgov.be/standards/fhir/core/StructureDefinition/be-practitionerrole"
           ]  
        },
        // reference matches "Practitioner/<identifierValue>" fullUrl
        practitioner: {
            reference: `Practitioner/${practitionerIdentifierValue}`,
        },
    };

    if (resolved.type) {
        resource.code = [
            {
                coding: [
                    {
                        system: "https://www.ehealth.fgov.be/standards/fhir/core/CodeSystem/cd-hcparty",
                        code: resolved.type,
                    },
                ],
            },
        ];
    }

    return { resource };
}

// ─── Suspension helpers ───────────────────────────────────────────────────────

type SuspensionValue = {
    start: string;
    text: string;
    end: string | undefined;
    lifecycle: "suspended" | "stopped" | undefined;
};

function buildSuspensionsMap(
    config: Configuration,
): Record<string, SuspensionValue[]> {
    return config.transactions
        .filter((t) => t.suspensionReference !== undefined)
        .reduce(
            (acc, t) => {
                const key = t.suspensionReference!;
                const value: SuspensionValue = {
                    text: t.suspensionReason!,
                    start: t.drug.beginmoment!,
                    end: t.drug.endmoment,
                    lifecycle: t.drug.lifecycle,
                };
                if (acc[key]) {
                    acc[key].push(value);
                } else {
                    acc[key] = [value];
                }
                return acc;
            },
            {} as Record<string, SuspensionValue[]>,
        );
}

// ─── Bundle assembly ──────────────────────────────────────────────────────────

/**
 * Generates a FHIR Bundle (searchset) from a KMEHR-like Configuration.
 *
 * Author resolution priority (highest → lowest):
 *  1. transaction.author  — per-transaction override
 *  2. config.author       — file-level default
 *  3. DEFAULT_AUTHOR      — predefined physician (PREDEFINED_FIELDS constants)
 *
 * Entry order + fullUrl pattern:
 *  1. Patient              → "Patient/<ssin>"
 *  2. Per unique author:
 *       Practitioner       → "Practitioner/<nihdi|ssin>"
 *       PractitionerRole   → "PractitionerRole/<nihdi|ssin>"
 *  3. MedicationStatement  → "MedicationStatement/<uuid>"
 *
 * References inside resources mirror the fullUrl values above.
 */
export function generatePayload(config: Configuration): Bundle {

    // config.author takes precedence over DEFAULT_AUTHOR (predefined physician).
    // When config.author is also absent, DEFAULT_AUTHOR ensures a well-known
    // physician (Donald Duck / NIHDI 17892144001 / persphysician) is always used.
    const configAuthor: AuthorConfig = config.author ?? DEFAULT_AUTHOR;

    // 1. Patient
    const { resource: patientResource } = buildPatientResource();

    // 2. Collect & de-duplicate authors across all non-suspension transactions
    const nonSuspensionTransactions = config.transactions.filter(
        (t) => t.suspensionReference === undefined,
    );

    const uniqueAuthors = new Map<string, AuthorConfig>();
    for (const t of nonSuspensionTransactions) {
        // transaction.author → configAuthor (which is already DEFAULT_AUTHOR when omitted)
        const author = t.author ?? configAuthor;
        const key = authorKey(author);
        if (!uniqueAuthors.has(key)) {
            uniqueAuthors.set(key, author);
        }
    }

    // 3. Build Practitioner + PractitionerRole for each unique author
    type AuthorResources = {
        /** Value used in Practitioner.identifier[0].value and in the fullUrl */
        practitionerIdentifierValue: string;
        practitionerResource: Practitioner;
        practitionerRoleResource: PractitionerRole;
    };

    const authorResourceMap = new Map<string, AuthorResources>();
    for (const [key, author] of uniqueAuthors) {
        const { identifierValue: practitionerIdentifierValue, resource: practitionerResource } =
            buildPractitionerResource(author, configAuthor);
        const { resource: practitionerRoleResource } =
            buildPractitionerRoleResource(author, configAuthor, practitionerIdentifierValue);
        authorResourceMap.set(key, {
            practitionerIdentifierValue,
            practitionerResource,
            practitionerRoleResource,
        });
    }

    // 4. Suspension map
    const suspensionsMap = buildSuspensionsMap(config);

    // 5. MedicationStatements
    //    Generate the identifier UUID upfront so we can use it as the fullUrl.
    const medicationEntries = nonSuspensionTransactions.map((t, idx) => {
        const author = t.author ?? configAuthor;
        const medicationLineId = uuidv4();
        const ms = buildMedicationStatement(
            config,
            t,
            idx,
            author,
            medicationLineId,
            suspensionsMap,
        );
        return { medicationLineId, ms };
    });

    // 6. Assemble entries — every fullUrl follows "ResourceType/<mainIdentifier>"
    const entries: BundleEntry[] = [
        // 6a. Patient
        {
            fullUrl: `Patient/${PREDEFINED_FIELDS.PATIENT_SSIN}`,
            resource: patientResource,
        },

        // 6b. Practitioner + PractitionerRole pairs
        ...[...authorResourceMap.entries()].flatMap(([authorId, ar]) => [
            {
                // "Practitioner/<nihdi|ssin>" — matches practitioner.identifier[0].value
                fullUrl: `Practitioner/${ar.practitionerIdentifierValue}`,
                resource: ar.practitionerResource,
            },
            {
                // "PractitionerRole/<nihdi|ssin>" — matches informationSource.reference
                fullUrl: `PractitionerRole/${authorId}`,
                resource: ar.practitionerRoleResource,
            },
        ]),

        // 6c. MedicationStatements — "MedicationStatement/<uuid>"
        ...medicationEntries.map(({ medicationLineId, ms }) => ({
            fullUrl: `MedicationStatement/${medicationLineId}`,
            resource: ms,
        })),
    ];

    return {
        resourceType: "Bundle",
        type: "collection",
        timestamp: getCurrentInstant(),
        entry: entries,
    };
}

// ─── MedicationStatement builder ──────────────────────────────────────────────

function buildMedicationStatement(
    config: Configuration,
    transaction: SingleTransaction,
    idx: number,
    author: AuthorConfig,
    medicationLineId: string,
    suspensionsMap: Record<string, SuspensionValue[]>,
): MedicationStatement {

    const drug = transaction.drug;

    // subject  → "Patient/<ssin>"
    const patientSsin = PREDEFINED_FIELDS.PATIENT_SSIN;

    // informationSource → "PractitionerRole/<nihdi|ssin>" (matches fullUrl)
    const authorId = authorKey(author);

    const extensionForLine: Extension[] = [
        {
            url: "http://hl7.org/fhir/StructureDefinition/artifact-version",
            valueString: `${transaction.version ?? 1}`,
        },
        {
            url: "https://www.ehealth.fgov.be/standards/fhir/medication/StructureDefinition/BeExtRecordedDate",
            valueDateTime: generateDateTime(config, transaction),
        },
        {
            url: "https://www.ehealth.fgov.be/standards/fhir/medication/StructureDefinition/BeExtAdherenceStatus",
            valueCodeableConcept: {
                coding: [
                    {
                        system: "https://www.ehealth.fgov.be/standards/fhir/terminology/CodeSystem/BeMedicationLineAdherenceStatus",
                        code: "unknown",
                    },
                ],
            },
        },
        {
            url: "https://www.ehealth.fgov.be/standards/fhir/medication/StructureDefinition/BeExtMedicationLineRegistrationStatus",
            valueCode: "recorded",
        },
    ];

    let status: MedicationStatement["status"] = "unknown";
    let statusReason: CodeableConcept[] = [];
    const suspensions = suspensionsMap[transaction.id];

    if (suspensions !== undefined) {
        statusReason = suspensions.map((s) => ({
            extension: [
                {
                    url: "https://www.ehealth.fgov.be/standards/fhir/medication/StructureDefinition/extension-MedicationSuspension",
                    valuePeriod: { start: s.start, end: s.end },
                    extension: [
                        {
                            url: "http://ehealth.fgov.be/standards/fhir/MedicationSuspensionReason",
                            valueString: s.text,
                        },
                    ],
                },
            ],
            text: `${s.lifecycle === "stopped" ? "Definitive" : "Temporary"} suspension from ${s.start} to ${s.end ?? "forever"}`,
        }));

        if (suspensions.some((s) => s.lifecycle === "stopped")) {
            status = "stopped";
        }
    }

    return {
        resourceType: "MedicationStatement",
        meta: {
            profile: [
                "https://www.ehealth.fgov.be/standards/fhir/medication/StructureDefinition/BeMedicationLine",
            ],
        },
        // identifier value == the medicationLineId used as fullUrl suffix
        identifier: [
            {
                system: "http://ehealth.fgov.be/standards/fhir/medication/NamingSystem/be-ns-medicationline",
                value: medicationLineId,
            },
        ],
        extension: extensionForLine,
        status,
        statusReason: statusReason.length > 0 ? statusReason : undefined,
        // "Patient/<ssin>" — matches Patient fullUrl
        subject: {
            reference: `Patient/${patientSsin}`,
        },
        dateAsserted: getCurrentInstant(),
        // "PractitionerRole/<nihdi|ssin>" — matches PractitionerRole fullUrl
        informationSource: {
            reference: `PractitionerRole/${authorId}`,
        },
        medicationCodeableConcept: generateDrug(drug, idx),
        dosage:
            drug.regimen === undefined
                ? [fromKMEHRFreeTextPosologyToFHIRDosage(drug)]
                : fromKEMHRRegimenToFHIRDosage(drug.regimen, drug),
        effectivePeriod: generateEffectivePeriod(drug),
    };
}

// ─── Pure helpers ─────────────────────────────────────────────────────────────

function generateEffectivePeriod(entry: MedicationEntry): Period {
    return { start: entry.beginmoment, end: entry.endmoment };
}

export function generateDrug(entry: MedicationEntry, idx: Number): CodeableConcept {
    const isProduct = (entry.deliveredcd || entry.intendedcd) !== undefined;

    if (!isProduct) {
        return {
            coding: [
                {
                    system: "https://www.ehealth.fgov.be/standards/fhir/medication/CodeSystem/medication-type",
                    code: "magistral",
                },
            ],
            text: entry.compoundprescriptionText ?? `Magistrale bereiding ${idx}`,
        };
    }

    const productType = entry.drugType ?? "medicinalproduct";
    const finalProduct =
        entry.deliveredname ?? entry.intendedname ?? `${productType} ${idx}`;

    const codings: Coding[] = [
        {
            system: "https://www.ehealth.fgov.be/standards/fhir/medication/NamingSystem/cnk-codes",
            code: entry.intendedcd ?? "0000000",
            display: entry.intendedname ?? `Intended product name ${idx}`,
        },
    ];

    if (entry.deliveredcd) {
        codings.push({
            system: "https://www.ehealth.fgov.be/standards/fhir/medication/NamingSystem/cnk-codes",
            code: entry.deliveredcd,
            display: entry.deliveredname ?? `Delivered product name ${idx}`,
        });
    }

    return { coding: codings, text: finalProduct };
}

// ─── Legacy exports (backward compatibility) ─────────────────────────────────

/** `@deprecated` Use the Bundle-level Patient resource produced by generatePayload(). */
export function generatePatient(patient?: AuthorConfig): Reference {
    return {
        identifier: {
            system: "https://www.ehealth.fgov.be/standards/fhir/core/NamingSystem/ssin",
            value: patient?.ssin ?? PREDEFINED_FIELDS.PATIENT_SSIN,
        },
        display: `${patient?.firstname ?? PREDEFINED_FIELDS.PATIENT_FIRSTNAME} ${patient?.familyname ?? PREDEFINED_FIELDS.AUTHOR_LASTNAME}`,
    };
}

/** `@deprecated` Use the Bundle-level PractitionerRole resource produced by generatePayload(). */
export function generateAuthor(author?: AuthorConfig): Reference {
    const nihii = author?.nihdi;
    return {
        identifier: {
            system: nihii
                ? "https://www.ehealth.fgov.be/standards/fhir/core/NamingSystem/nihdi"
                : "https://www.ehealth.fgov.be/standards/fhir/core/NamingSystem/ssin",
            value: nihii ?? author?.ssin ?? PREDEFINED_FIELDS.AUTHOR_SSIN,
        },
        display: `${author?.firstname ?? PREDEFINED_FIELDS.AUTHOR_FIRSTNAME} ${author?.familyname ?? PREDEFINED_FIELDS.AUTHOR_LASTNAME}`,
    };
}
