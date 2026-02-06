import type { MSConfiguration } from "@smals-jy/kmehr-tests";

// Sources : 
// https://www.ehealth.fgov.be/standards/kmehr/en/tables/temporality
// https://www.ehealth.fgov.be/standards/file/cc73d96153bbd5448a56f19d925d05b1379c7f21/057e64396c1ea312a0b01607b0f94e4adcf456e8/20210331-safe_cookbook_medicatieschema_v5.8_en.pdf
type temporality = "acute" | "chronic" | "oneshot" | undefined;

export default function (): MSConfiguration {
  const temporalities : temporality[] = [
    "acute",
    "chronic",
    "oneshot"
  ];

  return {
    transactions: temporalities.map((t, idx) => ({
      id: idx + 2,
      drug: {
        drugType: "compoundprescription",
        compoundprescriptionText: `${t}`,
        temporality: t,
        periodicity: "D",
        posologyFreeText: `...`
      },
    })),
  };
}
