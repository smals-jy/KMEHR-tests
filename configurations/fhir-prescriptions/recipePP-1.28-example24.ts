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
                                intendedcd: "0586982",
                                identifierType: "CD-DRUG-CNK",
                                intendedname: "RANITIDINEHYDROCHLORIDE"
                            },
                            quantity: {
                                amount: 1.675,
                                unit: "gm"
                            }
                        },
                        {
                            drug: {
                                drugType: "substanceproduct",
                                intendedcd: "0535559",
                                identifierType: "CD-DRUG-CNK",
                                intendedname: "SODIUM (MONO) PHOSPHATE DIHYDRATE"
                            },
                            quantity: {
                                amount: 0.3,
                                unit: "gm"
                            }
                        },
                        {
                            drug: {
                                drugType: "substanceproduct",
                                intendedcd: "0535534",
                                identifierType: "CD-DRUG-CNK",
                                intendedname: "DINATRIUMFOSFAAT DIHYDRAAT"
                            },
                            quantity: {
                                amount: 1.7,
                                unit: "gm"
                            }
                        },
                        {
                            drug: {
                                drugType: "substanceproduct",
                                intendedcd: "0507541",
                                identifierType: "CD-DRUG-CNK",
                                intendedname: "WATER GEZUIVERD"
                            },
                            quantity: {
                                amount: 30,
                                unit: "gm"
                            }
                        },
                        {
                            drug: {
                                drugType: "substanceproduct",
                                intendedcd: "0589044",
                                identifierType: "CD-DRUG-CNK",
                                intendedname: "ORANJESCHILTINCTUUR (BITTERE) (EPIC. EN MESOCARP.)"
                            },
                            quantityPrefix: "qs"
                        },
                        {
                            drug: {
                                drugType: "substanceproduct",
                                intendedcd: "0584938",
                                identifierType: "CD-DRUG-CNK",
                                intendedname: "GECONSERVEERDE SUIKERSTROOP"
                            },
                            quantity: {
                                amount: 100,
                                unit: "ml"
                            },
                            quantityPrefix: "ad"
                        }
                    ],
                    galenic: {
                        code: "16"
                    },
                    quantity: {
                        amount: 300,
                        unit: "ml"
                    },
                    posologyFreeText: "gebruik gekend"
                }
            }
        ]
    }
}
