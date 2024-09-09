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
    date: "2024-02-06",
    deliveries: [
      {
        deliveredAmount: 1,
        deliveredMode: "dispensedForSamePrescription",
        drugs: [
          // "productCode" CNK
          {
            drugType: "medicinalproduct",
            intendedcd: "1727395",
            intendedname: "Sinutab Forte 500 mg - 60 mg comp.",
            instructionForPatient: "productCode",
          },
          // magistralPreparation - magistralText
          {
            drugType: "compoundprescription",
            compoundprescriptionText: "Free text drug",
            instructionForPatient: "magistralPreparation - magistralText",
          },
          // magistralPreparation - formularyReference
          {
            drugType: "compoundprescription",
            formulary: {
              code: "0589028",
              name: "ERYTHROMYCINE SOL. HYDRO-ALC. 4% FTM2",
            },
            instructionForPatient: "magistralPreparation - formularyReference",
          },
          // magistralPreparation - compound
          {
            drugType: "compoundprescription",
            ingredients: [
              // medicinalproduct - intended
              {
                drug: {
                  drugType: "medicinalproduct",
                  intendedcd: "1543305",
                  intendedname: "ATROVENT MONODOSE 0,25MG/2ML VIALS 20",
                },
                quantity: {
                  amount: 10,
                  unit: "ml",
                },
                quantityPrefix: "ad",
              },
              // medicinalproduct - intended + delivered
              {
                drug: {
                  drugType: "medicinalproduct",
                  intendedcd: "1543305",
                  intendedname: "ATROVENT MONODOSE 0,25MG/2ML VIALS 20",
                  deliveredcd: "1484229",
                  deliveredname: "Panadol 1 g comp. 50",
                },
              },
              // substance - substancecode & substancename
              {
                drug: {
                  drugType: "substanceproduct",
                  intendedcd: "0525337",
                  intendedname: "GLYCEROL",
                },
                quantity: {
                  amount: 0.2,
                  unit: "gm",
                },
              },
            ],
            instructionForPatient:
              "magistralPreparation - compound (all cases)",
          },
          // unregisteredProduct
          {
            intendedname: "unregisteredProduct",
            intendedcd: "0000000",
            instructionForPatient: "unregisteredProduct",
          },
        ],
      },
    ],
  };
}
