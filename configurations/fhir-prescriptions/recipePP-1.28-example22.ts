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
                                intendedcd: "0539320",
                                intendedname: "PASSIFLORAE HERBAE TINCTURA",
                                identifierType: "CD-DRUG-CNK"
                            }
                        },
                        {
                            drug: {
                                drugType: "compoundprescription",
                                compoundprescriptionText: "BALLOTAE NIGRAE HERBAE TINCTURA NORMATA"
                            }
                        },
                        {
                            drug: {
                                drugType: "substanceproduct",
                                intendedcd: "0517938",
                                intendedname: "CRATAEGI TINCTURA"
                            },
                            quantity: {
                                amount: 100,
                                unit: "ml"
                            },
                            quantityPrefix: "ana ad"
                        }
                    ],
                    galenic: {
                        code: "20"
                    },
                    quantity: {
                        amount: 100,
                        unit: "ml"
                    },
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
