import type { FHIRPrescriptionConfiguration } from "@smals-jy/kmehr-tests";

export default function (): FHIRPrescriptionConfiguration {
    return {
        type: "P0",
        transactions: [
            {
                id: 1,
                drug: {
                    drugType: "medicinalproduct",
                    identifierType: "CD-DRUG-CNK",
                    intendedcd: "2115517",
                    intendedname: "Belsar filmomh. tabl. 98x 20 mg",
                    periodicity: "D",
                    regimen: [
                        {
                            quantity: 1,
                            timeOfDay: {
                                dayPeriod: "morning"
                            }
                        }
                    ]
                },
                // Cf. https://github.com/hl7-be/medication/pull/205
                instructionforreimbursementCode: "chronic-renal-failure-pathway"
            }
        ]
    }
}