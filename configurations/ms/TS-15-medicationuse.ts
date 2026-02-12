import type { MSConfiguration } from "@smals-jy/kmehr-tests";

export default function (): MSConfiguration {
  
  // To generate a number to a minimal length
  function numberToPaddedString(num: number, minLength: number = 3): string {
    const str = num.toString();
    const paddingLength = Math.max(0, minLength - str.length);
    const padding = "0".repeat(paddingLength);
    return padding + str;
  }

  const medicationUses = [
    undefined,
    "For stomachache"
  ]

  return {
    transactions: medicationUses.map((r, idx) => ({
      id: idx + 2,
      drug: {
        drugType: "compoundprescription",
        compoundprescriptionText: `${numberToPaddedString(idx + 1)}`,
        periodicity: "D",
        medicationuse: r,
        posologyFreeText: `${ (r !== undefined) ? "With medicationuse": "Without medicationuse" }`
      },
    })),
  };
}
