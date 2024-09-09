import type { Configuration, AuthorConfig } from "../../src/config";

// Payload
export default function (): Configuration {
  // Some authors
  const AUTHORS: {
    [x: string]: AuthorConfig;
  } = {
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
  };

  // long text
  const LONG_TEXT =
    "Dit is een tekst van ongeveer 300 characters. Dit is dicht bij de maximale lengte van een tekst veld. Hierbij kijken we na of de applicatie dit accepteert. This is a text of approximately 300 characters. This is close to the maximum length of a text field. With this we check if the application accepts this.";

  return {
    // Default author is picsou (last one)
    author: AUTHORS["DENTIST_PICSOU"],
    // version of MS
    version: 16,
    // date / time of update
    date: "2023-04-01",
    time: "09:16:25",
    // transactions
    transactions: [
      {
        id: 2,
        author: AUTHORS["DR_MICKEY_MOUSE"],
        drug: {
          drugType: "medicinalproduct",
          identifierType: "CD-DRUG-CNK",
          intendedcd: "2732808",
          intendedname: "Pantomed 40 mg (PI Pharma) maagsapresist. tabl. 56",
          medicationuse:
            "New way to stop defintely a drug (VIDIS WG 3&4 - November 2022)",
          beginmoment: "2021-08-18",
          endmoment: "2021-09-01",
          periodicity: "D",
          temporality: "chronic",
          regimen: [
            {
              quantity: 1,
              timeOfDay: {
                dayPeriod: "morning",
              },
            },
          ],
          comment: "Stopzetting vanwege hartritmestoornissen",
        },
      },
      {
        id: 3,
        drug: {
          drugType: "compoundprescription",
          compoundprescriptionText: LONG_TEXT,
          posologyFreeText: LONG_TEXT,
          instructionForPatient: LONG_TEXT,
          beginmoment: "2021-08-18",
          periodicity: "D",
          temporality: "chronic",
          medicationuse: "Long drug name",
        },
      },
      {
        id: 4,
        author: AUTHORS["NURSE_PIGGY"],
        drug: {
          drugType: "compoundprescription",
          compoundprescriptionText: "DifferentQuantities",
          beginmoment: "2021-01-01",
          periodicity: "M",
          temporality: "chronic",
          regimen: [
            {
              quantity: 1.0,
              timeOfDay: {
                dayPeriod: "duringbreakfast",
              },
              dayIngestion: {
                dayNumber: 1,
              },
            },
            {
              quantity: 2.0,
              timeOfDay: {
                dayPeriod: "duringbreakfast",
              },
              dayIngestion: {
                dayNumber: 2,
              },
            },
            {
              quantity: 3.0,
              timeOfDay: {
                dayPeriod: "duringbreakfast",
              },
              dayIngestion: {
                dayNumber: 3,
              },
            },
            {
              quantity: 4.0,
              timeOfDay: {
                dayPeriod: "duringbreakfast",
              },
              dayIngestion: {
                dayNumber: 4,
              },
            },
            {
              quantity: 5.0,
              timeOfDay: {
                dayPeriod: "duringbreakfast",
              },
              dayIngestion: {
                dayNumber: 5,
              },
            },
            {
              quantity: 4.0,
              timeOfDay: {
                dayPeriod: "duringbreakfast",
              },
              dayIngestion: {
                dayNumber: 6,
              },
            },
            {
              quantity: 3.0,
              timeOfDay: {
                dayPeriod: "duringbreakfast",
              },
              dayIngestion: {
                dayNumber: 7,
              },
            },
            {
              quantity: 2.0,
              timeOfDay: {
                dayPeriod: "duringbreakfast",
              },
              dayIngestion: {
                dayNumber: 8,
              },
            },
            {
              quantity: 1.0,
              timeOfDay: {
                dayPeriod: "duringbreakfast",
              },
              dayIngestion: {
                dayNumber: 9,
              },
            },
          ],
          medicationuse: "Different quantities of drug",
        },
      },
      {
        id: 5,
        drug: {
          drugType: "compoundprescription",
          compoundprescriptionText: "If needed",
          temporality: "oneshot",
          periodicity: "D",
          medicationuse: "Ifneeded with regimen / no instructionsforpatient",
          regimen: [
            {
              quantity: 2,
              timeOfDay: {
                dayPeriod: "duringdinner",
              },
            },
            {
              quantity: 3,
              timeOfDay: {
                dayPeriod: "morning",
              },
            },
          ],
        },
      },
      {
        id: 6,
        drug: {
          drugType: "medicinalproduct",
          identifierType: "CD-DRUG-CNK",
          periodicity: "D",
          temporality: "chronic",
          intendedcd: "2933901",
          intendedname: "Dafalgan 500 mg compr. efferv.",
          posologyFreeText: "Free text",
          medicationuse: "Leaflet case",
        },
      },
    ],
  };
}
