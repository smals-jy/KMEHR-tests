// Generate a XML-like transaction
import type { AuthorConfig } from "./generateHealthcareActor";

import { generateAuthor } from "./generateHealthcareActor";
import { PREDEFINED_FIELDS, addPrefix } from "./constants";

import type { Configuration } from "./config";
import type { Virtual_XML, Virtual_XML_Entry } from "./constants";

export type PeriodicityList =
  | "D"
  | "DA"
  | "DD"
  | "DE"
  | "DN"
  | "DQ"
  | "DT"
  | "DV"
  | "DW"
  | "DX"
  | "DZ"
  | "J"
  | "JD"
  | "JH2"
  | "JQ"
  | "JT"
  | "JV"
  | "JZ"
  | "M"
  | "MA"
  | "MC"
  | "MD"
  | "ME"
  | "MN"
  | "MQ"
  | "MS"
  | "MT"
  | "MV"
  | "MX"
  | "MZ2"
  | "O1"
  | "ondemand"
  | "U"
  | "UA"
  | "UD"
  | "UE"
  | "UH"
  | "UN"
  | "UQ"
  | "US"
  | "UT"
  | "UV"
  | "UW"
  | "UX"
  | "UZ"
  | "W"
  | "WA"
  | "WD"
  | "WE"
  | "WN"
  | "WP"
  | "WQ"
  | "WS"
  | "WT"
  | "WV"
  | "WW"
  | "WX"
  | "WZ";

export type Periodicity = Exclude<
  PeriodicityList,
  "ondemand" | "UE" | "UN" | "UQ" | "US" | "UX"
>;

export type AdministrationRoute =
  | "00001"
  | "00002"
  | "00003"
  | "00004"
  | "00005"
  | "00006"
  | "00007"
  | "00008"
  | "00009"
  | "00010"
  | "00011"
  | "00012"
  | "00013"
  | "00014"
  | "00015"
  | "00016"
  | "00017"
  | "00018"
  | "00019"
  | "00020"
  | "00021"
  | "00022"
  | "00023"
  | "00024"
  | "00025"
  | "00026"
  | "00027"
  | "00028"
  | "00029"
  | "00030"
  | "00031"
  | "00032"
  | "00033"
  | "00034"
  | "00035"
  | "00036"
  | "00037"
  | "00038"
  | "00039"
  | "00040"
  | "00041"
  | "00042"
  | "00043"
  | "00044"
  | "00045"
  | "00046"
  | "00047"
  | "00048"
  | "00049"
  | "00050"
  | "00051"
  | "00052"
  | "00053"
  | "00054"
  | "00055"
  | "00056"
  | "00057"
  | "00058"
  | "00059"
  | "00060"
  | "00061"
  | "00062"
  | "00063"
  | "00064"
  | "00065"
  | "00066"
  | "00067"
  | "00068"
  | "00069"
  | "00070"
  | "00071"
  | "00072"
  | "00073"
  | "both_ears"
  | "both_eyes"
  | "both_nostrils"
  | "cutaneous_injection"
  | "derm"
  | "dermal_injection"
  | "ear_left"
  | "ear_right"
  | "eye_left"
  | "eye_right"
  | "hyperdermoclyse"
  | "icut"
  | "ider"
  | "larter"
  | "nose_left"
  | "nose_right"
  | "oft"
  | "transdermal"
  | "vitreal_injection";
// Some values are not in 20161201, so disabled
export type AdministrationUnit =
  | "00001"
  | "00002"
  | "00003"
  | "00004"
  | "00005"
  | "00006"
  | "00007"
  | "00008"
  | "00009"
  | "00010"
  | "00011"
  | "00012"
  | "00013"
  | "00014"
  | "00015"
  | "00016"
  | "00017"
  | "00018"
  | "00019"
  | "00020"
  | "00021"
  | "00022"
  | "00023"
  | "00024"
  | "00025"
  | "00026"
  | "00027"
  | "00028"
  | "00029"
  | "00030"
  //  | "ampoule"
  //  | "bandage"
  //  | "bottle"
  //  | "box"
  | "cm"
  | "dropsperminute"
  //  | "effervescent-tablet"
  | "gm"
  | "internationalunits"
  //  | "iu"
  //  | "liter"
  //  | "meq"
  | "mg"
  | "mg/ml"
  | "mck/h"
  | "mck/kg/minute"
  | "measure"
  | "mg/h"
  | "ml/h"
  //  | "micrograms"
  //  | "miu"
  //  | "mmol"
  //  | "piece"
  //  | "syringe"
  //  | "syringe-ampoule"
  | "tbl"
  | "tsp"
  | "unt/h";
// Full list of
export type DayPeriodList =
  | "afterbreakfast"
  | "afterdinner"
  | "afterlunch"
  | "aftermeal"
  | "afternoon"
  | "beforebreakfast"
  | "beforedinner"
  | "beforelunch"
  | "betweenbreakfastandlunch"
  | "betweenlunchanddinner"
  | "betweendinnerandsleep"
  | "betweenmeals"
  | "duringbreakfast"
  | "duringdinner"
  | "duringlunch"
  | "evening"
  | "morning"
  | "night"
  | "thehourofsleep";

export type DayPeriod = Exclude<
  DayPeriodList,
  "aftermeal" | "betweenmeals" | "afternoon" | "evening" | "night"
>;

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

type DrugRouteFull =
  | "00001"
  | "00002"
  | "00003"
  | "00004"
  | "00005"
  | "00006"
  | "00007"
  | "00008"
  | "00009"
  | "00010"
  | "00011"
  | "00012"
  | "00013"
  | "00014"
  | "00015"
  | "00016"
  | "00017"
  | "00018"
  | "00019"
  | "00020"
  | "00021"
  | "00022"
  | "00023"
  | "00024"
  | "00025"
  | "00026"
  | "00027"
  | "00028"
  | "00029"
  | "00030"
  | "00031"
  | "00032"
  | "00033"
  | "00034"
  | "00035"
  | "00036"
  | "00037"
  | "00038"
  | "00039"
  | "00040"
  | "00041"
  | "00042"
  | "00043"
  | "00044"
  | "00045"
  | "00046"
  | "00047"
  | "00048"
  | "00049"
  | "00050"
  | "00051"
  | "00052"
  | "00053"
  | "00054"
  | "00055"
  | "00056"
  | "00057"
  | "00058"
  | "00059"
  | "00060"
  | "00061"
  | "00062"
  | "00063"
  | "00064"
  | "00065"
  | "00066"
  | "00067"
  | "00068"
  | "00069"
  | "00070"
  | "00071"
  | "00072"
  | "00073"
  | "both_ears"
  | "both_eyes"
  | "both_nostrils"
  | "cutaneous_injection"
  | "derm"
  | "dermal_injection"
  | "ear_left"
  | "ear_right"
  | "eye_left"
  | "eye_right"
  | "hyperdermoclyse"
  | "icut"
  | "ider"
  | "larter"
  | "nose_left"
  | "nose_right"
  | "oft"
  | "transdermal"
  | "vitreal_injection";

export type DrugRoute = Exclude<
  DrugRouteFull,
  | "00003"
  | "00004"
  | "00006"
  | "00007"
  | "00014"
  | "00015"
  | "00016"
  | "00017"
  | "00018"
  | "00019"
  | "00020"
  | "00021"
  | "00022"
  | "00023"
  | "00024"
  | "00025"
  | "00026"
  | "00027"
  | "00028"
  | "00029"
  | "00030"
  | "00031"
  | "00032"
  | "00036"
  | "00037"
  | "00038"
  | "00039"
  | "00040"
  | "00041"
  | "00042"
  | "00043"
  | "00044"
  | "00047"
  | "00048"
  | "00050"
  | "00057"
  | "00058"
  | "00059"
  | "00061"
  | "00062"
  | "00063"
  | "00065"
  | "00069"
>;

export type RegimenPosology = {
  /**
   * Quantity
   * @example 2.5
   */
  quantity: number | string;
  /**
   * Unit
   * @example "00001"
   */
  unit?: AdministrationUnit;
  /**
   * Time of the day : either <time> OR <dayperiod>
   */
  timeOfDay: {
    /**
     * Time ("HH:MM:SS")
     * @example "08:17:42"
     * @pattern ^(0\d|1\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d{1,3})?((\+|-)(0\d|1[0-2]):[0-5]\d|Z)?$
     */
    time?: string;
    /**
     * Day period
     * @example "morning"
     */
    dayPeriod?: Exclude<
      DayPeriod,
      "aftermeal" | "betweenmeals" | "afternoon" | "evening" | "night"
    >;
  };
  /**
   * Day of ingestion : this can be included in various ways
   */
  dayIngestion?: {
    /**
     * Option 1 : date (YYYY-MM-DD)
     * @example: "2022-08-07"
     * @format date
     */
    date?: string;
    /**
     * Option 2 : weekday
     * @example "monday"
     */
    weekday?: Weekday;
    /**
     * Option 3 : day number
     * @minimum 1
     * @example 1
     */
    dayNumber?: number;
  };
};

// Treatment duration
type TimeUnit =
  | "a"
  | "d"
  | "hr"
  | "min"
  | "mo"
  | "ms"
  | "ns"
  | "s"
  | "us"
  | "wk";

export type TreatmentDuration = {
  quantity: number;
  timeunit: TimeUnit;
};

// types
export type MedicationEntry = {
  /**
   * Type of drug.
   * - "compoundprescription" : a free text drug
   * - "medicinalproduct" : common drug (like Dafalgan)
   * - "substanceproduct" : substance (like Paracetamol)
   * @example "medicinalproduct"
   */
  drugType?: "medicinalproduct" | "substanceproduct" | "compoundprescription";
  /**
   * Identifier type of the drug
   * @example "CD-DRUG-CNK"
   */
  identifierType?: "CD-VMPGROUP" | "CD-INNCLUSTER" | "CD-DRUG-CNK" | "CD-EAN";
  /**
   * Identifier type of the intended drug.
   * By default, it is equal to "identifierType"
   */
  identifierIntendedType?: "CD-INNCLUSTER" | "CD-VMPGROUP";
  /**
   * Identifier type of the intended drug.
   * By default, it is equal to "identifierType"
   */
  identifierDeliveredType?: "CD-DRUG-CNK";
  /**
   * Which drug (code) was initially considered ?
   * @example "3356102"
   */
  intendedcd?: string;
  /**
   * Which drug (name) was initially considered ?
   * @example "Rhinathiol Naturactiv Pulmo 133Ml"
   */
  intendedname?: string;
  /**
   * Which drug (code) was delivered ?
   * @example "3319522"
   */
  deliveredcd?: string;
  /**
   * Which drug (name) was delivered ?
   * @example "Orgitan Care B+Pharma 90 Tabl"
   */
  deliveredname?: string;
  /**
   * EAN identifier (not possible anymore)
   * @deprecated
   * @example "8712412561551"
   */
  eanIdentifier?: string;
  /**
   * ATC identifier
   * @example C10AA07
   */
  atcIdentifier?: string;
  /**
   * text of the component prescription
   * @example "Free text drug"
   */
  compoundprescriptionText?: string;
  /**
   * comment put at root level, to express adaptation or CD-EAN case
   */
  comment?: string;
  /**
   * When to take drug, or when starts suspension ? (format is "YYYY-MM-DD")
   * @example "2022-09-16"
   * @format date
   */
  beginmoment?: string;
  /**
   * When to end drug, or when stops suspension ? Format is "YYYY-MM-DD"
   * FYI : Date is inclusive (so with my example, nothing after "2022-09-17")
   * @example "2022-09-16"
   * @format date
   */
  endmoment?: string;
  /**
   * Used in suspension context :
   * - "suspended": a temporary suspension
   * - "stopped": a definitive suspension
   * @example "suspended"
   */
  lifecycle?: "suspended" | "stopped";
  /**
   * Temporality :
   * - "oneshot": a single-time drug
   * - "chronic" : a regular time drug
   * - ...
   * @example "chronic"
   */
  /**
   * Duration of treatment
   * Example : for 3 months
   */
  duration?: TreatmentDuration;
  temporality?: "acute" | "chronic" | "oneshot";
  /**
   * periodicity in frequency
   * @example "D" Daily drug
   */
  periodicity?: Periodicity;
  /**
   * Free text posology.
   * If set to null, default value won't be used & tag \<posology\> won't be included in payload
   * @example "To take when you want"
   * @default "Free text posology"
   */
  posologyFreeText?: string | null;
  /**
   * Codified posology (regimen)
   */
  regimen?: RegimenPosology[];
  /**
   * Administration route
   * @example "00001"
   */
  route?: AdministrationRoute;
  /**
   * Instructions for patient
   * @example "Take with water"
   */
  instructionForPatient?: string;
  /**
   * Why we need that drug ?
   * @example "For heart issues"
   */
  medicationuse?: string;
  /**
   * When to begin treatment ?
   * @example "When you feel the need"
   */
  begincondition?: string;
  /**
   * When to finish treatment ?
   * @example "When you don't feel the need"
   */
  endcondition?: string;
};

type Common = {
  /**
   * Used to refer transaction
   * Start at 2 as first transaction is reserved to declare the ms
   * @example 2
   */
  id: number;
  /**
   * When transaction occurs (YYYY-MM-DD)
   * @example "2022-02-02"
   */
  transactionDate?: string;
  /**
   * When transaction occurs (HH:MM:SS)
   * @example "08:23:52"
   */
  transactionTime?: string;
  /**
   * Author of the transaction
   */
  author?: AuthorConfig;
  /**
   * Version of the line
   * @default 1
   */
  version?: number;
  /**
   * Used in the past to express if a medication needs validation
   * true : medication line is valid
   * false : medication line needs to be reviewed
   * @default true
   * @deprecated
   */
  isValidated?: boolean;
  /**
   * The heart of the transaction
   */
  drug: MedicationEntry;
  /**
   * Why suspension was created ?
   * @example "Intolerance to lactose"
   */
  suspensionReason?: string;
  /**
   * Which transaction does the suspension is about to
   * @example 3
   */
  suspensionReference?: number;
};

export type TransactionConfig = Common;

export type TransactionPCDHConfig = {
  /*
   * Delivery mode : With or without prescription.
   * @default With prescription
   */
  deliveredMode?:
    | "dispensedForSamePrescription"
    | "dispensedWithoutPrescription";
  /**
   * Add extra attributes for drug (in case of)
   * @minLength 1
   */
  drugs: (MedicationEntry & {
    /**
     * Dguid
     * Useful ONLY when you want to DELETE / UPDATE entry
     */
    dispensationGuid?: string;
    /**
     * To skip the generation of <administrationInstructions>
     * @default false
     */
    skipAdministrationInstructionsGeneration?: boolean;
    /**
     * Magistral text
     */
    magistralText?: string;
    /**
     * Formulary case
     * Examples on https://www.ehealth.fgov.be/standards/kmehr/en/tables/pharmacy-formulas-from-formularies
     */
    formulary?: {
      code: string;
      name: string;
    };
    /**
     * Ingredients
     */
    ingredients?: {
      /**
       * The ingredient
       */
      drug: MedicationEntry;
      /**
       * ad / qs / ....
       */
      quantityPrefix?: string;
      /**
       * Quantity
       */
      quantity?: {
        /**
         * Amount
         */
        amount: number;
        /**
         * QuantityType
         */
        unit?: string;
      };
    }[];
    /**
     * Galenic form
     */
    galenic?: {
      // Coded
      code?: string;
      // Free text
      text?: string;
    };
    /**
     * Quantity
     */
    quantity?: {
      /**
       * Amount
       */
      amount: number;
      /**
       * QuantityType
       */
      unit?: string;
    };
  })[];
  /**
   * Delivered units
   * @default 1
   */
  deliveredAmount?: number;
};

// Generate the regimen part
function generateRegimen(entry: RegimenPosology[]): Virtual_XML[] {
  let commonPrefix = PREDEFINED_FIELDS.COMMON_PREFIX;
  let result: Virtual_XML[] = [];

  for (const regimen of entry) {
    // (Optional) Day period first
    if (regimen.dayIngestion) {
      // date
      if (regimen.dayIngestion.date) {
        result.push({
          [addPrefix(commonPrefix, "date")]: [
            {
              "#text": regimen.dayIngestion.date,
            },
          ],
        });
      }

      // weekday
      if (regimen.dayIngestion.weekday) {
        result.push({
          [addPrefix(commonPrefix, "weekday")]: [
            {
              [addPrefix(commonPrefix, "cd")]: [
                {
                  "#text": regimen.dayIngestion.weekday,
                },
              ],
              ":@": {
                "@_S": "CD-WEEKDAY",
                "@_SV": "1.0",
              },
            },
          ],
        });
      }

      // dayNumber
      if (regimen.dayIngestion.dayNumber) {
        result.push({
          [addPrefix(commonPrefix, "daynumber")]: [
            {
              "#text": regimen.dayIngestion.dayNumber,
            },
          ],
        });
      }
    }

    // dayperiod
    if (regimen.timeOfDay.dayPeriod) {
      result.push({
        [addPrefix(commonPrefix, "daytime")]: [
          {
            [addPrefix(commonPrefix, "dayperiod")]: [
              {
                [addPrefix(commonPrefix, "cd")]: [
                  {
                    "#text": regimen.timeOfDay.dayPeriod,
                  },
                ],
                ":@": {
                  "@_S": "CD-DAYPERIOD",
                  "@_SV": "1.0",
                },
              },
            ],
          },
        ],
      });
    } else {
      result.push({
        [addPrefix(commonPrefix, "daytime")]: [
          {
            [addPrefix(commonPrefix, "time")]: [
              {
                "#text": regimen.timeOfDay.time || "00:00:00",
              },
            ],
          },
        ],
      });
    }

    // Quantity
    result.push({
      [addPrefix(commonPrefix, "quantity")]: [
        {
          [addPrefix(commonPrefix, "decimal")]: [
            {
              "#text": regimen.quantity,
            },
          ],
        },
        {
          [addPrefix(commonPrefix, "unit")]: [
            {
              [addPrefix(commonPrefix, "cd")]: [
                {
                  "#text": regimen.unit || "00001",
                },
              ],
              ":@": {
                "@_S": "CD-ADMINISTRATIONUNIT",
                "@_SV": "1.2",
              },
            },
          ],
        },
      ],
    });
  }

  return result;
}

export function generateTransactions(config: Configuration): Virtual_XML[] {
  let result: Virtual_XML[] = [];
  let commonPrefix = PREDEFINED_FIELDS.COMMON_PREFIX;

  for (let [idx, item] of config.transactions.entries()) {
    let transaction_items: Virtual_XML[] = [];

    // The id of the transaction
    transaction_items.push({
      [addPrefix(commonPrefix, "id")]: [
        {
          "#text": item.id,
        },
      ],
      ":@": {
        "@_S": "ID-KMEHR",
        "@_SV": "1.0",
      },
    });

    // The LOCAL id
    transaction_items.push({
      [addPrefix(commonPrefix, "id")]: [
        {
          "#text": `/subject/${
            PREDEFINED_FIELDS.PATIENT_SSIN
          }/medication-scheme/${item.id}/${item.version || 1}`,
        },
      ],
      ":@": {
        "@_S": "LOCAL",
        "@_SL": "vitalinkuri",
        "@_SV": "1.0",
      },
    });

    // CD-TRANSACTION
    // 99% of the time, it is "medicationschemeelement" otherwise "treatmentsuspension"
    transaction_items.push({
      [addPrefix(commonPrefix, "cd")]: [
        {
          "#text": item.suspensionReason
            ? "treatmentsuspension"
            : "medicationschemeelement",
        },
      ],
      ":@": {
        "@_S": "CD-TRANSACTION",
        "@_SV": "1.4",
      },
    });

    // Date of transaction
    transaction_items.push({
      [addPrefix(commonPrefix, "date")]: [
        {
          "#text": item.transactionDate || PREDEFINED_FIELDS.DATE,
        },
      ],
    });

    // Time of transaction
    transaction_items.push({
      [addPrefix(commonPrefix, "time")]: [
        {
          "#text": item.transactionTime || PREDEFINED_FIELDS.TIME,
        },
      ],
    });

    // Author of transaction (we might override it of course)
    transaction_items.push({
      [addPrefix(commonPrefix, "author")]: generateAuthor(
        item.author || config.author,
      ),
    });

    // iscomplete
    transaction_items.push({
      [addPrefix(commonPrefix, "iscomplete")]: [
        {
          "#text": true,
        },
      ],
    });

    // isvalidated
    transaction_items.push({
      [addPrefix(commonPrefix, "isvalidated")]: [
        {
          "#text": item?.isValidated || true,
        },
      ],
    });

    // items, heart of the medication scheme
    transaction_items.push(...generateItems(item, idx + 1));

    // push back entry transaction
    result.push({
      [addPrefix(commonPrefix, "transaction")]: transaction_items,
    });
  }

  return result;
}

// Generate the item "healthcareelement" for saying "adaptationflag"
function generateAdaptationflag(idx: number): Virtual_XML[] {
  let commonPrefix = PREDEFINED_FIELDS.COMMON_PREFIX;
  return [
    // ID
    {
      [addPrefix(commonPrefix, "id")]: [
        {
          "#text": idx,
        },
      ],
      ":@": {
        "@_S": "ID-KMEHR",
        "@_SV": "1.0",
      },
    },
    // CD
    {
      [addPrefix(commonPrefix, "cd")]: [
        {
          "#text": "healthcareelement",
        },
      ],
      ":@": {
        "@_S": "CD-ITEM",
        "@_SV": "1.4",
      },
    },
    // content
    {
      [addPrefix(commonPrefix, "content")]: [
        // CD-ITEM-MS
        {
          [addPrefix(commonPrefix, "cd")]: [
            {
              "#text": "adaptationflag",
            },
          ],
          ":@": {
            "@_S": "CD-ITEM-MS",
            "@_SV": "1.0",
          },
        },
        // CD-MS-ADAPTATION
        {
          [addPrefix(commonPrefix, "cd")]: [
            {
              "#text": "medication",
            },
          ],
          ":@": {
            "@_S": "CD-MS-ADAPTATION",
            "@_SV": "1.0",
          },
        },
      ],
    },
  ];
}

// Generate the item "suspension" for suspension
function generateSuspension(
  config: TransactionConfig,
  idx: number,
): Virtual_XML[] {
  let commonPrefix = PREDEFINED_FIELDS.COMMON_PREFIX;

  return [
    // ID
    {
      [addPrefix(commonPrefix, "id")]: [
        {
          "#text": idx,
        },
      ],
      ":@": {
        "@_S": "ID-KMEHR",
        "@_SV": "1.0",
      },
    },
    // CD
    {
      [addPrefix(commonPrefix, "cd")]: [
        {
          "#text": "transactionreason",
        },
      ],
      ":@": {
        "@_S": "CD-ITEM",
        "@_SV": "1.14",
      },
    },
    // content
    {
      [addPrefix(commonPrefix, "content")]: [
        // text
        {
          [addPrefix(commonPrefix, "text")]: [
            {
              "#text": config.suspensionReason || "Some reason here ...",
            },
          ],
          ":@": {
            "@_L": "nl",
          },
        },
      ],
    },
  ];
}

// Generate a valid atc
function generateAtc(config: TransactionConfig): Virtual_XML[] {

  let commonPrefix = PREDEFINED_FIELDS.COMMON_PREFIX;
  let drugData = config.drug;

  return [
    {
      [addPrefix(commonPrefix, "cd")]: [
        {
          // Why the 666 ? Because I want a code that will not be valid 
          "#text": drugData.atcIdentifier || `666`,
        }
      ],
      ":@": {
        "@_S": "CD-ATC",
        "@_SV": "1.0",
      },
    }
  ]
}

// Generate a valid drug
function generateDrug(config: TransactionConfig, idx: number): Virtual_XML[] {
  let commonPrefix = PREDEFINED_FIELDS.COMMON_PREFIX;
  let drugData = config.drug;
  let isProduct =
    drugData.drugType !== undefined &&
    ["substanceproduct", "medicinalproduct"].includes(drugData.drugType);

  return [
    // medicinalproduct / substanceproduct
    isProduct && {
      [addPrefix(commonPrefix, drugData.drugType!)]: [
        // intended cd
        {
          [addPrefix(commonPrefix, "intendedcd")]: [
            {
              // Why the 666 ? Because I want a code that will not be translated with SAMv2 VIDIS part
              "#text": drugData.intendedcd || `666`,
            },
          ],
          ":@": {
            "@_S":
              drugData.identifierIntendedType ||
              drugData.identifierType ||
              "CD-DRUG-CNK",
            "@_SV": "1.0",
          },
        },
        // delivered cd
        // Turn that only "CD-DRUG-CNK" is possible, as contrained by KMEHR
        drugData.deliveredcd !== undefined && {
          [addPrefix(commonPrefix, "deliveredcd")]: [
            {
              "#text": drugData.deliveredcd,
            },
          ],
          ":@": {
            "@_S": drugData.identifierDeliveredType || "CD-DRUG-CNK",
            "@_SV": "1.0",
          },
        },
        // intended name
        // Why the fake name ? Because I don't want to put a name for everything
        {
          [addPrefix(commonPrefix, "intendedname")]: [
            {
              "#text":
                drugData.intendedname || `Auto-generated drug ${idx} 500mg`,
            },
          ],
        },
        // delivered name
        drugData.deliveredname !== undefined && {
          [addPrefix(commonPrefix, "deliveredname")]: [
            {
              "#text": drugData.deliveredname,
            },
          ],
        },
      ].filter((d) => d !== false),
    },
    // Component prescription
    !isProduct &&
      drugData.identifierType !== "CD-EAN" && {
        [addPrefix(commonPrefix, "compoundprescription")]: [
          {
            "#text":
              drugData.compoundprescriptionText ||
              `magistrale bereiding ${idx} - compoundprescription`,
          },
        ],
        ":@": {
          "@_L": "nl",
        },
      },
    // EAN (not existing anymore)
    drugData.identifierType === "CD-EAN" && {
      [addPrefix(commonPrefix, "cd")]: [
        {
          "#text": drugData.eanIdentifier || "8716421400221",
        },
      ],
      ":@": {
        "@_S": "CD-EAN",
        "@_SV": "1.0",
      },
    },
  ].filter((s) => s !== false) as Virtual_XML[];
}

// Generate the item "medication"
function generateMedication(
  config: TransactionConfig,
  idx: number,
): Virtual_XML[] {
  let commonPrefix = PREDEFINED_FIELDS.COMMON_PREFIX;
  let drugData = config.drug;
  let hasDrug =
    drugData.drugType !== undefined || drugData.identifierType === "CD-EAN";
  let hasAtc = drugData.atcIdentifier !== undefined;
  let textNeeded =
    drugData.comment !== undefined ||
    drugData.identifierType === "CD-EAN" ||
    drugData.drugType === "compoundprescription";

  return [
    // ID
    {
      [addPrefix(commonPrefix, "id")]: [
        {
          "#text": idx,
        },
      ],
      ":@": {
        "@_S": "ID-KMEHR",
        "@_SV": "1.0",
      },
    },
    // CD
    {
      [addPrefix(commonPrefix, "cd")]: [
        {
          "#text": "medication",
        },
      ],
      ":@": {
        "@_S": "CD-ITEM",
        "@_SV": "1.4",
      },
    },
    // Content [1]
    hasAtc && {
      [addPrefix(commonPrefix, "content")]: generateAtc(config),
    },
    // Content [2]
    hasDrug && {
      [addPrefix(commonPrefix, "content")]: generateDrug(config, idx),
    },
    // Root text (for EAN or compoundprescription)
    textNeeded && {
      [addPrefix(commonPrefix, "text")]: [
        {
          "#text":
            drugData.compoundprescriptionText ||
            drugData.comment ||
            (drugData.identifierType === "CD-EAN" && `EAN ${idx}`) ||
            `magistrale bereiding ${idx} - compoundprescription`,
        },
      ],
      ":@": {
        "@_L": "nl",
      },
    },
    // beginmoment (mandatory)
    {
      [addPrefix(commonPrefix, "beginmoment")]: [
        {
          [addPrefix(commonPrefix, "date")]: [
            {
              "#text": drugData.beginmoment || PREDEFINED_FIELDS.DATE,
            },
          ],
        },
      ],
    },
    // endmoment
    drugData.endmoment !== undefined && {
      [addPrefix(commonPrefix, "endmoment")]: [
        {
          [addPrefix(commonPrefix, "date")]: [
            {
              "#text": drugData.endmoment || PREDEFINED_FIELDS.DATE,
            },
          ],
        },
      ],
    },
    // lifecycle
    drugData.lifecycle !== undefined && {
      [addPrefix(commonPrefix, "lifecycle")]: [
        {
          [addPrefix(commonPrefix, "cd")]: [
            {
              "#text": drugData.lifecycle,
            },
          ],
          ":@": {
            "@_SV": "1.3",
            "@_S": "CD-LIFECYCLE",
          },
        },
      ],
    },
    // temporality
    drugData.temporality !== undefined && {
      [addPrefix(commonPrefix, "temporality")]: [
        {
          [addPrefix(commonPrefix, "cd")]: [
            {
              "#text": drugData.temporality,
            },
          ],
          ":@": {
            "@_S": "CD-TEMPORALITY",
            "@_SV": "1.0",
          },
        },
      ],
    },
    // periodicity
    drugData.periodicity !== undefined && {
      [addPrefix(commonPrefix, "frequency")]: [
        {
          [addPrefix(commonPrefix, "periodicity")]: [
            {
              [addPrefix(commonPrefix, "cd")]: [
                {
                  "#text": drugData.periodicity,
                },
              ],
              ":@": {
                "@_S": "CD-PERIODICITY",
                "@_SV": "1.0",
              },
            },
          ],
        },
      ],
    },
    // Treatment duration
    drugData.duration !== undefined && {
      [addPrefix(commonPrefix, "duration")]: [
        {
          [addPrefix(commonPrefix, "decimal")]: [
            {
              "#text": drugData.duration.quantity,
            },
          ],
        },
        {
          [addPrefix(commonPrefix, "unit")]: [
            {
              [addPrefix(commonPrefix, "cd")]: [
                {
                  "#text": drugData.duration.timeunit || "d",
                },
              ],
              ":@": {
                "@_S": "CD-TIMEUNIT",
                "@_SV": "2.0",
              },
            },
          ],
        },
      ],
    },
    // Regimen
    drugData.regimen !== undefined && {
      [addPrefix(commonPrefix, "regimen")]: generateRegimen(drugData.regimen),
    },
    // Free text posology
    drugData.regimen === undefined &&
      drugData?.posologyFreeText !== null && {
        [addPrefix(commonPrefix, "posology")]: [
          {
            [addPrefix(commonPrefix, "text")]: [
              {
                "#text": drugData.posologyFreeText || "Free text posology",
              },
            ],
            ":@": {
              "@_L": "nl",
            },
          },
        ],
      },
    // Route
    drugData.route !== undefined && {
      [addPrefix(commonPrefix, "route")]: [
        {
          [addPrefix(commonPrefix, "cd")]: [
            {
              "#text": drugData.route,
            },
          ],
          ":@": {
            "@_S": "CD-DRUG-ROUTE",
            "@_SV": "2.0",
          },
        },
      ],
    },
    // instructionforpatient
    drugData.instructionForPatient !== undefined && {
      [addPrefix(commonPrefix, "instructionforpatient")]: [
        {
          "#text": drugData.instructionForPatient,
        },
      ],
      ":@": {
        "@_L": "nl",
      },
    },
    // suspensionReference
    config.suspensionReference !== undefined && {
      [addPrefix(commonPrefix, "lnk")]: [],
      ":@": {
        "@_TYPE": "isplannedfor",
        "@_URL": `//transaction[id[@S='ID-KMEHR']='${config.suspensionReference}']`,
      },
    },
  ].filter((s) => s !== false) as Virtual_XML[];
}

// Hardest part now, generate the item like in KMEHR
// idx is used for generating different
function generateItems(config: TransactionConfig, idx: number): Virtual_XML[] {
  let result: Virtual_XML[] = [];
  let commonPrefix = PREDEFINED_FIELDS.COMMON_PREFIX;

  // First item : the "healthcareelement" for saying "adaptationflag"
  result.push({
    [addPrefix(commonPrefix, "item")]: generateAdaptationflag(
      result.length + 1,
    ),
  });

  // (Optional) Second entry, the suspension
  if (config.suspensionReason) {
    result.push({
      [addPrefix(commonPrefix, "item")]: generateSuspension(
        config,
        result.length + 1,
      ),
    });
  }

  // third entry, the medication itself with the posology
  // Likely the hardest part of the code so bunch of if coming
  result.push({
    [addPrefix(commonPrefix, "item")]: generateMedication(
      config,
      result.length + 1,
    ),
  });

  // (Optional) the begin condition
  // (Optional) the end condition
  // (Optional) the medication in use
  const optionals: [
    "begincondition" | "endcondition" | "medicationuse",
    string | undefined,
  ][] = [
    ["begincondition", config.drug.begincondition],
    ["endcondition", config.drug.endcondition],
    ["medicationuse", config.drug.medicationuse],
  ];

  for (const [conditionKey, conditionValue] of optionals) {
    if (conditionValue) {
      result.push({
        [addPrefix(commonPrefix, "item")]: [
          // ID
          {
            [addPrefix(commonPrefix, "id")]: [
              {
                "#text": result.length + 1,
              },
            ],
            ":@": {
              "@_S": "ID-KMEHR",
              "@_SV": "1.0",
            },
          },
          // CD
          {
            [addPrefix(commonPrefix, "cd")]: [
              {
                "#text": "healthcareelement",
              },
            ],
            ":@": {
              "@_S": "CD-ITEM",
              "@_SV": "1.4",
            },
          },
          // First content, the cd
          {
            [addPrefix(commonPrefix, "content")]: [
              // the type of additional info
              {
                [addPrefix(commonPrefix, "cd")]: [
                  {
                    // Luckly it shares the same name that the technical key
                    "#text": conditionKey,
                  },
                ],
                ":@": {
                  "@_S": "CD-ITEM-MS",
                  "@_SV": "1.0",
                },
              },
            ],
          },
          // Second content, the text
          {
            [addPrefix(commonPrefix, "content")]: [
              // The text
              {
                [addPrefix(commonPrefix, "text")]: [
                  {
                    "#text": conditionValue,
                  },
                ],
                ":@": {
                  "@_L": "nl",
                },
              },
            ],
          },
        ],
      });
    }
  }

  return result;
}
