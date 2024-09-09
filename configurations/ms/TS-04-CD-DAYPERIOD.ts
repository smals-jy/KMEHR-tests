import type { Configuration, DayPeriod } from "../../src/config";

export default function (): Configuration {
  const periods: DayPeriod[] = [
    "afterbreakfast",
    "afterdinner",
    "afterlunch",
    "beforebreakfast",
    "beforedinner",
    "beforelunch",
    "betweenbreakfastandlunch",
    "betweenlunchanddinner",
    "betweendinnerandsleep",
    "duringbreakfast",
    "duringdinner",
    "duringlunch",
    "morning",
    "thehourofsleep",
  ];

  return {
    transactions: [
      {
        id: 2,
        drug: {
          drugType: "compoundprescription",
          compoundprescriptionText: "CD-DAYPERIOD Drug",
          temporality: "chronic",
          periodicity: "MD",
          beginmoment: "2023-01-01",
          regimen: periods.map((p, idx) => ({
            quantity: 1,
            dayIngestion: {
              dayNumber: idx + 1,
            },
            timeOfDay: {
              dayPeriod: p,
            },
          })),
        },
      },
    ],
  };
}
