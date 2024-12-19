import { opendir, readFile, writeFile } from "fs/promises";
import { basename } from "path";
import type {
  RegimenPosology,
  Weekday,
  MedicationEntry,
  TreatmentDuration,
  DayPeriodList,
  PeriodicityList,
  AdministrationUnit,
} from "./config";

import type {
  Dosage,
  DosageDoseAndRate,
  Timing,
  MedicationStatement,
  TimingRepeat,
} from "fhir/r4";

import type { OptionsConfig } from "./config";

export async function generateOutput(filesConfig: OptionsConfig) {

  // Constants for file handling
  const CONFIGURATIONS_PATH = filesConfig.CONFIGURATIONS_PATH;
  const OUTPUT_PATH = filesConfig.OUTPUT_PATH;

  // Read configuration file(s)
  const dir = await opendir(CONFIGURATIONS_PATH);
  for await (const dirent of dir) {
    if (dirent.isFile()) {
      console.log(`Processing ${dirent.name}`);
      try {
        await processSingleFile(`${CONFIGURATIONS_PATH}/${dirent.name}`, OUTPUT_PATH);
      } catch (error) {
        console.log(error);
      }
    }
  }
}

async function processSingleFile(path: string, outputPath: string) {
  // Get filename without extension
  let name = basename(path);
  let filename = name.substring(0, name.lastIndexOf("."));
  let extension = name.substring(name.lastIndexOf(".") + 1);

  // Set up variable to retrieve the config
  let config: MedicationEntry;

  // Depending of the extension, different load strategies
  switch (extension) {
    case "ts":
      // TODO later find out how to use await() instead ...
      let module = require(`${path}`).default;
      config = module() as MedicationEntry;
      break;

    // It is considered as json by default
    default:
      // Read file
      let contents = await readFile(path, { encoding: "utf8" });
      // Turn that to a JSON payload
      config = JSON.parse(contents) as MedicationEntry;
  }

  let payload = generatePayload(config!);

  // Write result into a json file
  await writeFile(
    `${outputPath}/${filename}.json`,
    JSON.stringify(payload, null, "\t"),
    {
      encoding: "utf8",
    },
  );
}

// For the final payload, use MedicationStatement as it will be the ressource of the medication scheme line / ...
export function generatePayload(config: MedicationEntry): MedicationStatement {
  // Codified Posology
  const regimen = config.regimen;

  return {
    // Setup
    resourceType: "MedicationStatement",
    status: "unknown",
    subject: {
      display: "Bruce Wayne (aka Batman)",
    },
    // Dosage
    dosage:
      regimen === undefined
        ? // Free-text
          [fromKMEHRFreeTextPosologyToFHIRDosage(config)]
        : // codified posology
          fromKEMHRRegimenToFHIRDosage(regimen, config),
    // the medication use, useful to remember the context in final payload
    extension: [
      {
        url: "https://www.ehealth.fgov.be/standards/fhir/StructureDefinition/medicationInUse",
        valueString: config.medicationuse || "Auto-converted posology",
      },
    ],
  };
}

// From KMEHR free-text to FHIR dosage
function fromKMEHRFreeTextPosologyToFHIRDosage(
  config: MedicationEntry,
): Dosage {
  let asNeeded = FromKMEHRAsNeededToasNeededBoolean(config);

  // common attributes
  let result: Dosage = {
    // The posology
    text: config.posologyFreeText || "Free text posology",
    // The instructions for the patient
    patientInstruction: config.instructionForPatient,
    // Only when needed ?
    asNeededBoolean: asNeeded,
  };

  // free text posology might still have some elements related to timing
  let timing = fromKMEHRTimingToFHIRTiming(config);

  // check if timing is worthy to be added
  if (
    timing.event !== undefined ||
    (timing.repeat !== undefined && Object.keys(timing.repeat).length > 0)
  ) {
    return {
      ...result,
      timing: timing,
    };
  } else {
    return result;
  }
}

// From KMEHR "as needed" to FHIR asNeededBoolean
function FromKMEHRAsNeededToasNeededBoolean(
  medication: MedicationEntry,
): boolean | undefined {
  // Explictely said as when needed
  if (medication.temporality === "oneshot") {
    return true;
  }

  // Periodicity is on demand
  if ((medication.periodicity as PeriodicityList) === "ondemand") {
    return true;
  }

  // Otherwise no "as needed"
  return undefined;
}

// From KMEHR regimen to FHIR dosage
function fromKEMHRRegimenToFHIRDosage(
  regimenPosology: RegimenPosology[],
  config: MedicationEntry,
): Dosage[] {
  let asNeeded = FromKMEHRAsNeededToasNeededBoolean(config);

  return regimenPosology.map((entry) => {
    let result: Dosage = {
      // Quantity and unit
      doseAndRate: fromKMEHRQuantityToFHIRQuantity(entry),
      // When to take medication
      timing: fromKMEHRTimingToFHIRTiming(config, entry),
      // The instructions for the patient
      patientInstruction: config.instructionForPatient,
      // Only when needed ?
      asNeededBoolean: asNeeded,
    };

    return result;
  });
}

// From AdministrationUnit to UCUM / SNOMED CT code
type AdministrationUnitResult = {
  system?: string;
  code?: string;
};
function fromAdministrationUnitToFHIR(
  unit?: AdministrationUnit,
): AdministrationUnitResult | undefined {
  if (unit === undefined) {
    return {};
  }

  const SNOMED_SYSTEM_URL = "http://snomed.info/sct";
  const UCUM_SYSTEM_URL = "http://unitsofmeasure.org";
  let result: AdministrationUnitResult = {};

  switch (unit) {
    case "00001":
      result.code = "5.mL";
      result.system = UCUM_SYSTEM_URL;
      break;
    case "00002":
      result.code = "732978007";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "00003":
      result.code = "413568008";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "00004":
      result.code = "428641000";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "00005":
      result.code = "336624003";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "00006":
      result.code = "408102007";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "00007":
      result.code = "[drp]";
      result.system = UCUM_SYSTEM_URL;
      break;
    case "00008":
      result.code = "419672006";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "00009":
      result.code = "732996003";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "00010":
      result.code = "129331004";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "00011":
      result.code = "422237004";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "00012":
      result.code = "257867005";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "00013":
      result.code = "732989000";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "00014":
      result.code = "336624003";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "00015":
      result.code = "337087003";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "00016":
      result.code = "mL";
      result.system = UCUM_SYSTEM_URL;
      break;
    case "00017":
      result.code = "73153001";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "00018":
      result.code = "34258004";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "00019":
      result.code = "429587008";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "00020":
      result.code = "419702001";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "00021":
      result.code = "732988008";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "00022":
      result.code = "733006000";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "00023":
      result.code = "415215001";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "00024":
      result.code = "429671000";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "00025":
      result.code = "733006000";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "00026":
      result.code = "430293001";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "00027":
      result.code = "418530008";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "00028":
      result.code = "116251003";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "00029":
      result.code = "428672001";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "00030":
      result.code = "426148002";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "cm":
      result.code = "cm";
      result.system = UCUM_SYSTEM_URL;
      break;
    case "dropsperminute":
      result.code = "[drp]/min";
      result.system = UCUM_SYSTEM_URL;
      break;
    case "gm":
      result.code = "g";
      result.system = UCUM_SYSTEM_URL;
      break;
    case "internationalunits":
      result.code = "[IU]";
      result.system = UCUM_SYSTEM_URL;
      break;
    case "mg":
      result.code = "mg";
      result.system = UCUM_SYSTEM_URL;
      break;
    case "mg/ml":
      result.code = "mg/mL";
      result.system = UCUM_SYSTEM_URL;
      break;
    case "mck/h":
      result.code = "ug/h";
      result.system = UCUM_SYSTEM_URL;
      break;
    case "mck/kg/minute":
      result.code = "ug/kg/min";
      result.system = UCUM_SYSTEM_URL;
      break;
    case "measure":
      result.code = "767524001";
      result.system = SNOMED_SYSTEM_URL;
      break;
    case "mg/h":
      result.code = "mg/h";
      result.system = UCUM_SYSTEM_URL;
      break;
    case "ml/h":
      result.code = "ml/h";
      result.system = UCUM_SYSTEM_URL;
      break;
    case "tbl":
      result.code = "{TBL}";
      result.system = UCUM_SYSTEM_URL;
      break;
    case "tsp":
      result.code = "[tsp_m]";
      result.system = UCUM_SYSTEM_URL;
      break;
    case "unt/h":
      result.code = "[IU]/h";
      result.system = UCUM_SYSTEM_URL;
      break;
  }

  return result;
}

// From KMEHR quantity and unit to FHIR DosageQuantity
function fromKMEHRQuantityToFHIRQuantity(
  entry: RegimenPosology,
): DosageDoseAndRate[] {
  return [
    {
      doseQuantity: {
        // Add KMEHR quantity value (mandatory)
        value: Number(entry.quantity),
        // Add KMEHR quantity unit (optional)
        ...fromAdministrationUnitToFHIR(entry.unit),
      },
    },
  ];
}

// JS cleanup object
function stripUndefinedFromObject(initialObj: any): any {
  return Object.entries(initialObj)
    .filter(([_, value]) => value !== undefined)
    .reduce((obj: any, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});
}

// From KMEHR dayperiod, daytime, weekday, date, dayNumber to FHIR timing
function fromKMEHRTimingToFHIRTiming(
  medication: MedicationEntry,
  entry?: RegimenPosology,
): Timing {
  // for "event" mapping
  let events = [
    // date can be mapped easily into event
    fromDateToDatetime(entry?.dayIngestion?.date),
    // medication without periodicity and regimen
    fromOneShotMedicationToDateTime(medication, entry),
  ].filter((s) => s !== undefined) as string[];

  // for "timing" mapping
  let repeat: TimingRepeat = {
    // dayperiod can usually be mapped into a combination of when and offset
    when: fromDayPeriodToWhen(entry?.timeOfDay.dayPeriod),
    offset: fromDayPeriodToOffet(entry?.timeOfDay.dayPeriod),
    // daytime can be mapped easily into timeOfDay
    timeOfDay: fromDayTimeToTimeOfDay(entry?.timeOfDay.time),
    // weekday can be mapped easily into dayOfWeek
    dayOfWeek: fromWeekDayToDayOfWeek(entry?.dayIngestion?.weekday),
    // periodicity can be mapped most of the time into frequency / period, periodUnit
    frequency: medication.periodicity !== undefined ? 1 : undefined,
    period: fromPeriodicityToPeriod(medication.periodicity),
    periodUnit: fromPeriodicityToPeriodUnit(medication.periodicity),
    // treatmentDuration can be mapped easily most of the time into duration
    duration: fromTreatmentDurationToDuration(medication.duration),
    durationUnit: fromTreatmentDurationToDurationUnit(medication.duration),
  };

  // Remove undefined value
  let cleanRepeat = stripUndefinedFromObject(repeat) as TimingRepeat;

  // Result object
  let result: Timing = {
    repeat: Object.keys(cleanRepeat).length > 0 ? cleanRepeat : undefined,
    // if not empty, it means to be taken only at specific times
    event: events.length > 0 ? events : undefined,
  };

  // Day number can't be mapped in FHIR like that, so an extension
  if (entry?.dayIngestion?.dayNumber !== undefined) {
    result.extension = [
      {
        url: "https://www.ehealth.fgov.be/standards/fhir/StructureDefinition/dayNumber",
        valueInteger: entry.dayIngestion.dayNumber,
      },
    ];
  }

  return result;
}

// From KMEHR dayperiod to when array
function fromDayPeriodToWhen(code?: DayPeriodList): string[] | undefined {
  switch (code) {
    case "afterbreakfast":
      return ["PCM"];
    case "afterdinner":
      return ["PCV"];
    case "afterlunch":
      return ["PCD"];
    case "beforebreakfast":
      return ["ACM"];
    case "beforedinner":
      return ["ACV"];
    case "beforelunch":
      return ["ACD"];
    case "betweenbreakfastandlunch":
      return ["CM"];
    case "betweenlunchanddinner":
      return ["CD"];
    case "betweendinnerandsleep":
      return ["CV"];
    case "duringbreakfast":
      return ["CM"];
    case "duringdinner":
      return ["CV"];
    case "duringlunch":
      return ["CD"];
    case "morning":
      return ["MORN"];
    case "thehourofsleep":
      return ["HS"];
    case "aftermeal":
      return ["PC"];
    case "afternoon":
      return ["AFT"];
    case "betweenmeals":
      return ["C"];
    case "evening":
      return ["EVE"];
    case "night":
      return ["NIGHT"];
    default:
      return undefined;
  }
}

// For some codes in KMEHR, they need an offset (as between some periods)
function fromDayPeriodToOffet(code?: DayPeriodList): number | undefined {
  switch (code) {
    case "betweenmeals":
    case "betweenbreakfastandlunch":
    case "betweenlunchanddinner":
    case "betweendinnerandsleep":
      // 60 minutes seems to be the value FarmaFlux and others picked up (could be tweaked if needed)
      return 60;
    default:
      return undefined;
  }
}

// From daytime to timeofday
function fromDayTimeToTimeOfDay(time?: string): string[] | undefined {
  if (time === undefined) {
    return undefined;
  } else {
    return [time];
  }
}

// From weekday to dayOfWeek
function fromWeekDayToDayOfWeek(
  day?: Weekday,
): Array<"mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"> | undefined {
  switch (day) {
    case "monday":
      return ["mon"];
    case "tuesday":
      return ["tue"];
    case "wednesday":
      return ["wed"];
    case "thursday":
      return ["thu"];
    case "friday":
      return ["fri"];
    case "saturday":
      return ["sat"];
    case "sunday":
      return ["sun"];
    default:
      return undefined;
  }
}

// From date to datetime
function fromDateToDatetime(date?: string): string | undefined {
  if (date === undefined) {
    return undefined;
  }
  return date;
}

// Medication that needs to be taken oneshot to datetime
function fromOneShotMedicationToDateTime(
  medication: MedicationEntry,
  entry?: RegimenPosology,
): string | undefined {
  // One shot medication
  if (
    medication.periodicity === undefined ||
    medication.temporality === "oneshot"
  ) {
    // No regimen, no issue
    if (medication.regimen === undefined) {
      return medication.beginmoment;
    }

    // return beginmoment only when no dayIngestion present
    if (entry?.dayIngestion === undefined) {
      return medication.beginmoment;
    }
  }

  // Default, don't add the date
  return undefined;
}

// From periodicity to FHIR periodUnit
function fromPeriodicityToPeriodUnit(
  periodicity?: PeriodicityList,
): "s" | "min" | "h" | "d" | "wk" | "mo" | "a" | undefined {
  // If undefined, stop
  if (periodicity === undefined) {
    return undefined;
  }

  // If code starts with a "D", it is per x day
  if (periodicity.startsWith("D")) {
    return "d";
  }

  // If code starts with a "J", it is per x year
  if (periodicity.startsWith("J")) {
    return "a";
  }

  // If code starts with a "M", it is per x month
  if (periodicity.startsWith("M")) {
    return "mo";
  }

  // If code starts with a "U", it is per x hour
  if (periodicity.startsWith("U")) {
    return "h";
  }

  // If code starts with a "W", it is per x week
  if (periodicity.startsWith("W")) {
    return "wk";
  }

  // If code is "O1" it is the per 2 days cases
  if (periodicity === "O1") {
    return "d";
  }

  // undefined otherwise
  return undefined;
}

// From periodicity to FHIR period
function fromPeriodicityToPeriod(
  periodicity?: PeriodicityList,
): number | undefined {
  switch (periodicity) {
    case "D":
      return 1;
    case "DA":
      return 8;
    case "DD":
      return 3;
    case "DE":
      return 11;
    case "DN":
      return 9;
    case "DQ":
      return 5;
    case "DT":
      return 2;
    case "DV":
      return 4;
    case "DW":
      return 12;
    case "DX":
      return 10;
    case "DZ":
      return 6;
    case "J":
      return 1;
    case "JD":
      return 3;
    case "JH2":
      return 0.5;
    case "JQ":
      return 5;
    case "JT":
      return 2;
    case "JV":
      return 4;
    case "JZ":
      return 6;
    case "M":
      return 1;
    case "MA":
      return 8;
    case "MC":
      return 18;
    case "MD":
      return 3;
    case "ME":
      return 11;
    case "MN":
      return 9;
    case "MQ":
      return 5;
    case "MS":
      return 7;
    case "MT":
      return 2;
    case "MV":
      return 4;
    case "MX":
      return 10;
    case "MZ2":
      return 6;
    case "O1":
      return 2;
    case "U":
      return 1;
    case "UA":
      return 8;
    case "UD":
      return 3;
    case "UE":
      return 11;
    case "UH":
      return 0.5;
    case "UN":
      return 9;
    case "UQ":
      return 5;
    case "US":
      return 7;
    case "UT":
      return 2;
    case "UV":
      return 4;
    case "UW":
      return 12;
    case "UX":
      return 10;
    case "UZ":
      return 6;
    case "W":
      return 1;
    case "WA":
      return 8;
    case "WD":
      return 3;
    case "WE":
      return 11;
    case "WN":
      return 9;
    case "WP":
      return 24;
    case "WQ":
      return 5;
    case "WS":
      return 7;
    case "WT":
      return 2;
    case "WV":
      return 4;
    case "WW":
      return 12;
    case "WX":
      return 10;
    case "WZ":
      return 6;
    default:
      return undefined;
  }
}

// From treatmentDuration to FHIR duration
function fromTreatmentDurationToDuration(
  treatmentDuration?: TreatmentDuration,
): number | undefined {
  if (treatmentDuration === undefined) {
    return undefined;
  }

  const quantity = treatmentDuration.quantity;

  switch (treatmentDuration.timeunit) {
    // Easy mappings first, return value as-it when no conversion is needed
    case "a":
    case "d":
    case "hr":
    case "wk":
    case "min":
    case "mo":
    case "s":
      return quantity;
    // Complex mapping : for sake of simplicity, turn them into second
    case "ms":
      return quantity / 1000;
    case "ns":
      return quantity / 1000000000;
    case "us":
      return quantity / 1000000;
  }
}

// From treatmentDuration to FHIR duration
function fromTreatmentDurationToDurationUnit(
  treatmentDuration?: TreatmentDuration,
): ("s" | "min" | "h" | "d" | "wk" | "mo" | "a") | undefined {
  if (treatmentDuration === undefined) {
    return undefined;
  }
  switch (treatmentDuration.timeunit) {
    // Easy mappings first
    case "a":
      return "a";
    case "d":
      return "d";
    case "hr":
      return "h";
    case "wk":
      return "wk";
    case "min":
      return "min";
    case "mo":
      return "mo";
    // Complex mapping : for sake of simplicity, turn them into second
    case "ms":
    case "ns":
    case "s":
    case "us":
      return "s";
  }
}
