import { opendir, readFile, writeFile } from "fs/promises";
import { generateTransactions } from "./generateTransaction";
import { setUpBasicPayload, readTemplateFile } from "./setUpBasicPayload";
import { basename } from "path";
import { addPrefix, defaultPrefixConfig } from "./constants";
import type { Configuration, PrefixConfig, OptionsConfig } from "./config";

const { XMLBuilder } = require("fast-xml-parser");

export async function generateOutput(filesConfig: OptionsConfig, prefixConfig: PrefixConfig = defaultPrefixConfig) {
  
  // Read template file
  const template = await readTemplateFile();

  // Extract configuration from payload
  const CONFIGURATIONS_PATH = filesConfig.CONFIGURATIONS_PATH;
  const OUTPUT_PATH = filesConfig.OUTPUT_PATH;

  // Read configuration file(s)
  const dir = await opendir(CONFIGURATIONS_PATH);

  for await (const dirent of dir) {
    if (dirent.isFile()) {
      console.log(`Processing ${dirent.name}`);
      try {
        await processSingleFile(
          `${CONFIGURATIONS_PATH}/${dirent.name}`,
          OUTPUT_PATH,
          template,
          prefixConfig,
        );
      } catch (error) {
        console.log(error);
      }
    }
  }
}

async function processSingleFile(inputPath: string, outputPath: string, template: any, prefixConfig: PrefixConfig) {
  // Get filename without extension
  let name = basename(inputPath);
  let filename = name.substring(0, name.lastIndexOf("."));
  let extension = name.substring(name.lastIndexOf(".") + 1);

  // Set up variable to retrieve the config
  let config: Configuration;

  // Depending of the extension, different load strategies
  switch (extension) {
    case "ts":
      // TODO later find out how to use await() instead ...
      let module = require(`${inputPath}`).default;
      config = module() as Configuration;
      break;

    // It is considered as json by default
    default:
      // Read file
      let contents = await readFile(inputPath, { encoding: "utf8" });
      // Turn that to a JSON payload
      config = JSON.parse(contents) as Configuration;
  }

  // Set up basic payload
  let payload = setUpBasicPayload(config!, template, prefixConfig);

  // Generate transaction
  let transactions = generateTransactions(config!,  prefixConfig);

  // KMEHR keys
  const KMEHR_KEY = addPrefix(prefixConfig.COMMON_PREFIX, "kmehrmessage");
  const FOLDER_KEY = addPrefix(prefixConfig.COMMON_PREFIX, "folder");
  const TRANSACTION_KEY = addPrefix(
    prefixConfig.COMMON_PREFIX,
    "transaction",
  );

  // @ts-ignore
  // console.log(payload[1][KMEHR_KEY][1][FOLDER_KEY])

  // Monkey patch payload to add the new transactions
  // @ts-ignore Monkey patching
  payload[1][KMEHR_KEY][1][FOLDER_KEY] = [
    // @ts-ignore Monkey patching
    ...payload[1][KMEHR_KEY][1][FOLDER_KEY],
    ...transactions,
  ];

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
  await writeFile(`${outputPath}/${filename}.xml`, xml, {
    encoding: "utf8",
  });
}
