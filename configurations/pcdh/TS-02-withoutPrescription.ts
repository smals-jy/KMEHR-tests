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
    date: "2024-02-01",
    deliveries: [
      {
        deliveredAmount: 2,
        deliveredMode: "dispensedWithoutPrescription",
        drugs: [
          // "productCode" CNK
          {
            drugType: "medicinalproduct",
            intendedcd: "1727395",
            intendedname: "Sinutab Forte 500 mg - 60 mg comp.",
            instructionForPatient: "productCode",
          },
        ],
      },
    ],
  };
}
