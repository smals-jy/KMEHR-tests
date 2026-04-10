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
            // TODO later find out how to use await() instead …
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
 * Priority: NIHDI > SSIN > fallback SSIN constant.
 */
function authorKey(author: AuthorConfig): string {
    return author.nihdi ?? author.ssin ?? PREDEFINED_FIELDS.AUTHOR_SSIN;
}

// ─── FHIR resource builders ───────────────────────────────────────────────────

/** Produces a single FHIR Patient resource with a freshly generated UUID. */
function buildPatientResource(): { uuid: string; resource: Patient } {
    const resource: Patient = {
        resourceType: "Patient",
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
        ],
        birthDate: PREDEFINED_FIELDS.PATIENT_BIRTHDAY,
        gender: PREDEFINED_FIELDS.PATIENT_SEX as Patient["gender"],
    };
    return { uuid: uuidv4(), resource };
}

/** Produces a FHIR Practitioner resource from an AuthorConfig. */
function buildPractitionerResource(author: AuthorConfig): {
    uuid: string;
    resource: Practitioner;
} {
    const identifiers: Practitioner["identifier"] = [];

    if (author.nihdi) {
        identifiers.push({
            system: "https://www.ehealth.fgov.be/standards/fhir/core/NamingSystem/nihdi",
            value: author.nihdi,
        });
    }

    if (author.ssin) {
        identifiers.push({
            system: "https://www.ehealth.fgov.be/standards/fhir/core/NamingSystem/ssin",
            value: author.ssin,
        });
    }

    // Fallback when neither NIHDI nor SSIN is provided
    if (identifiers.length === 0) {
        identifiers.push({
            system: "https://www.ehealth.fgov.be/standards/fhir/core/NamingSystem/ssin",
            value: PREDEFINED_FIELDS.AUTHOR_SSIN,
        });
    }

    const resource: Practitioner = {
        resourceType: "Practitioner",
        identifier: identifiers,
        name: [
            {
                family: author.familyname ?? PREDEFINED_FIELDS.AUTHOR_LASTNAME,
                given: [author.firstname ?? PREDEFINED_FIELDS.AUTHOR_FIRSTNAME],
            },
        ],
    };
    return { uuid: uuidv4(), resource };
}

/**
 * Produces a FHIR PractitionerRole resource.
 * Its `practitioner` field references the paired Practitioner via `urn:uuid`.
 */
function buildPractitionerRoleResource(
    author: AuthorConfig,
    practitionerUuid: string,
): { uuid: string; resource: PractitionerRole } {
    const resource: PractitionerRole = {
        resourceType: "PractitionerRole",
        practitioner: {
            reference: `urn:uuid:${practitionerUuid}`,
        },
    };

    // Carry the CD-HCPARTY type when available
    if (author.type) {
        resource.code = [
            {
                coding: [
                    {
                        system: "https://www.ehealth.fgov.be/standards/fhir/core/CodeSystem/cd-hcparty",
                        code: author.type,
                    },
                ],
            },
        ];
    }

    return { uuid: uuidv4(), resource };
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
 * Entry order:
 *  1. One Patient resource
 *  2. For every unique author: one Practitioner + one PractitionerRole
 *  3. One MedicationStatement per non-suspension transaction
 */
export function generatePayload(config: Configuration): Bundle {

    // 1. Patient
    const { uuid: patientUuid, resource: patientResource } = buildPatientResource();

    // 2. Collect & de-duplicate authors across all non-suspension transactions
    const nonSuspensionTransactions = config.transactions.filter(
        (t) => t.suspensionReference === undefined,
    );

    const uniqueAuthors = new Map<string, AuthorConfig>();
    for (const t of nonSuspensionTransactions) {
        const author = t.author ?? config.author ?? {};
        const key = authorKey(author);
        if (!uniqueAuthors.has(key)) {
            uniqueAuthors.set(key, author);
        }
    }

    // 3. Build Practitioner + PractitionerRole for each unique author
    type AuthorResources = {
        practitionerUuid: string;
        practitionerRoleUuid: string;
        practitionerResource: Practitioner;
        practitionerRoleResource: PractitionerRole;
    };

    const authorResourceMap = new Map<string, AuthorResources>();
    for (const [key, author] of uniqueAuthors) {
        const { uuid: practitionerUuid, resource: practitionerResource } =
            buildPractitionerResource(author);
        const { uuid: practitionerRoleUuid, resource: practitionerRoleResource } =
            buildPractitionerRoleResource(author, practitionerUuid);
        authorResourceMap.set(key, {
            practitionerUuid,
            practitionerRoleUuid,
            practitionerResource,
            practitionerRoleResource,
        });
    }

    // 4. Suspension map (needed when building MedicationStatements)
    const suspensionsMap = buildSuspensionsMap(config);

    // 5. MedicationStatements
    const medicationStatements = nonSuspensionTransactions.map((t, idx) => {
        const author = t.author ?? config.author ?? {};
        const { practitionerRoleUuid } = authorResourceMap.get(authorKey(author))!;
        return buildMedicationStatement(
            config,
            t,
            idx,
            patientUuid,
            practitionerRoleUuid,
            suspensionsMap,
        );
    });

    // 6. Assemble entries
    const entries: BundleEntry[] = [
        // 6a. Patient
        { fullUrl: `urn:uuid:${patientUuid}`, resource: patientResource },

        // 6b. Practitioner + PractitionerRole pairs (one pair per unique author)
        ...[...authorResourceMap.values()].flatMap((ar) => [
            {
                fullUrl: `urn:uuid:${ar.practitionerUuid}`,
                resource: ar.practitionerResource,
            },
            {
                fullUrl: `urn:uuid:${ar.practitionerRoleUuid}`,
                resource: ar.practitionerRoleResource,
            },
        ]),

        // 6c. MedicationStatements
        ...medicationStatements.map((ms) => ({
            fullUrl: `urn:uuid:${uuidv4()}`,
            resource: ms,
        })),
    ];

    return {
        resourceType: "Bundle",
        type: "searchset",
        timestamp: getCurrentInstant(),
        total: medicationStatements.length,
        entry: entries,
    };
}

// ─── MedicationStatement builder ──────────────────────────────────────────────

function buildMedicationStatement(
    config: Configuration,
    transaction: SingleTransaction,
    idx: number,
    patientUuid: string,
    practitionerRoleUuid: string,
    suspensionsMap: Record<string, SuspensionValue[]>,
): MedicationStatement {

    const drug = transaction.drug;

    const extensionForLine: Extension[] = [
        // 1) Version of the medication line
        {
            url: "http://hl7.org/fhir/StructureDefinition/artifact-version",
            valueString: `${transaction.version ?? 1}`,
        },
        // 2) When the data was recorded
        {
            url: "https://www.ehealth.fgov.be/standards/fhir/medication/StructureDefinition/BeExtRecordedDate",
            valueDateTime: generateDateTime(config, transaction),
        },
        // 3) Recorder — TODO https://ehealth.fgov.be/standards/fhir/medication/StructureDefinition-BeExtRecorder.html
        // 4) Adherence (backported from R5)
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
        // 5) Registration status
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
        identifier: [
            {
                system: "http://ehealth.fgov.be/standards/fhir/medication/NamingSystem/be-ns-medicationline",
                value: uuidv4(),
            },
        ],
        extension: extensionForLine,
        status,
        statusReason: statusReason.length > 0 ? statusReason : undefined,
        // subject → Patient urn:uuid
        subject: {
            reference: `urn:uuid:${patientUuid}`,
        },
        dateAsserted: getCurrentInstant(),
        // informationSource → PractitionerRole urn:uuid (not the Practitioner)
        informationSource: {
            reference: `urn:uuid:${practitionerRoleUuid}`,
        },
        medicationCodeableConcept: generateDrug(drug, idx),
        dosage:
            drug.regimen === undefined
                ? [fromKMEHRFreeTextPosologyToFHIRDosage(drug)]
                : fromKEMHRRegimenToFHIRDosage(drug.regimen, drug),
        effectivePeriod: generateEffectivePeriod(drug),
    };
}

// ─── Pure helpers (unchanged logic) ──────────────────────────────────────────

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
