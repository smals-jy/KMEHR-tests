import { createGenerator } from "ts-json-schema-generator";
import fs from "fs";
import path from "path";

const mainFile = path.resolve(process.cwd(), "src/index.ts");

const tsConfigFile = path.resolve(process.cwd(), "tsconfig.json");

const configMap = {
  //transactionsMSSchema: "MSConfiguration",
  transactionPCDHSchema: "PCDHConfiguration",
  transactionFHIRDosage: "FHIRDosage",
  transactionFHIRPrescription: "FHIRPrescriptionConfiguration"
};

for (let [fileName, technicalKey] of Object.entries(configMap)) {
  /** @type {import('ts-json-schema-generator/dist/src/Config').Config} */
  const config = {
    path: mainFile,
    tsconfig: tsConfigFile,
    type: technicalKey, // Or <type-name> if you want to generate schema for that one type only
  };

  // Generate schema for Config
  let schema = createGenerator(config).createSchema(config.type);

  const schemaString = JSON.stringify(schema, null, "\t").replace(
    /\n/g,
    "\r\n",
  );
  const output_path = `${process.cwd()}/src/${fileName}.json`;
  fs.writeFile(output_path, schemaString, (err) => {
    if (err) {
      console.error(err.message);
    }
  });
}
