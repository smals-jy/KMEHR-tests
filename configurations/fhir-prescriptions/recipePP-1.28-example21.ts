import type { FHIRPrescriptionConfiguration } from "@smals-jy/kmehr-tests";

export default function (): FHIRPrescriptionConfiguration {
    return {
        type: "P0",
        transactions: [
            {
                id: 1,
                drug: {
                    drugType: "substanceproduct",
                    identifierType: "CD-VMPGROUP",
                    intendedcd: "0000174",
                    intendedname: "aceclofenac oraal 100 mg, 20 tabletten",
                    periodicity: "D",
                    route: "00060",
                    regimen: [
                        {
                            quantity: 1,
                            unit: "00005",
                            timeOfDay: {
                                dayPeriod: "duringbreakfast"
                            }
                        },
                        {
                            quantity: 1,
                            unit: "00005",
                            timeOfDay: {
                                dayPeriod: "duringdinner"
                            }
                        }
                    ],
                }
            }
        ]
    }
}
