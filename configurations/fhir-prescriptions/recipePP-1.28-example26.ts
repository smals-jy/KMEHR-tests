import type { FHIRPrescriptionConfiguration } from "@smals-jy/kmehr-tests";

export default function (): FHIRPrescriptionConfiguration {
    return {
        type: "P0",
        transactions: [
            {
                id: 1,
                drug: {
                    drugType: "compoundprescription",
                    formulary: {
                        reference: "TMF2",
                        code: "0589028",
                        name: "ERYTHROMYCINE SOL. HYDRO-ALC. 4% FTM2"
                    },
                    quantity: {
                        amount: 300,
                        unit: "ml"
                    },
                    posologyFreeText: "één - tot tweemaal per dag aanbrengen"
                }
            }
        ]
    }
}