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
                    intendedcd: "0318717",
                    intendedname: "Adalat tabl. verl. afgifte Oros 28x 30 mg",
                    periodicity: "D",
                    regimen: [
                        {
                            quantity: 1,
                            unit: "00005",
                            timeOfDay: {
                                dayPeriod: "morning"
                            }
                        }
                    ]
                }
            },
            {
                id: 2,
                drug: {
                    drugType: "medicinalproduct",
                    identifierType: "CD-DRUG-CNK",
                    intendedcd: "0000000",
                    intendedname: "La Roche Posay Cicaplast Balsem 100 ml",
                    periodicity: "D",
                    regimen: [
                        {
                            quantity: 1,
                            timeOfDay: {
                                dayPeriod: "morning"
                            }
                        },
                        {
                            quantity: 1,
                            timeOfDay: {
                                dayPeriod: "thehourofsleep"
                            }
                        }
                    ]
                }
            },
            {
                id: 3,
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