import type { FHIRPrescriptionConfiguration } from "@smals-jy/kmehr-tests";

export default function (): FHIRPrescriptionConfiguration {
    return {
        type: "P0",
        transactions: [
            {
                id: 1,
                drug: {
                    drugType: "substanceproduct",
                    identifierType: "CD-DRUG-CNK",
                    intendedcd: "0003863",
                    intendedname: "bisoprolol oraal 10 mg [CAVE deelb.]",
                    periodicity: "D",
                    duration: {
                        quantity: 90,
                        timeunit: "d"
                    },
                    regimen: [
                        {
                            quantity: 1,
                            unit: "00005",
                            timeOfDay: {
                                dayPeriod: "morning"
                            }
                        }
                    ],
                    route: "00060"
                }
            }
        ]
    }
}