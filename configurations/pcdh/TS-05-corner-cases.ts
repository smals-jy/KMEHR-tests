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
    //date: "2024-02-01",
    deliveries: [
      {
        deliveredAmount: -1,
        deliveredMode: "dispensedWithoutPrescription",
        drugs: [
          // Returned medications
          {
            drugType: "medicinalproduct",
            intendedcd: "1080233",
            intendedname: "Iso-Betadine Dermicum 10 % cut. opl. 50 x 10 ml UD",
            instructionForPatient: "productCode",
          },
          // Long medication name returned
          {
            drugType: "medicinalproduct",
            intendedcd: "3639408",
            intendedname: "Efavirenz/Emtricitabine/Tenofovir Disoproxil Mylan 600 mg - 200 mg - 245 mg filmomh. tabl. 90 (3 x 30)",
            instructionForPatient: "productCode",
          },
        ],
      },
    ],
  };
}
