import type { MSConfiguration } from "@smals-jy/kmehr-tests";
type TransactionConfig = MSConfiguration['transactions'][number];

// To generate a number to a minimal length
function numberToPaddedString(num: number, minLength: number = 3): string {
  const str = num.toString();
  const paddingLength = Math.max(0, minLength - str.length);
  const padding = "0".repeat(paddingLength);
  return padding + str;
}

// for the suspension scenarios description
type Scenario = {
  // when the drug starts
  start: string;
  // when the drug ends (optional)
  end?: string;
  // For the medication use
  title?: string;
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

function convertDate(dateStr: string) : string {
  // Split the string into ["18", "09", "2026"]
  const [day, month, year] = dateStr.split('/');
  
  // Return in YYYY-MM-DD format
  return `${year}-${month}-${day}`;
}

// Generate test scenario
function generateTestScenario(): Scenario[] {
    // When all drugs starts ...
    const DRUG_COMMON_START_DATE = convertDate("07/02/2026");
    // When some drugs stops
    const DRUG_COMMON_END_DATE = convertDate("18/09/2026");
    // When some medication are tested
    const DRUG_TEST_DATE = convertDate("18/02/2026");

    const scenariosWithoutEndDate: Scenario[] = [
        // Drug 001
        {
            start: DRUG_COMMON_START_DATE,
            suspensions: [
                {
                    start: convertDate("15/01/2026"),
                    end: convertDate("31/01/2026"),
                    type: "temporary"
                }
            ]
        },
        // Drug 002
        {
            start: DRUG_COMMON_START_DATE,
            suspensions: [
                {
                    start: convertDate("15/01/2026"),
                    end: convertDate("25/02/2026"),
                    type: "temporary"
                }
            ]
        },
        // Drug 003
        {
            start: DRUG_COMMON_START_DATE,
            suspensions: [
                {
                    start: convertDate("10/02/2026"),
                    end: convertDate("25/02/2026"),
                    type: "temporary"
                }
            ]
        },
        // Drug 004
        {
            start: DRUG_COMMON_START_DATE,
            suspensions: [
                {
                    start: convertDate("10/02/2026"),
                    end: convertDate("15/02/2026"),
                    type: "temporary"
                }
            ]
        },
        // Drug 005
        {
            start: DRUG_COMMON_START_DATE,
            suspensions: [
                {
                    start: convertDate("01/06/2026"),
                    end: convertDate("15/06/2026"),
                    type: "temporary"
                }
            ]
        },
        // Drug 006
        {
            start: DRUG_COMMON_START_DATE,
            suspensions: [
                {
                    start: DRUG_TEST_DATE,
                    end: convertDate("15/03/2026"),
                    type: "temporary"
                }
            ]
        },
        // Drug 007
        {
            start: DRUG_COMMON_START_DATE,
            suspensions: [
                {
                    start: convertDate("15/01/2026"),
                    end: DRUG_TEST_DATE,
                    type: "temporary"
                }
            ]
        },
        // Drug 008
        {
            start: DRUG_COMMON_START_DATE,
            suspensions: [
                {
                    start: convertDate("10/02/2026"),
                    type: "definitive"
                }
            ]
        },
        // Drug 009
        {
            start: DRUG_COMMON_START_DATE,
            suspensions: [
                {
                    start: DRUG_TEST_DATE,
                    type: "definitive"
                }
            ]
        },
        // Drug 010
        {
            start: DRUG_COMMON_START_DATE,
            suspensions: [
                {
                    start: convertDate("15/03/2026"),
                    type: "definitive"
                }
            ]
        },
        // Drug 011
        {
            start: DRUG_COMMON_START_DATE,
            suspensions: [
                {
                    start: convertDate("05/01/2026"),
                    type: "definitive"
                }
            ]
        },
    ];

    const scenariosWithEndDate: Scenario[] = [
        // Drug 012
        {
            start: DRUG_COMMON_START_DATE,
            end: DRUG_COMMON_END_DATE,
            suspensions: [
                {
                    start: convertDate("15/01/2026"),
                    end: convertDate("18/01/2026"),
                    type: "temporary"
                }
            ]
        },
        // Drug 013
        {
            start: DRUG_COMMON_START_DATE,
            end: DRUG_COMMON_END_DATE,
            suspensions: [
                {
                    start: convertDate("05/02/2026"),
                    end: convertDate("25/02/2026"),
                    type: "temporary"
                }
            ]
        },
        // Drug 014
        {
            start: DRUG_COMMON_START_DATE,
            end: DRUG_COMMON_END_DATE,
            suspensions: [
                {
                    start: convertDate("15/02/2026"),
                    end: convertDate("25/02/2026"),
                    type: "temporary"
                }
            ]
        },
        // Drug 015
        {
            start: DRUG_COMMON_START_DATE,
            end: DRUG_COMMON_END_DATE,
            suspensions: [
                {
                    start: DRUG_TEST_DATE,
                    end: convertDate("25/02/2026"),
                    type: "temporary"
                }
            ]
        },
        // Drug 016
        {
            start: DRUG_COMMON_START_DATE,
            end: DRUG_COMMON_END_DATE,
            suspensions: [
                {
                    start: convertDate("10/02/2026"),
                    end: DRUG_TEST_DATE,
                    type: "temporary"
                }
            ]
        },
        // Drug 017
        {
            start: DRUG_COMMON_START_DATE,
            end: DRUG_COMMON_END_DATE,
            suspensions: [
                {
                    start: convertDate("01/06/2026"),
                    end: convertDate("15/06/2026"),
                    type: "temporary"
                }
            ]
        },
        // Drug 018
        {
            start: DRUG_COMMON_START_DATE,
            end: DRUG_COMMON_END_DATE,
            suspensions: [
                {
                    start: convertDate("15/01/2026"),
                    type: "definitive"
                }
            ]
        },
        // Drug 019
        {
            start: DRUG_COMMON_START_DATE,
            end: DRUG_COMMON_END_DATE,
            suspensions: [
                {
                    start: convertDate("15/02/2026"),
                    type: "definitive"
                }
            ]
        },
        // Drug 020
        {
            start: DRUG_COMMON_START_DATE,
            end: DRUG_COMMON_END_DATE,
            suspensions: [
                {
                    start: DRUG_TEST_DATE,
                    type: "definitive"
                }
            ]
        },
        // Drug 021
        {
            start: DRUG_COMMON_START_DATE,
            end: DRUG_COMMON_END_DATE,
            suspensions: [
                {
                    start: convertDate("01/06/2026"),
                    type: "definitive"
                }
            ]
        },
        // Drug 022
        {
            start: DRUG_COMMON_START_DATE,
            end: DRUG_COMMON_END_DATE,
            suspensions: [
                {
                    start: convertDate("15/01/2026"),
                    end: convertDate("20/01/2026"),
                    type: "temporary"
                },
                {
                    start: convertDate("01/03/2026"),
                    end: convertDate("15/03/2026"),
                    type: "temporary"
                }
            ]
        },
        // Drug 023
        {
            start: DRUG_COMMON_START_DATE,
            end: DRUG_COMMON_END_DATE,
            suspensions: [
                {
                    start: convertDate("15/01/2026"),
                    end: convertDate("20/01/2026"),
                    type: "temporary"
                },
                {
                    start: convertDate("01/10/2026"),
                    end: convertDate("15/10/2026"),
                    type: "temporary"
                }
            ]
        },
        // Drug 024
        {
            start: DRUG_COMMON_START_DATE,
            end: DRUG_COMMON_END_DATE,
            suspensions: [
                {
                    start: convertDate("10/02/2026"),
                    end: convertDate("25/02/2026"),
                    type: "temporary"
                },
                {
                    start: convertDate("01/06/2026"),
                    end: convertDate("15/06/2026"),
                    type: "temporary"
                }
            ]
        },
        // Drug 025
        {
            start: DRUG_COMMON_START_DATE,
            end: DRUG_COMMON_END_DATE,
            suspensions: [
                {
                    start: convertDate("10/02/2026"),
                    end: convertDate("25/02/2026"),
                    type: "temporary"
                },
                {
                    start: convertDate("10/02/2026"),
                    type: "definitive"
                }
            ]
        },
    ];

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
            medicationuse: s.title
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
