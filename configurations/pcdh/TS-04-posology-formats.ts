import type { PCDHConfiguration } from "../../src/config";

export default function (): PCDHConfiguration {
  return {
    author: {
      org: {
        type: "orgpharmacy",
        name: "Pharmacie - code 200",
        nihdi: "80000551",
      },
    },
    patient: {
      familyname: "Doe",
      firstname: "John",
      ssin: "12345678901",
    },
    date: "2024-02-20",
    deliveries: [
      {
        deliveredAmount: 1,
        deliveredMode: "dispensedWithoutPrescription",
        drugs: [
          // free text posology
          {
            intendedname: "Posology - TC 1",
            intendedcd: "0000000",
            posologyFreeText:
              "administrationInstructions - posology (free-text)",
            instructionForPatient:
              "administrationInstructions - posology (free-text)",
          },
          // No administrationInstructions
          {
            intendedname: "Posology - TC 2",
            intendedcd: "0000000",
            skipAdministrationInstructionsGeneration: true,
            instructionForPatient: "No administrationInstructions",
          },
          // Regimen posology - one line
          {
            intendedname: "Posology - TC 3",
            intendedcd: "0000000",
            regimen: [
              {
                quantity: 42,
                timeOfDay: {
                  dayPeriod: "betweenbreakfastandlunch",
                },
                unit: "00001",
              },
            ],
            instructionForPatient: "Posology - regimen (one line)",
          },
          // Regimen posology - n lines
          {
            intendedname: "Posology - TC 4",
            intendedcd: "0000000",
            regimen: [
              {
                quantity: 42,
                timeOfDay: {
                  dayPeriod: "betweenbreakfastandlunch",
                },
                unit: "00001",
              },
              {
                quantity: 25,
                timeOfDay: {
                  dayPeriod: "afterdinner",
                },
                unit: "00001",
              },
            ],
            instructionForPatient: "Posology - regimen (multiple lines)",
          },
        ],
      },
    ],
  };
}
