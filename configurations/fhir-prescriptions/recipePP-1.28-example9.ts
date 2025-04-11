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
                    intendedcd: "0867556",
                    intendedname: "Brufen filmomh. tabl. Forte 30x 600mg",
                    periodicity: "D",
                    duration: {
                        quantity: 5,
                        timeunit: "d"
                    },
                    regimen: [
                        {
                            quantity: 1,
                            unit: "00005",
                            timeOfDay: {
                                dayPeriod: "afterbreakfast"
                            }
                        },
                        {
                            quantity: 1,
                            timeOfDay: {
                                dayPeriod: "afterlunch"
                            }
                        },
                        {
                            quantity: 1,
                            timeOfDay: {
                                dayPeriod: "afterdinner"
                            }
                        }
                    ],
                    route: "00060"
                }
            }
        ]
    }
}