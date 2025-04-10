import type { MSConfiguration } from "@smals-jy/kmehr-tests";

// To generate combinations of endDate / beginCondition / endCondition
function* booleanCombination(numPlace: number): Generator<boolean[]> {
  const maxVal = 2 ** numPlace;
  for (let i = 0; i < maxVal; i++) {
    const combination: boolean[] = [];
    for (let j = 0; j < numPlace; j++) {
      combination.push(Math.pow(2, j) & i ? true : false);
    }
    yield combination;
  }
}

// To generate a friendly name for combination
function combinationName(combination: [boolean, boolean, boolean]): string {
  const [endDate, beginCondition, endCondition] = combination;
  const boolean2String = (flag: boolean) => (flag ? "with" : "no");
  const values = [
    boolean2String(endDate),
    boolean2String(beginCondition),
    boolean2String(endCondition),
  ];

  return `${values[0]} endDate / ${values[1]} beginCondition / ${values[2]} endCondition`;
}

// To generate a number to a minimal length
function numberToPaddedString(num: number, minLength: number = 3): string {
  const str = num.toString();
  const paddingLength = Math.max(0, minLength - str.length);
  const padding = "0".repeat(paddingLength);
  return padding + str;
}

// Payload
export default function (): MSConfiguration {
  // generate combinations
  const combinations = Array.from(booleanCombination(3)) as [
    boolean,
    boolean,
    boolean,
  ][];

  return {
    transactions: combinations.map((comb, idx) => {
      let text = combinationName(comb);
      const [hasEndDate, hasBeginCondition, hasEndCondition] = comb;
      let drugIdentifier = numberToPaddedString(idx + 1);

      return {
        id: idx + 2,
        drug: {
          drugType: "compoundprescription",
          compoundprescriptionText: `Drug ${drugIdentifier}`,
          medicationuse: `${text}`,
          beginmoment: "2022-05-05",
          temporality: "chronic",
          periodicity: "D",
          endmoment: hasEndDate ? "2022-05-10" : undefined,
          begincondition: hasBeginCondition
            ? `Begin condition ${drugIdentifier}`
            : undefined,
          endcondition: hasEndCondition
            ? `End condition ${drugIdentifier}`
            : undefined,
        },
      };
    }),
  };
}
