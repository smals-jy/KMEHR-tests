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
                    intendedcd: "0000000",
                    intendedname: "La Roche Posay Cicaplast Balsem 100 ml",
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