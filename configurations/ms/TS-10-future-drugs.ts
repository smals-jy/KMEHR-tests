import type { Configuration } from "../../src/config";

// This test case (only for frontend) is to specifically for future medications in list view

// Payload
export default function (): Configuration {
  // To change the year, if somebody wish to update that test here after 2099 ;)
  const FUTURE_YEAR = "2099";
  // date in the future
  const START_FUTURE_DATE = `${FUTURE_YEAR}-01-01`;
  const END_FUTURE_DATE = `${FUTURE_YEAR}-12-30`;

  return {
    transactions: [
      {
        id: 2,
        drug: {
          drugType: "medicinalproduct",
          identifierType: "CD-DRUG-CNK",
          intendedcd: "2732808",
          intendedname: "Pantomed 40 mg (PI Pharma) maagsapresist. tabl. 56",
          beginmoment: START_FUTURE_DATE,
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
        },
      },
      {
        id: 3,
        drug: {
          drugType: "medicinalproduct",
          identifierType: "CD-DRUG-CNK",
          periodicity: "D",
          temporality: "chronic",
          intendedcd: "2933901",
          intendedname: "Dafalgan 500 mg compr. efferv.",
          posologyFreeText: "Free text",
          beginmoment: START_FUTURE_DATE,
          endcondition: END_FUTURE_DATE,
        },
      },
    ],
  };
}
