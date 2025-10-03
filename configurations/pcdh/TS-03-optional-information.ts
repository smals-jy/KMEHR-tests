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
    //date: "2024-02-06",
    deliveries: [
      {
        deliveredAmount: 1,
        deliveredMode: "dispensedForSamePrescription",
        drugs: [
          // beginMoment
          {
            intendedname: "administrationInstructions - beginmoment",
            intendedcd: "0000000",
            instructionForPatient: "beginmoment case",
            beginmoment: "2023-09-16",
          },
          // endmoment
          {
            intendedname: "administrationInstructions - endmoment",
            intendedcd: "0000000",
            instructionForPatient: "endmoment case",
            endmoment: "2024-12-25",
          },
          // beginMoment & endmoment
          {
            intendedname:
              "administrationInstructions - beginmoment & endmoment",
            intendedcd: "0000000",
            instructionForPatient: "beginmoment & endmoment case",
            beginmoment: "2023-09-16",
            endmoment: "2024-12-25",
          },
          // duration
          {
            intendedname: "administrationInstructions - duration",
            intendedcd: "0000000",
            instructionForPatient: "duration case",
            duration: {
              quantity: 5,
              timeunit: "wk",
            },
          },
          // route
          {
            intendedname: "administrationInstructions - route",
            intendedcd: "0000000",
            instructionForPatient: "route case",
            // "in ear"
            route: "00001",
          },
        ],
      },
    ],
  };
}
