// Functions
export { generateOutput as generateMSOutput } from "./generateOutput";
export { generateOutput as generatePCDHOutput } from "./generateDeliveredMedication";
export { generateOutput as generateFHIRDosage } from "./generateFHIRDosage";
export { generateOutput as generatePCDHRemoval } from "./generatePCDHRemoval";
export { generateOutput as generateFHIRMSL } from "./generateFHIRMedicationLines";
export { generateOutput as generateFHIRPrescriptions } from "./generateFHIRPrescriptions";

// Types
export type { 
  Configuration,
  MSConfiguration,
  PCDHConfiguration,
  FHIRDosage,
  FHIRPrescriptionConfiguration
} from "./config";
// Other useful types
export type { AdministrationRoute, AdministrationUnit, DayPeriod, DrugRoute, Periodicity, AuthorConfig, OrganizationConfig, MedicationEntry } from "./config";
