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
                                intendedcd: "0103861",
                                intendedname: "Betnelan V crème 30g 1 mg/1 g"
                            },
                            quantity: {
                                amount: 30,
                                unit: "gm"
                            }
                        },
                        {
                            drug: {
                                drugType: "substanceproduct",
                                identifierType: "CD-DRUG-CNK",
                                intendedcd: "0587089",
                                intendedname: "GEBUF. CETOMACR. CREME  TMF2"
                            },
                            quantity: {
                                amount: 30,
                                unit: "gm"
                            }
                        }
                    ],
                    galenic: {
                        code: "3"
                    },
                    posologyFreeText: "gebruik gekend"
                }
            }
        ]
    }
}
