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
                    intendedcd: "0318717",
                    intendedname: "Adalat tabl. verl. afgifte Oros 28x 30 mg",
                    periodicity: "D",
                    regimen: [
                        {
                            quantity: 1,
                            unit: "00005",
                            timeOfDay: {
                                dayPeriod: "morning"
                            }
                        }
                    ]
                }
            }
        ]
    }
}