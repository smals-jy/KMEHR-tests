// TODO change that import a bit later
import type { TransactionConfig } from "../../src/config";
import type { MSConfiguration } from "@smals-jy/kmehr-tests";

// To generate a number to a minimal length
function numberToPaddedString(num: number, minLength: number = 3): string {
  const str = num.toString();
  const paddingLength = Math.max(0, minLength - str.length);
  const padding = "0".repeat(paddingLength);
  return padding + str;
}

// To generate some range useful in the testing
// console.log(generateDateRange("2022-07-01", 2, 5)); // ["2022-07-03", "2022-07-08"]
// console.log(generateDateRange("2023-01-15", 0, 7)); // ["2023-01-15", "2023-01-21"]
// console.log(generateDateRange("2024-02-29", 1, 3)); // ["2024-03-01", "2024-03-03"]
function generateDateRange(
  dateString: string,
  startDays: number,
  period: number,
): string[] {
  const startDate = new Date(dateString);
  const endDate = new Date(
    startDate.getTime() + (period - 1) * 24 * 60 * 60 * 1000,
  );
  const startOffset = (startDays - 1) * 24 * 60 * 60 * 1000;
  const startDateAdjusted = new Date(startDate.getTime() + startOffset);
  const endDateAdjusted = new Date(endDate.getTime() + startOffset);
  const startDateString = startDateAdjusted.toISOString().substring(0, 10);
  const endDateString = endDateAdjusted.toISOString().substring(0, 10);
  return [startDateString, endDateString];
}

// for the suspension scenarios description
type Scenario = {
  // when the drug starts
  start: string;
  // when the drug ends (optional)
  end?: string;
  // Title, to use in medicationuse
  title: string;
  // suspensions
  suspensions: {
    // Which kind of suspension we have
    type: "definitive" | "temporary";
    // When the suspension starts
    start: string;
    // When the suspension end (optional)
    end?: string;
  }[];
};

// Generate test scenario
function generateTestScenario(): Scenario[] {
  // When all drugs starts ...
  const DRUG_COMMON_START_DATE = "2022-07-01";
  // When all drugs with end stops
  const DRUG_COMMON_END_DATE = "2022-07-24";

  // In IMEC, we have 4 test cases about TR suspensions
  // But what really matter are the periods
  // https://wiki.ivlab.ilabt.imec.be/display/VLMS/EVS_Scenarios_S03_Treatment_Suspensions

  // So begin with the most importants things
  const scenariosWithoutEndDate: Scenario[] = [
    {
      title: "3 temporary suspensions separated by one day each",
      start: DRUG_COMMON_START_DATE,
      suspensions: [
        generateDateRange(DRUG_COMMON_START_DATE, 4, 2),
        generateDateRange(DRUG_COMMON_START_DATE, 7, 2),
        generateDateRange(DRUG_COMMON_START_DATE, 10, 2),
      ].map((s) => ({
        type: "temporary",
        start: s[0],
        end: s[1],
      })),
    },
    {
      title: "2 temporary suspensions that describes an extended suspension",
      start: DRUG_COMMON_START_DATE,
      suspensions: [
        generateDateRange(DRUG_COMMON_START_DATE, 4, 4),
        generateDateRange(DRUG_COMMON_START_DATE, 8, 4),
      ].map((s) => ({
        type: "temporary",
        start: s[0],
        end: s[1],
      })),
    },
    {
      title: "2 temporary suspensions that overlap fully",
      start: DRUG_COMMON_START_DATE,
      suspensions: [
        generateDateRange(DRUG_COMMON_START_DATE, 4, 4),
        generateDateRange(DRUG_COMMON_START_DATE, 4, 4),
      ].map((s) => ({
        type: "temporary",
        start: s[0],
        end: s[1],
      })),
    },
    {
      title: "2 temporary suspensions of same length & overlap (A-1,B+1)",
      start: DRUG_COMMON_START_DATE,
      suspensions: [
        generateDateRange(DRUG_COMMON_START_DATE, 4, 4),
        generateDateRange(DRUG_COMMON_START_DATE, 5, 4),
      ].map((s) => ({
        type: "temporary",
        start: s[0],
        end: s[1],
      })),
    },
    {
      title:
        "2 temporary suspensions where the second is included in the first",
      start: DRUG_COMMON_START_DATE,
      suspensions: [
        generateDateRange(DRUG_COMMON_START_DATE, 4, 4),
        generateDateRange(DRUG_COMMON_START_DATE, 6, 2),
      ].map((s) => ({
        type: "temporary",
        start: s[0],
        end: s[1],
      })),
    },
    {
      title:
        "2 temporary suspensions where the first is included in the second",
      start: DRUG_COMMON_START_DATE,
      suspensions: [
        generateDateRange(DRUG_COMMON_START_DATE, 6, 2),
        generateDateRange(DRUG_COMMON_START_DATE, 4, 4),
      ].map((s) => ({
        type: "temporary",
        start: s[0],
        end: s[1],
      })),
    },
    {
      title:
        "1 temporary suspension and afterwards 1 definitive suspension separated by one day each",
      start: DRUG_COMMON_START_DATE,
      suspensions: [
        generateDateRange(DRUG_COMMON_START_DATE, 2, 2),
        [generateDateRange(DRUG_COMMON_START_DATE, 5, 1)[0]],
      ].map((s) => ({
        type: s.length === 1 ? "definitive" : "temporary",
        start: s[0] as string,
        end: s.length === 2 ? s[1] : undefined,
      })),
    },
    {
      title:
        "1 temporary suspension and afterwards 1 definitive suspension directly",
      start: DRUG_COMMON_START_DATE,
      suspensions: [
        generateDateRange(DRUG_COMMON_START_DATE, 2, 2),
        [generateDateRange(DRUG_COMMON_START_DATE, 4, 1)[0]],
      ].map((s) => ({
        type: s.length === 1 ? "definitive" : "temporary",
        start: s[0] as string,
        end: s.length === 2 ? s[1] : undefined,
      })),
    },
    {
      title:
        "1 temporary suspension and 1 definitive suspension that starts within the first suspension",
      start: DRUG_COMMON_START_DATE,
      suspensions: [
        generateDateRange(DRUG_COMMON_START_DATE, 2, 2),
        [generateDateRange(DRUG_COMMON_START_DATE, 3, 1)[0]],
      ].map((s) => ({
        type: s.length === 1 ? "definitive" : "temporary",
        start: s[0] as string,
        end: s.length === 2 ? s[1] : undefined,
      })),
    },
    {
      title:
        "1 temporary suspension and 1 definitive suspension that starts at the same date",
      start: DRUG_COMMON_START_DATE,
      suspensions: [
        generateDateRange(DRUG_COMMON_START_DATE, 2, 2),
        [generateDateRange(DRUG_COMMON_START_DATE, 2, 1)[0]],
      ].map((s) => ({
        type: s.length === 1 ? "definitive" : "temporary",
        start: s[0] as string,
        end: s.length === 2 ? s[1] : undefined,
      })),
    },
    {
      title:
        "1 temporary suspension and 1 definitive suspension, where the second starts before the first one",
      start: DRUG_COMMON_START_DATE,
      suspensions: [
        generateDateRange(DRUG_COMMON_START_DATE, 2, 2),
        [generateDateRange(DRUG_COMMON_START_DATE, 1, 1)[0]],
      ].map((s) => ({
        type: s.length === 1 ? "definitive" : "temporary",
        start: s[0] as string,
        end: s.length === 2 ? s[1] : undefined,
      })),
    },
    {
      title:
        "2 definitive suspensions where the second starts before the first one",
      start: DRUG_COMMON_START_DATE,
      suspensions: [
        [generateDateRange(DRUG_COMMON_START_DATE, 5, 1)[0]],
        [generateDateRange(DRUG_COMMON_START_DATE, 2, 1)[0]],
      ].map((s) => ({
        type: s.length === 1 ? "definitive" : "temporary",
        start: s[0] as string,
        end: s.length === 2 ? s[1] : undefined,
      })),
    },
    {
      title: "2 definitive suspensions that start at the same time",
      start: DRUG_COMMON_START_DATE,
      suspensions: [
        [generateDateRange(DRUG_COMMON_START_DATE, 3, 1)[0]],
        [generateDateRange(DRUG_COMMON_START_DATE, 3, 1)[0]],
      ].map((s) => ({
        type: s.length === 1 ? "definitive" : "temporary",
        start: s[0] as string,
        end: s.length === 2 ? s[1] : undefined,
      })),
    },
  ];

  // For scenariosWithoutEndDate, we can simply reuse scenariosWithEndDate with some tweaks
  const scenariosWithEndDate = scenariosWithoutEndDate.map((s) => ({
    ...s,
    end: DRUG_COMMON_END_DATE,
    title: `${s.title} (with end moment)`,
  }));

  // Return
  return [...scenariosWithoutEndDate, ...scenariosWithEndDate];
}

// Payload
export default function (): MSConfiguration {
  // test scenario
  const scenarios = generateTestScenario();

  // drugs transactions
  const drugs: TransactionConfig[] = scenarios.map((s, idx) => {
    // For the name of drug
    let drugIdentifier = numberToPaddedString(idx + 1);

    return {
      id: idx + 2,
      drug: {
        drugType: "compoundprescription",
        compoundprescriptionText: `Drug ${drugIdentifier}`,
        beginmoment: s.start,
        endmoment: s.end,
        temporality: "chronic",
        periodicity: "D",
        medicationuse: s.title,
      },
    };
  });

  // Get last drug transaction ID (as I need to start after that one)
  const LAST_DRUGS_IDX = drugs[drugs.length - 1].id;

  // suspensions transactions
  // Warning : because of KMEHR annoying structure, it isn't a 1-1 mapping
  const suspensions: TransactionConfig[] = scenarios
    .map((spec, idx) =>
      spec.suspensions.map((s) => ({
        ...s,
        // needed to get drug information for that suspension
        drug_idx: idx,
      })),
    )
    .flat(1)
    .map((suspension, idx) => {
      const drug = drugs[suspension.drug_idx];

      return {
        id: LAST_DRUGS_IDX + idx + 1,
        drug: {
          // reuse declaration of drug
          ...drug.drug,
          // Add information related to the suspension itself
          lifecycle: suspension.type === "definitive" ? "stopped" : "suspended",
          beginmoment: suspension.start,
          endmoment: suspension.end,
        },
        // Add information related to the suspension itself
        suspensionReference: drug.id,
        suspensionReason: `${
          suspension.type === "definitive"
            ? "Definitive suspension"
            : "Temporary suspension"
        }`,
      };
    });

  // time to reunit drugs & suspensions together
  const transactions: TransactionConfig[] = [...drugs, ...suspensions];

  return {
    transactions: transactions,
  };
}
