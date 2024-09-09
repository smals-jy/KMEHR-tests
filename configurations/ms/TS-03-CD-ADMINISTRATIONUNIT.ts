import type { Configuration, AdministrationUnit } from "../../src/config";

export default function (): Configuration {
  // List of administration-unit
  const ADMINISTRATION_UNITS: AdministrationUnit[] = [
    "00001",
    "00002",
    "00003",
    "00004",
    "00005",
    "00006",
    "00007",
    "00008",
    "00009",
    "00010",
    "00011",
    "00012",
    "00013",
    "00014",
    "00015",
    "00016",
    "00017",
    "00018",
    "00019",
    "00020",
    "00021",
    "00022",
    "00023",
    "00024",
    "00025",
    "00026",
    "00027",
    "00028",
    "00029",
    "00030",
    //"ampoule",
    //"bandage",
    //"bottle",
    //"box",
    "cm",
    "dropsperminute",
    //"effervescent-tablet",
    "gm",
    "internationalunits",
    //"iu",
    //"liter",
    //"meq",
    "mg",
    "mg/ml",
    "mck/h",
    "mck/kg/minute",
    "measure",
    "mg/h",
    "ml/h",
    //"micrograms",
    //"miu",
    //"mmol",
    //"piece",
    //"syringe",
    //"syringe-ampoule",
    "tbl",
    "tsp",
    "unt/h",
  ];

  // Generate ADMINISTRATION UNIT entries
  return {
    transactions: ADMINISTRATION_UNITS.map((unit, idx) => {
      return {
        id: idx + 2,
        drug: {
          drugType: "compoundprescription",
          compoundprescriptionText: `${unit}`,
          temporality: "chronic",
          periodicity: "D",
          regimen: [
            // To test singular case
            {
              quantity: 1.0,
              timeOfDay: {
                dayPeriod: "morning",
              },
              unit: unit,
            },
            // To test plural case
            {
              quantity: 5.0,
              timeOfDay: {
                dayPeriod: "beforedinner",
              },
              unit: unit,
            },
          ],
        },
      };
    }),
  };
}
