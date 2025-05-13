import type { FHIRPrescriptionConfiguration } from "@smals-jy/kmehr-tests";

export default function (): FHIRPrescriptionConfiguration {
    return {
        type: "P0",
        transactions: [
            {
                id: 1,
                drug: {
                    drugType: "compoundprescription",
                    ingredients: [
                        {
                            drug: {
                                drugType: "medicinalproduct",
                                identifierType: "CD-DRUG-CNK",
                                intendedcd: "0557678",
                                intendedname: "SULPIRIDE"
                            },
                            quantity: {
                                amount: 50,
                                unit: "mg"
                            }
                        }
                    ],
                    galenic: {
                        code: "1"
                    },
                    quantity: {
                        amount: 60,
                        unit: "unt"
                    },
                    periodicity: "D",
                    regimen: [
                        {
                            quantity: 1,
                            unit: "00004",
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
