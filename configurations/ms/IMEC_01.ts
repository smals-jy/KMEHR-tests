import type { Configuration } from "../../src/config";

export default function (): Configuration {
  return {
    version: 1,
    date: "2024-09-01",
    time: "09:00:00",
    transactions: [
      {
        id: 2,
        transactionDate: "2024-09-01",
        transactionTime: "09:02:00",
        drug: {
          intendedcd: "2732808",
          intendedname: "Pantomed 40 mg (PI Pharma) maagsapresist. tabl. 56",
          beginmoment: "2024-10-26",
          endmoment: "2024-12-31",
          temporality: "acute",
          periodicity: "DT",
          regimen: [
            {
                dayIngestion: {
                    dayNumber: 1
                },
                timeOfDay: {
                    dayPeriod: "beforebreakfast"
                },
                quantity: 0.5,
                unit: "00005"
            }
          ],
          instructionForPatient: "Stopzetting 100"
        },
      },
      {
        id: 3,
        transactionDate: "2024-09-01",
        transactionTime: "09:03:00",
        drug: {
          intendedcd: "3391273",
          intendedname: "Dafalgan Forte 1 g bruistabl. 40",
          beginmoment: "2024-10-26",
          temporality: "chronic",
          periodicity: "D",
          regimen: [
            {
                dayIngestion: {
                    dayNumber: 1
                },
                timeOfDay: {
                    dayPeriod: "beforebreakfast"
                },
                quantity: 1,
                unit: "00005"
            }
          ],
          route: "00060"
        },
      },
      {
        id: 4,
        transactionDate: "2024-09-01",
        transactionTime: "09:04:00",
        drug: {
          intendedcd: "0895540",
          intendedname: "Medrol 32 mg tabl. 20",
          beginmoment: "2024-10-26",
          endmoment: "2024-12-31",
          temporality: "acute",
          periodicity: "D",
          regimen: [
            {
                dayIngestion: {
                    dayNumber: 1
                },
                timeOfDay: {
                    dayPeriod: "beforebreakfast"
                },
                quantity: 1,
                unit: "00005"
            }
          ],
          route: "00060",
          instructionForPatient: "Stopzetting 102"
        },
      },
      {
        id: 5,
        transactionDate: "2024-09-01",
        transactionTime: "09:05:00",
        drug: {
          intendedcd: "2225597",
          intendedname: "Aranesp 150 µg/0,3 ml inj. opl. s.c. voorgev. pen 0.3 ml",
          beginmoment: "2020-10-01",
          temporality: "chronic",
          periodicity: "D",
          regimen: [
            {
                dayIngestion: {
                    dayNumber: 1
                },
                timeOfDay: {
                    dayPeriod: "morning"
                },
                quantity: 1,
                unit: "00022"
            }
          ],
          route: "00068"
        },
      },
      {
        id: 6,
        transactionDate: "2024-09-01",
        transactionTime: "09:06:00",
        drug: {
          intendedcd: "2218253",
          intendedname: "Durogesic 50 µg/h transderm. pleister zakje 10 (8,4 mg/21 cm²)",
          beginmoment: "2024-10-26",
          temporality: "chronic",
          periodicity: "W",
          route: "00002",
          regimen: [
            {
                dayIngestion: {
                    weekday: "monday"
                },
                timeOfDay: {
                    dayPeriod: "morning"
                },
                quantity: 1,
                unit: "00020"
            },
            {
                dayIngestion: {
                    weekday: "friday"
                },
                timeOfDay: {
                    dayPeriod: "morning"
                },
                quantity: 1,
                unit: "00020"
            },
          ]
        },
      },
      {
        id: 7,
        transactionDate: "2024-09-01",
        transactionTime: "09:07:00",
        drug: {
          intendedcd: "0431569",
          intendedname: "Fraxiparine 5700 IU (Anti-Xa)/0,6 ml inj. sol. s.c. pre-filled syr.",
          beginmoment: "2024-10-26",
          endmoment: "2024-12-31",
          temporality: "chronic",
          periodicity: "DV",
          regimen: [1, 2, 4].map(dayNumber => ({
            dayIngestion: {
              dayNumber: dayNumber
            },
            timeOfDay: {
              dayPeriod: "morning"
            },
            quantity: 1,
            unit: "00002"
          })),
          instructionForPatient: "Stopzetting 105"
        },
      },
      {
        id: 8,
        transactionDate: "2024-09-01",
        transactionTime: "09:08:00",
        drug: {
          intendedcd: "2083491",
          intendedname: "Omacor 1000 mg zachte caps. 28",
          beginmoment: "2024-10-26",
          endmoment: "2024-10-30",
          temporality: "chronic",
          periodicity: "D",
          regimen: [
            {
              dayIngestion: {
                dayNumber: 1
              },
              timeOfDay: {
                dayPeriod: "morning"
              },
              quantity: 1,
              unit: "00004"
            }
          ],
          route: "00060"
        },
      },
      {
        id: 9,
        transactionDate: "2024-09-01",
        transactionTime: "09:09:00",
        drug: {
          intendedcd: "2573152",
          intendedname: "Movicol Neutral 13,7 g or. opl. (pdr.) zakje 20",
          beginmoment: "2024-10-26",
          endmoment: "2024-10-30",
          temporality: "chronic",
          periodicity: "W",
          regimen: [
            {
              dayIngestion: {
                dayNumber: 1
              },
              timeOfDay: {
                dayPeriod: "duringbreakfast"
              },
              quantity: 1,
              unit: "00029"
            }
          ],
          route: "00060"
        },
      },
      {
        id: 10,
        transactionDate: "2024-09-01",
        transactionTime: "09:10:00",
        drug: {
          intendedcd: "1638311",
          intendedname: "Perdolan Compositum 400 mg - 400 mg - 92 mg zetpil 12",
          instructionForPatient: "Stopzetting 110",
          beginmoment: "2024-10-26",
          endmoment: "2024-12-31",
          temporality: "acute",
          periodicity: "D",
          regimen: [
            {
              dayIngestion: {
                dayNumber: 1
              },
              timeOfDay: {
                dayPeriod: "beforelunch"
              },
              quantity: 1,
              unit: "00026"
            }
          ],
          route: "00067"
        },
      },
      {
        id: 11,
        transactionDate: "2024-09-01",
        transactionTime: "09:11:00",
        drug: {
          intendedcd: "3175510",
          intendedname: "Azithromycine EG 500 mg filmomh. tabl. 24",
          beginmoment: "2024-10-26",
          endmoment: "2024-12-31",
          temporality: "acute",
          periodicity: "J",
          regimen: [
            {
              dayIngestion: {
                date: "2024-10-01"
              },
              timeOfDay: {
                dayPeriod: "thehourofsleep"
              },
              quantity: 1,
              unit: "00005"
            }
          ],
          route: "00060"
        },
      },
      {
        id: 12,
        transactionDate: "2024-09-01",
        transactionTime: "09:12:00",
        drug: {
          intendedcd: "0048363",
          intendedname: "Hydrocortisone tabl. (deelb.) 20x 20 mg",
          beginmoment: "2024-10-26",
          endmoment: "2024-10-30",
          temporality: "chronic",
          periodicity: "W",
          regimen: [
            {
              dayIngestion: {
                weekday: "monday"
              },
              timeOfDay: {
                dayPeriod: "duringbreakfast"
              },
              quantity: 1,
              unit: "00005"
            }
          ],
          route: "00060"
        },
      },
      {
        id: 13,
        transactionDate: "2024-09-01",
        transactionTime: "09:13:00",
        drug: {
          intendedcd: "0135913",
          intendedname: "Ventolin 100 microgrammes/dose dosisaerosol susp. spuitbus 200 doses",
          beginmoment: "2024-10-26",
          endmoment: "2024-12-31",
          temporality: "acute",
          periodicity: "DZ",
          regimen: [1,5,6].map(dayNumber => ({
            dayIngestion: {
              dayNumber: dayNumber
            },
            timeOfDay: {
              dayPeriod: "beforelunch"
            },
            quantity: 1,
            unit: "00023"
          })),
          route: "00049"
        },
      },
      {
        id: 14,
        transactionDate: "2024-09-01",
        transactionTime: "09:03:00",
        drug: {
          intendedcd: "2917110",
          intendedname: "Magistrale Bereiding",
          beginmoment: "2024-03-10",
          endmoment: "2025-03-31",
          temporality: "acute",
          periodicity: "D",
          posologyFreeText: "Zalf smeren wanneer nodig. (CNK '2917-110' voor de bereidingen waarvan alle ingrediënten tenminste een D4-verdunning zijn)",
          route: "00002"
        },
      },
      {
        id: 5,
        transactionDate: "2024-02-01",
        transactionTime: "09:05:00",
        drug: {
          intendedcd: "2542488",
          intendedname: "Asaflow 80mg Comp Gastro Resist Bli 168x 80mg",
          beginmoment: "2024-02-13",
          endmoment: "2024-12-31",
          temporality: "chronic",
          periodicity: "D",
          regimen: [
            {
              dayIngestion: {
                dayNumber: 1
              },
              timeOfDay: {
                time: "18:00:00"
              },
              quantity: 1,
              unit: "00005"
            }
          ],
          route: "00068"
        },
      },
    ],
  };
}
