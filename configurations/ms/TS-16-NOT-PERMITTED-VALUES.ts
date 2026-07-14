import type { MSConfiguration } from "@smals-jy/kmehr-tests";

export default function (): MSConfiguration {
  return {
    transactions: [
      // A medication that goes forever
      {
        id: 2,
        drug: {
          drugType: "medicinalproduct",
          identifierType: "CD-DRUG-CNK",
          intendedcd: "2732808",
          intendedname: "Pantomed 40 mg (PI Pharma) maagsapresist. tabl. 56",
          beginmoment: "2024-01-15",
          temporality: "chronic",
          periodicity: "D",
          regimen: [
            {
              quantity: 1,
              unit: "00005",
              timeOfDay: {
                dayPeriod: "beforebreakfast",
              },
            },
          ],
          instructionForPatient:
            "Take one tablet before breakfast daily. CD-ITEM-MS with adaptation flag.",
        },
      },
      // CD-LIFECYCLE with stopped - suspension referencing medication id 2
      {
        id: 3,
        drug: {
          drugType: "medicinalproduct",
          identifierType: "CD-DRUG-CNK",
          intendedcd: "2732808",
          intendedname: "Pantomed 40 mg (PI Pharma) maagsapresist. tabl. 56",
          beginmoment: "2027-01-01",
          lifecycle: "stopped",
          regimen: [
            {
              quantity: 1,
              unit: "00005",
              timeOfDay: {
                dayPeriod: "beforebreakfast",
              },
            },
          ]
        },
        suspensionReference: 2,
        suspensionReason: "Treatment completed - medication stopped.",
      },
      // CD-ITEM-MS with adaptationflag - different medication
      {
        id: 4,
        adaptationflag: true,
        drug: {
          drugType: "medicinalproduct",
          identifierType: "CD-DRUG-CNK",
          intendedcd: "1089145",
          intendedname: "Paracetamol Accord 500 mg comp. 20",
          beginmoment: "2024-02-10",
          temporality: "chronic",
          periodicity: "D",
          regimen: [
            {
              quantity: 2,
              unit: "00001",
              timeOfDay: {
                dayPeriod: "aftermeals",
              },
            },
          ],
          instructionForPatient:
            "Take two tablets after meals. CD-ITEM-MS with adaptation flag.",
        },
      },
    ],
  };
}
