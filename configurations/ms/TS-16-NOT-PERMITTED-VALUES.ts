import type { MSConfiguration } from "@smals-jy/kmehr-tests";

export default function (): MSConfiguration {
  return {
    transactions: [
      // CD-ITEM-MS with adaptationflag - medication that goes forever
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
          adaptationflag: true,
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
          beginmoment: "2024-05-10",
          lifecycle: "stopped",
          posologyFreeText: null,
        },
        suspensionReference: 2,
        suspensionReason: "Treatment completed - medication stopped.",
      },
    ],
  };
}
