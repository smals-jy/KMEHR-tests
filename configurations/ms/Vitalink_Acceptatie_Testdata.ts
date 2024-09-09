import type { Configuration, AuthorConfig } from "../../src/config";

/*
Test scenario provided by Vitalink

https://vitalink.be/sites/default/files/2022-05/Vitalink_Acceptatie_Testdata_v0.5.pdf

Found on https://vitalink.be/voor-ontwikkelaars/technische-documentatie
*/

export default function (): Configuration {
  // Some authors
  const AUTHORS = {
    DR_MICKEY_MOUSE: {
      firstname: "Mickey",
      familyname: "Mouse",
      nihdi: "11186375004",
      type: "persphysician"
    },
    NURSE_PIGGY: {
      firstname: "Piggy",
      familyname: "Muppets",
      nihdi: "45598314401",
      type: "persnurse"
    },
    DENTIST_PICSOU: {
      firstname: "Balthazar",
      familyname: "Picsou",
      nihdi: "30019619001",
      type: "persdentist"
    },
    PHARMACIST_DINGO: {
      familyname: "Goof",
      firstname: "Goofy",
      nihdi: "20807092001",
      type: "perspharmacist"
    },
    PHARMACY_200: {
      familyname: "Doe",
      firstname: "John",
      type: "perspharmacist",
      hub: "RSB",
      org: {
        type: "orgpharmacy",
        nihdi: "80000551",
        name: "Pharmacie - code 200",
      },
    },
  } satisfies Record<string, AuthorConfig>;

  return {
    author: AUTHORS.DR_MICKEY_MOUSE,
    transactions: [
      // Entry A1
      {
        id: 2,
        version: 2,
        drug: {
          drugType: "medicinalproduct",
          intendedcd: "0039347",
          intendedname: "Dafalgan 500 mg comp. 30",
          periodicity: "W",
          route: "00064",
          regimen: ["monday", "wednesday", "friday"].map((day) => ({
            quantity: 1,
            unit: "00005",
            timeOfDay: {
              dayPeriod: "duringbreakfast",
            },
            dayIngestion: {
              weekday: day as any,
            },
          })),
        },
      },
      // Entry B1
      {
        id: 3,
        version: 2,
        author: AUTHORS.PHARMACIST_DINGO,
        drug: {
          drugType: "medicinalproduct",
          intendedcd: "0119065",
          intendedname: "Marcoumar 3 mg comp. 25",
          periodicity: "D",
          posologyFreeText: "volgens bloedanalyse",
          instructionForPatient: "volgens bloedanalyse",
        },
      },
      // Entry C1
      {
        id: 4,
        version: 2,
        isValidated: false,
        // I don't have a organization of nurses so I use what I have on hand
        author: AUTHORS.PHARMACY_200,
        drug: {
          drugType: "medicinalproduct",
          intendedcd: "2257095",
          intendedname: "Amoxicilline EG 1000 mg compr. efferv. 8",
          beginmoment: "2022-06-10",
          endmoment: "2022-06-20",
          periodicity: "D",
          medicationuse: "To treat bacterial infections",
        },
      },
      // Entry D1
      {
        id: 5,
        version: 4,
        drug: {
          drugType: "medicinalproduct",
          intendedcd: "0066746",
          intendedname:
            "Penicilline 1000000 UI sol. inj. (pdr.) i.m./i.v./i.artic. flac. 100 x 1 10*6 UI",
          periodicity: "O1",
          temporality: "acute",
          beginmoment: "2022-07-02",
          endmoment: "2022-07-20",
          comment: "Stopping of drug",
        },
      },
      // Entry E1
      {
        id: 6,
        version: 2,
        drug: {
          drugType: "medicinalproduct",
          intendedcd: "1557396",
          intendedname: "Zinnat 500 mg compr. pellic. 20",
          periodicity: "DN",
          temporality: "chronic",
          beginmoment: "2023-01-01",
          regimen: [
            [1, 1],
            [2, 1],
            [3, 1],
            [4, 0.5],
            [5, 0.5],
            [6, 0.5],
            [7, 0.25],
            [8, 0.25],
            [9, 0.25],
          ]
            .map(([dayNumber, quantity]) => [
              {
                quantity: quantity,
                timeOfDay: {
                  dayPeriod: "morning" as any,
                },
                dayIngestion: {
                  dayNumber: dayNumber,
                },
              },
              {
                quantity: quantity,
                timeOfDay: {
                  dayPeriod: "duringlunch" as any,
                },
                dayIngestion: {
                  dayNumber: dayNumber,
                },
              },
              {
                quantity: quantity,
                timeOfDay: {
                  dayPeriod: "thehourofsleep" as any,
                },
                dayIngestion: {
                  dayNumber: dayNumber,
                },
              },
            ])
            .flat(),
        },
      },
      // Entry F1
      {
        id: 7,
        version: 2,
        drug: {
          drugType: "medicinalproduct",
          // I know it is "2133411" but :
          // That drug isn't present on SAMViewer but exists in sciensano lists ...
          // https://www.sciensano.be/sites/default/files/ddds_list_2023.xlsx
          // Confirmed by Wouter, it was a legacy code & "2915353" replaced it
          intendedcd: "2915353",
          intendedname: "Clarithromycine Sandoz 500 mg compr. pellic. 21",
          periodicity: "D",
          regimen: [
            {
              quantity: 1,
              timeOfDay: {
                dayPeriod: "beforebreakfast",
              },
            },
          ],
        },
      },
      // Entry G1
      {
        id: 8,
        version: 2,
        author: AUTHORS.NURSE_PIGGY,
        drug: {
          drugType: "medicinalproduct",
          intendedcd: "2744753",
          intendedname:
            "Clindamycine Fresenius Kabi 150 mg/ml sol. inj. i.m./i.v. amp. 10 x 2 ml",
          begincondition: "afwisselend: 1/2 per dag, en 2x 1/2 per dag",
          periodicity: "DT",
          regimen: [
            {
              quantity: 0.5,
              timeOfDay: {
                dayPeriod: "morning",
              },
              dayIngestion: {
                dayNumber: 1,
              },
            },
            {
              quantity: 0.5,
              timeOfDay: {
                dayPeriod: "morning",
              },
              dayIngestion: {
                dayNumber: 2,
              },
            },
            {
              quantity: 0.5,
              timeOfDay: {
                dayPeriod: "duringdinner",
              },
              dayIngestion: {
                dayNumber: 2,
              },
            },
          ],
        },
      },
      // Entry H1
      {
        id: 9,
        version: 2,
        author: AUTHORS.PHARMACIST_DINGO,
        isValidated: false,
        drug: {
          drugType: "medicinalproduct",
          intendedcd: "0062521",
          intendedname: "Nystatine Labaz 100000 UI/ml susp. buv. 24 ml",
          temporality: "oneshot",
          posologyFreeText: "adhoc",
        },
      },
      // Entry I1
      {
        id: 10,
        version: 3,
        drug: {
          drugType: "substanceproduct",
          identifierType: "CD-VMPGROUP",
          // Quite a shame that neither SPF Gezondheid / BCFI / eHealth don't have the tables anymore to understand "8047896"
          // So I use an unofficial source :
          // "8047896":{"fr":"benzylpénicilline 1000000 UI poudre (inj.)","nl":"benzylpenicilline 1000000 IE poeder (inj.)"},
          // https://github.com/taktik/freehealth-connector/blob/master/src/main/resources/cdInncluster.json
          // Looking in SAMv2, we have either "3301" or "45229"
          intendedcd: "3301" /** "8047896" */,
          intendedname: "benzylpénicilline 1000000 UI poudre (inj.)",
          temporality: "chronic",
          regimen: [
            {
              quantity: 0.25,
              timeOfDay: {
                dayPeriod: "duringbreakfast",
              },
            },
            {
              quantity: 0.25,
              timeOfDay: {
                dayPeriod: "duringdinner",
              },
            },
          ],
        },
      },
      // Entry J1
      {
        id: 11,
        version: 2,
        author: AUTHORS.NURSE_PIGGY,
        drug: {
          drugType: "medicinalproduct",
          intendedcd: "0041020",
          intendedname: "Fasigyn 500 mg compr. pellic. 4",
          temporality: "chronic",
          periodicity: "DD",
          endcondition: "wanneer niet nodig",
          regimen: [
            {
              quantity: 1,
              timeOfDay: {
                dayPeriod: "duringbreakfast",
              },
            },
          ],
        },
      },
      // Entry K1
      {
        id: 12,
        version: 2,
        author: AUTHORS.PHARMACIST_DINGO,
        isValidated: false,
        drug: {
          drugType: "compoundprescription",
          compoundprescriptionText: "magistrale bereiding",
          posologyFreeText: "adhoc: wanneer nodig",
        },
      },
      // Entry L3
      {
        id: 13,
        version: 4,
        drug: {
          drugType: "medicinalproduct",
          intendedcd: "2120046",
          intendedname: "Fluconazole Mylan 50 mg gél. 10",
          temporality: "chronic",
          beginmoment: "2022-01-01",
          periodicity: "W",
          regimen: [
            {
              quantity: 1,
              timeOfDay: {
                dayPeriod: "duringlunch",
              },
              dayIngestion: {
                weekday: "saturday",
              },
            },
          ],
        },
      },
    ],
  };
}
