import type {
  TransactionConfig,
  TransactionPCDHConfig,
  RegimenPosology,
  TreatmentDuration,
  DayPeriodList,
  PeriodicityList,
} from "./generateTransaction";
import type { AuthorConfig, OrganizationConfig } from "./generateHealthcareActor";

// Config for external file
export type Configuration = {
  /**
   * The drugs / therapeutic suspensions contained in that medication scheme
   */
  transactions: TransactionConfig[];
  /**
   * Who is the author of the last modification of this MS ?
   */
  author?: AuthorConfig;
  /**
   * Version of the medication scheme
   */
  version?: number;
  /**
   * Date when was the MS updated ? (YYYY-MM-DD)
   * @format date
   * @example: "2022-08-07"
   */
  date?: string;
  /**
   * Time when was the MS update (HH:MM:SS)
   * @example "08:17:42"
   * @pattern ^(0\d|1\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d{1,3})?((\+|-)(0\d|1[0-2]):[0-5]\d|Z)?$
   */
  time?: string;
};

// Config for external PCDH file
export type PCDHConfiguration = {
  /**
   * Dguid
   * USEFUL ONLY FOR DATA REMOVAL operation
   */
  id?: string;
  /**
   * Who is the author ?
   */
  author?: AuthorConfig;
  /**
   * Who is the patient
   */
  patient?: AuthorConfig;
  /**
   * Date when was the operation ? (YYYY-MM-DD)
   * @format date
   * @example: "2022-08-07"
   */
  date?: string;
  /**
   * Time when was the operation (HH:MM:SS)
   * @example "08:17:42"
   * @pattern ^(0\d|1\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d{1,3})?((\+|-)(0\d|1[0-2]):[0-5]\d|Z)?$
   */
  time?: string;
  /**
   * Deliveries
   */
  deliveries: TransactionPCDHConfig[];
};

// Config to customize namespace of the output file
export type PrefixConfig = {
  // Used only for generating namespaces stuff
  ROOT_PREFIX: string,
  COMMON_PREFIX: string,
  // In case your templates MS has namespaces, just edit these variables
  LOOKUP_KEYS: {
    // "ns6:id"
    ID: string,
    PATIENT: string,
    AUTHOR: string,
    RECIPIENT: string,
    TIME: string,
    DATE: string,
    VERSION: string,
  }
}

// General options for all generators
export type OptionsConfig = {
  // Where to read the configurations files for this generator
  CONFIGURATIONS_PATH: string,
  // Where to put the generated files
  OUTPUT_PATH: string,
}
// Re-export the configuration as MSConfiguration
type MSConfiguration = Configuration;
export type { MSConfiguration };

export type { FHIRPrescriptionConfiguration } from "./generateFHIRPrescriptions";

// Re-export the TransactionPCDHConfig
export type { TransactionPCDHConfig };

// Re-export the RegimenPosology
export type { RegimenPosology };

// Re-export the transaction type in case of specific needs
export type { TransactionConfig };

// Re-export the author / organization types in case of specific needs
export type { AuthorConfig, OrganizationConfig };

// Re-export the TreatmentDuration in case of specific needs
export type { TreatmentDuration };

// Re-export the dayperiod full list in case of specific needs
export type { DayPeriodList };

// Re-export the periodicity full list in case of specific needs
export type { PeriodicityList };

// types
export type {
  Periodicity,
  AdministrationRoute,
  AdministrationUnit,
  DayPeriod,
  Weekday,
  DrugRoute,
  MedicationEntry,
} from "./generateTransaction";

// Re-export the configurations 
import type { MedicationEntry } from "./generateTransaction";
type FHIRDosage = MedicationEntry;
export type { FHIRDosage };
