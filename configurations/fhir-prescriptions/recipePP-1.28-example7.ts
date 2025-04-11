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
                    intendedcd: "2312577",
                    intendedname: "Moxonidine Sandoz filmomh. tabl. 100 x 0,4 mg",
                    periodicity: "D",
                    regimen: [
                        {
                            quantity: 1,
                            timeOfDay: {
                                dayPeriod: "morning"
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