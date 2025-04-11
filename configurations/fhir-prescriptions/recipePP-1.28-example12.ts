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
                    intendedcd: "1596915",
                    intendedname: "Yasmin 0,03/3 filmomh. tabl. 3x21",
                    periodicity: "D",
                    regimen: [
                        {
                            quantity: 1,
                            unit: "00005",
                            timeOfDay: {
                                dayPeriod: "thehourofsleep"
                            }
                        }
                    ]
                    // TODO the "renewal" concept isn't covered by HL7-BE so either won't do, either add it later
                    // https://github.com/hl7-be/medication/issues/189
                }
            }
        ]
    }
}