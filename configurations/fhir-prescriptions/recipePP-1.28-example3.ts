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
                    intendedcd: "0000000",
                    intendedname: "Traitement oxygène gazeuse pour 1 mois",
                    periodicity: "D",
                    posologyFreeText: "10 L/min pendant environ 15 minutes"
                }
            }
        ]
    }
}