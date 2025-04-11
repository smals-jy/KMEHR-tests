import type { FHIRPrescriptionConfiguration } from "@smals-jy/kmehr-tests";

export default function (): FHIRPrescriptionConfiguration {
    return {
        type: "P0",
        transactions: [
            {
                id: 1,
                drug: {
                    drugType: "compoundprescription",
                    compoundprescriptionText: `
                        R/	Ranitidine.HCL 										1.675g 
                            Mononatriumfosfaat dihydraat 				0.3g 
                            Dinatriumfosfaat dihydraat 						1.3g 
                            Water 													30g 
                            Sterke oranjeschiltinctuur 						qs 
                            Geconserveerde enkelvoudige siroop 	ad 100ml

                            dt 300 ml
                    `,
                    regimen: [
                        {
                            quantity: 1,
                            unit: "00001",
                            timeOfDay: {
                                dayPeriod: "beforebreakfast"
                            }
                        },
                        {
                            quantity: 1,
                            timeOfDay: {
                                time: "20:00:00"
                            }
                        }
                    ]
                }
            }
        ]
    }
}