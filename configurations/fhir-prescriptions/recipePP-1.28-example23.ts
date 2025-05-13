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
                                drugType: "substanceproduct",
                                intendedcd: "0552125",
                                identifierType: "CD-DRUG-CNK",
                                intendedname: "UREUM"
                            },
                            quantity: {
                                amount: 5,
                                unit: "%wv"
                            }
                        },
                        {
                            drug: {
                                drugType: "substanceproduct",
                                intendedcd: "0535047",
                                identifierType: "CD-DRUG-CNK",
                                intendedname: "NATRIUMCHLORIDE"
                            },
                            quantity: {
                                amount: 5,
                                unit: "%wv"
                            }
                        },
                        {
                            drug: {
                                drugType: "substanceproduct",
                                intendedcd: "0587089",
                                identifierType: "CD-DRUG-CNK",
                                intendedname: "GEBUF. CETOMACR. CREME  TMF2"
                            },
                            quantity: {
                                amount: 100,
                                unit: "gm"
                            },
                            quantityPrefix: "ad"
                        }
                    ],
                    galenic: {
                        code: "3"
                    },
                    quantity: {
                        amount: 100,
                        unit: "gm"
                    },
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
