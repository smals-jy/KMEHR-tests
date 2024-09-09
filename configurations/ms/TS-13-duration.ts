import type { Configuration, TransactionConfig } from "../../src/config";

// To generate a number to a minimal length
function numberToPaddedString(num: number, minLength: number = 3): string {
  const str = num.toString();
  const paddingLength = Math.max(0, minLength - str.length);
  const padding = "0".repeat(paddingLength);
  return padding + str;
}

// To avoid
function generateCommonPart(
  config: Partial<TransactionConfig>,
): TransactionConfig {
  return {
    id: config.id || 2,
    drug: {
      drugType: "compoundprescription",
      compoundprescriptionText: `Drug ${numberToPaddedString(config.id || 2, 4)}`,
      temporality: "chronic",
      periodicity: "D",
      medicationuse: config.drug?.medicationuse || "Test case scenario",
      ...config.drug,
    },
    suspensionReason: config.suspensionReason
      ? config.suspensionReason
      : undefined,
    suspensionReference: config.suspensionReference
      ? config.suspensionReference
      : undefined,
  };
}

export default function (): Configuration {
  // All timeunit
  const durationUnits = [
    "a",
    "d",
    "hr",
    "min",
    "mo",
    "ms",
    "ns",
    "s",
    "us",
    "wk",
  ];

  // To compute new id after the first line
  const nextId = (n: number) => 2 + durationUnits.length + n;

  // Apparently, some rule enforces the software to choose between <duration> & <endmoment>
  // "You cannot use a duration and an endmoment at the same time, you should choose one"
  // That is why such test cases will be commented off for the time being

  return {
    transactions: [
      // MS lines with only a <duration>
      ...[
        ...durationUnits.map((unit, idx) =>
          generateCommonPart({
            id: 2 + idx,
            drug: {
              beginmoment: "2023-01-01",
              duration: {
                quantity: 5,
                timeunit: unit as any,
              },
              medicationuse: `MS line with only a <duration> with ${unit} unit`,
            },
          }),
        ),
      ],
      /*
            // MS line with both <duration> & <endmoment>
            generateCommonPart({
                id: nextId(0),
                drug: {
                    beginmoment: "2023-01-01",
                    endmoment: "2023-01-12",
                    duration: {
                        quantity: 12,
                        timeunit: "d"
                    },
                    medicationuse: "MS line with both <duration> & <endmoment>"
                }
            }),
            */
      // MS line suspended by a <duration>
      generateCommonPart({
        id: nextId(1),
        drug: {
          beginmoment: "2023-01-01",
          medicationuse: "Suspended drug by a <duration>",
        },
      }),
      generateCommonPart({
        id: nextId(2),
        drug: {
          compoundprescriptionText: `Drug ${numberToPaddedString(nextId(1), 4)}`,
          lifecycle: "suspended",
          beginmoment: "2023-01-03",
          duration: {
            quantity: 5,
            timeunit: "d",
          },
        },
        suspensionReference: nextId(1),
        suspensionReason: "Suspended drug by a <duration>",
      }),
      /*
            // MS line suspended by a <duration> & <endmoment>
            generateCommonPart({
                id: nextId(3),
                drug: {
                    beginmoment: "2023-01-01",
                    medicationuse: "Suspended drug by a <duration> & <endmoment>"
                }
            }),
            generateCommonPart({
                id: nextId(4),
                drug: {
                    compoundprescriptionText: `Drug ${numberToPaddedString(nextId(3), 4)}`,
                    lifecycle: "suspended",
                    beginmoment: "2023-01-03",
                    endmoment: "2023-01-08",
                    duration: {
                        quantity: 5,
                        timeunit: "d"
                    }
                },
                suspensionReference: nextId(3),
                suspensionReason: "Suspended drug by a <duration> & <endmoment>"
            }),
            */
    ],
  };
}
