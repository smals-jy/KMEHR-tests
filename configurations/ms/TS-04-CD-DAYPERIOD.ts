import type { MSConfiguration, DayPeriod } from "@smals-jy/kmehr-tests";

export default function (): MSConfiguration {
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
