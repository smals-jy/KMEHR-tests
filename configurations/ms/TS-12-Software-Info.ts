import type {
  Configuration,
  TransactionConfig,
  AuthorConfig,
} from "../../src/config";

// To generate a number to a minimal length
function numberToPaddedString(num: number, minLength: number = 3): string {
  const str = num.toString();
  const paddingLength = Math.max(0, minLength - str.length);
  const padding = "0".repeat(paddingLength);
  return padding + str;
}

// Some authors
const AUTHORS = {
  DR_MICKEY_MOUSE: {
    firstname: "Mickey",
    familyname: "Mouse",
    nihdi: "11186375004",
    type: "persphysician"
  },
  NURSE_PIGGY: {
    firstname: "Piggy",
    familyname: "Muppets",
    nihdi: "45598314401",
    type: "persnurse"
  },
  DENTIST_PICSOU: {
    firstname: "Balthazar",
    familyname: "Picsou",
    nihdi: "30019619001",
    type: "persdentist"
  },
} satisfies Record<string, AuthorConfig>;

// Generate a dummy transaction so that I don't put n times the same stuff
type SimpleTransactionConfig = Partial<TransactionConfig>;
function generateTransaction(
  config: SimpleTransactionConfig,
): TransactionConfig {
  return {
    id: config.id || 2,
    drug: {
      drugType: "compoundprescription",
      compoundprescriptionText: `Drug ${numberToPaddedString(config.id || 2, 4)}`,
      temporality: "chronic",
      periodicity: "D",
      posologyFreeText: "Free text posology",
      beginmoment: "2020-01-01",
      medicationuse: config.drug?.medicationuse || "Test case scenario",
    },
    author: config.author,
  };
}

// Generate
export default function (): Configuration {
  return {
    // Medication last author was Mickey Mouse, without software info
    author: AUTHORS.DR_MICKEY_MOUSE,
    transactions: [
      // case n°1 : no software info present
      generateTransaction({
        id: 2,
        drug: {
          medicationuse: "NO SOFTWARE INFO PRESENT",
        },
        author: AUTHORS.NURSE_PIGGY,
      }),
      // case n°2 : only id present
      generateTransaction({
        id: 3,
        drug: {
          medicationuse: "ONLY SOFTWARE ID PRESENT",
        },
        author: {
          ...AUTHORS.DR_MICKEY_MOUSE,
          software: {
            id: "helena.care-prescribers",
          },
        },
      }),
      // case n°3 : full software info available
      generateTransaction({
        id: 4,
        drug: {
          medicationuse: "SOFTWARE ID & NAME PRESENT",
        },
        author: {
          ...AUTHORS.DENTIST_PICSOU,
          software: {
            id: "nihdi-vidis-caregiver",
            name: "VIDIS Healthcare Software",
          },
        },
      }),
      // case n°4 : full hcparty
      generateTransaction({
        id: 5,
        drug: {
          medicationuse: "FULL HCPARTY : author / org / software / hub",
        },
        author: {
          ...AUTHORS.DR_MICKEY_MOUSE,
          hub: "RSB",
          org: {
            type: "orghospital",
            name: "U.Z. Brussel",
          },
          software: {
            id: "nihdi-vidis-caregiver",
            name: "VIDIS Healthcare Software",
          },
        },
      }),
    ],
  };
}
