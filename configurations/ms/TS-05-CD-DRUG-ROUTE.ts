import type { MSConfiguration, DrugRoute } from "@smals-jy/kmehr-tests";

export default function (): MSConfiguration {
  const routes: DrugRoute[] = [
    "00001",
    "00002",
    "00005",
    "00008",
    "00009",
    "00010",
    "00011",
    "00012",
    "00013",
    "00033",
    "00034",
    "00035",
    "00045",
    "00046",
    "00049",
    "00051",
    "00052",
    "00053",
    "00054",
    "00055",
    "00056",
    "00060",
    "00064",
    "00066",
    "00067",
    "00068",
    "00070",
    "00071",
    "00072",
    "00073",
    "both_ears",
    "both_eyes",
    "both_nostrils",
    "cutaneous_injection",
    "derm",
    "dermal_injection",
    "ear_left",
    "ear_right",
    "eye_left",
    "eye_right",
    "hyperdermoclyse",
    "icut",
    "ider",
    "larter",
    "nose_left",
    "nose_right",
    "oft",
    "transdermal",
    "vitreal_injection"
  ];

  return {
    transactions: routes.map((r, idx) => ({
      id: idx + 2,
      drug: {
        drugType: "compoundprescription",
        compoundprescriptionText: `${r}`,
        temporality: "chronic",
        periodicity: "D",
        posologyFreeText: `...`,
        route: r,
      },
    })),
  };
}
