import { generatePCDHRemoval } from "./src/index";

// Constants for file handling
const GETDATA_PATH = `${__dirname}/TEMPLATES/PCDH_getData.xml`;
const OUTPUT_PATH = `${__dirname}/output/pcdh-removal`;

// Main funcion
async function main() {
  return await generatePCDHRemoval({
    GETDATA_PATH,
    OUTPUT_PATH
  });
}

main();
