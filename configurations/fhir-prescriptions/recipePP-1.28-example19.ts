import type { FHIRPrescriptionConfiguration } from "@smals-jy/kmehr-tests";

export default function (): FHIRPrescriptionConfiguration {
    return {
        type: "P0",
        transactions: [
            {
                id: 1,
                drug: {
                    drugType: "compoundprescription",
                    periodicity: "D",
                    ingredients: [
                        {
                            drug: {
                                drugType: "medicinalproduct",
                                intendedcd: "0103861",
                                intendedname: "Betnelan V crème 30g 1 mg/1 g",
                                identifierType: "CD-DRUG-CNK"
                            },
                            quantity: {
                                amount: 30,
                                unit: "gm"
                            }
                        },
                        {
                            drug: {
                                drugType: "substanceproduct",
                                intendedcd: "0587089",
                                intendedname: "GEBUF. CETOMACR. CREME  TMF2",
                                identifierType: "CD-DRUG-CNK"
                            },
                            quantity: {
                                amount: 30,
                                unit: "gm"
                            }
                        }
                    ],
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
