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
                    intendedcd: "1560929",
                    intendedname: "Sotalol Mylan tabl. (deelb.) 56x 160 mg",
                    periodicity: "D",
                    regimen: [
                        {
                            quantity: 0.5,
                            unit: "00005",
                            timeOfDay: {
                                dayPeriod: "morning"
                            }
                        },
                        {
                            quantity: 0.5,
                            timeOfDay: {
                                dayPeriod: "beforedinner"
                            }
                        }
                    ],
                    route: "00060",
                    instructionForPatient: "Inslikken en doorspoelen met een glas water"
                }
            }
        ]
    }
}