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
                    intendedcd: "0035717",
                    intendedname: "Dermovate crème 30g 0,5 mg/1 g",
                    periodicity: "D",
                    regimen: [
                        {
                            quantity: 1,
                            timeOfDay: {
                                dayPeriod: "morning"
                            }
                        },
                        {
                            quantity: 1,
                            timeOfDay: {
                                dayPeriod: "thehourofsleep"
                            }
                        }
                    ]
                }
            }
        ]
    }
}