import type { FHIRPrescriptionConfiguration } from "@smals-jy/kmehr-tests";

export default function (): FHIRPrescriptionConfiguration {
    return {
        type: "P0",
        transactions: [
            {
                id: 1,
                issubstitutionallowed: false,
                drug: {
                    drugType: "medicinalproduct",
                    identifierType: "CD-DRUG-CNK",
                    intendedcd: "0029025",
                    intendedname: "Augmentin 500/125 filmomh. tabl. (deelb.) 16x",
                    periodicity: "D",
                    duration: {
                        quantity: 5,
                        timeunit: "d"
                    },
                    regimen: [
                        {
                            quantity: 1,
                            timeOfDay: {
                                dayPeriod: "afterbreakfast"
                            }
                        },
                        {
                            quantity: 1,
                            timeOfDay: {
                                dayPeriod: "afterdinner"
                            }
                        },
                        {
                            quantity: 1,
                            timeOfDay: {
                                dayPeriod: "afterdinner"
                            }
                        }
                    ],
                }
            }
        ]
    }
}