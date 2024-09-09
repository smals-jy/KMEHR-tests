import { opendir, readFile, writeFile } from "fs/promises";
import { generateTransactions } from "./generateTransaction";
import { setUpBasicPayload, readTemplateFile } from "./setUpBasicPayload";
import { basename } from "path";
import { addPrefix, PREDEFINED_FIELDS } from "./constants";
import type { Configuration } from "./config";

const { XMLBuilder } = require("fast-xml-parser");

// Constants for file handling
const CONFIGURATIONS_PATH = `${__dirname}/../configurations/ms`;
const OUTPUT_PATH = `${__dirname}/../output/ms`;

// For tweaking the payload later
const KMEHR_KEY = addPrefix(PREDEFINED_FIELDS.COMMON_PREFIX, "kmehrmessage");
const FOLDER_KEY = addPrefix(PREDEFINED_FIELDS.COMMON_PREFIX, "folder");
const TRANSACTION_KEY = addPrefix(
  PREDEFINED_FIELDS.COMMON_PREFIX,
  "transaction",
);

export async function generateOutput() {
  // Read template file
  const template = await readTemplateFile();

  // Read configuration file(s)
  const dir = await opendir(CONFIGURATIONS_PATH);
  for await (const dirent of dir) {
    if (dirent.isFile()) {
      console.log(`Processing ${dirent.name}`);
      try {
        await processSingleFile(
          `${CONFIGURATIONS_PATH}/${dirent.name}`,
          template,
        );
      } catch (error) {
        console.log(error);
      }
    }
  }
}

async function processSingleFile(path: string, template: any) {
  // Get filename without extension
  let name = basename(path);
  let filename = name.substring(0, name.lastIndexOf("."));
  let extension = name.substring(name.lastIndexOf(".") + 1);

  // Set up variable to retrieve the config
  let config: Configuration;

  // Depending of the extension, different load strategies
  switch (extension) {
    case "ts":
      // TODO later find out how to use await() instead ...
      let module = require(`${path}`).default;
      config = module() as Configuration;
      break;

    // It is considered as json by default
    default:
      // Read file
      let contents = await readFile(path, { encoding: "utf8" });
      // Turn that to a JSON payload
      config = JSON.parse(contents) as Configuration;
  }

  // Set up basic payload
  let payload = setUpBasicPayload(config!, template);

  // Generate transaction
  let transactions = generateTransactions(config!);

  // @ts-ignore
  // console.log(payload[1][KMEHR_KEY][1][FOLDER_KEY])

  // Monkey patch payload to add the new transactions
  // @ts-ignore Monkey patching
  payload[1][KMEHR_KEY][1][FOLDER_KEY] = [
    // @ts-ignore Monkey patching
    ...payload[1][KMEHR_KEY][1][FOLDER_KEY],
    ...transactions,
  ];

  // For debugging process only
  /*
  await writeFile(
    `./lol_${filename}.json`,
    JSON.stringify(payload, null, "\t")
  );*/

  // Turn payload into
  let builder = new XMLBuilder({
    preserveOrder: true,
    ignoreAttributes: false,
    allowBooleanAttributes: true,
    suppressBooleanAttributes: false,
    alwaysCreateTextNode: true,
    suppressEmptyNode: true,
    format: true,
    unpairedTags: ["?xml"],
    dec: {
      version: "1.0",
      encoding: "UTF-8",
    },
  });
  let xml = builder.build(payload);

  // Write result into a xml file
  await writeFile(`${OUTPUT_PATH}/${filename}.xml`, xml, {
    encoding: "utf8",
  });
}
