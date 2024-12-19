import {
  generateMSOutput,
  generateFHIRDosage,
  generatePCDHOutput
} from "./src/index"

console.log("MS STARTED");
generateMSOutput({
  CONFIGURATIONS_PATH: `${__dirname}/configurations/ms`,
  OUTPUT_PATH: `${__dirname}/output/ms`,
})
  .then(() => {
    console.log("MS FINISHED");
  })
  .catch((error) => {
    console.error(error);
  });

console.log("PCDH STARTED");
generatePCDHOutput({
  CONFIGURATIONS_PATH: `${__dirname}/configurations/pcdh`,
  OUTPUT_PATH: `${__dirname}/output/pcdh`,
})
  .then(() => {
    console.log("PCDH FINISHED");
  })
  .catch((error) => {
    console.error(error);
  });

console.log("FHIR DOSAGE STARTED");
generateFHIRDosage({
  CONFIGURATIONS_PATH: `${__dirname}/configurations/fhir-dosage`,
  OUTPUT_PATH: `${__dirname}/output/fhir-dosage`,
})
  .then(() => {
    console.log("FHIR DOSAGE FINISHED");
  })
  .catch((error) => {
    console.error(error);
  });
