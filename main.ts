import { generateOutput } from "./src/generateOutput";
import { generateOutput as generatePCDHOutput } from "./src/generateDeliveredMedication";
import { generateOutput as generateFHIRDosage } from "./src/generateFHIRDosage";

console.log("MS STARTED");
generateOutput()
  .then(() => {
    console.log("MS FINISHED");
  })
  .catch((error) => {
    console.error(error);
  });

console.log("PCDH STARTED");
generatePCDHOutput()
  .then(() => {
    console.log("PCDH FINISHED");
  })
  .catch((error) => {
    console.error(error);
  });

console.log("FHIR DOSAGE STARTED");
generateFHIRDosage()
  .then(() => {
    console.log("FHIR DOSAGE FINISHED");
  })
  .catch((error) => {
    console.error(error);
  });
