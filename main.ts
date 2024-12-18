import {
  generateMSOutput,
  generateFHIRDosage,
  generatePCDHOutput
} from "./src/index"

console.log("MS STARTED");
generateMSOutput({
  CONFIGURATIONS_PATH: "./configurations/ms",
  OUTPUT_PATH: "./output/ms",
})
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
