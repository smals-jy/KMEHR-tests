const { XMLParser } = require("fast-xml-parser");
import { readFile } from "fs/promises";
import type { Configuration } from "./config";
import type { Virtual_XML } from "./constants";

// Constants, for the sake to make my life easier
import { PREDEFINED_FIELDS, addPrefix } from "./constants";
import { overwritePARTIAL_MS } from "./overwritePARTIAL_MS";

// Read template file
export async function readTemplateFile() {
  // Read file
  let mock = await readFile("./TEMPLATES/PARTIAL_MS.xml", {
    encoding: "utf-8",
  });

  // With namespaces instead
  /*
  let mock = await readFile("./TEMPLATES/PARTIAL_MS_WITH_NS.xml", {
    encoding: "utf-8",
  });
  */

  // Get JS representation of the XML
  // Why do I keep order ? Because you never know with KMEHR ...
  const parser = new XMLParser({
    ignoreAttributes: false,
    preserveOrder: true,
    alwaysCreateTextNode: true,
    allowBooleanAttributes: true,
    unpairedTags: ["?xml"],
  });
  return parser.parse(mock) as Virtual_XML;
}

// configure a XML-like object, with constants set up
export function setUpBasicPayload(
  config: Configuration,
  template: Virtual_XML,
) {
  // Refactor it to be tool-friendly
  const kmehrmessageCandidat = Array.isArray(template)
    ? template.find(
        (s) =>
          typeof s === "object" &&
          Object.keys(s).filter((t) => t.includes("kmehrmessage")).length > 0,
      ) || {}
    : template;

  // To pickup the keys, regardless of it has namespaces of not
  let pickupKey = Object.keys(kmehrmessageCandidat).find((s) =>
    s.includes("kmehrmessage"),
  );

  const kmehrmessage: Virtual_XML[] =
    pickupKey !== undefined && pickupKey in kmehrmessageCandidat
      ? // @ts-ignore Key does exist
        kmehrmessageCandidat[pickupKey]
      : [];

  // set up basic attributes for root
  let newAttributes = {
    [`@_xmlns${
      PREDEFINED_FIELDS.COMMON_PREFIX.length > 0
        ? `:${PREDEFINED_FIELDS.COMMON_PREFIX}`
        : ""
    }`]: "http://www.ehealth.fgov.be/standards/kmehr/schema/v1",
    "@_xmlns:ns2": "http://www.w3.org/2001/04/xmlenc#",
    "@_xmlns:ns3": "http://www.w3.org/2000/09/xmldsig#",
  } as any;
  // If a root prefix was put
  if (PREDEFINED_FIELDS.ROOT_PREFIX.length !== 0) {
    newAttributes[`@_xmlns:${PREDEFINED_FIELDS.ROOT_PREFIX}`] =
      "http://www.ehealth.fgov.be/hubservices/core/v3";
  }

  let modified_obj = [
    // Declaration on top
    {
      "?xml": [
        {
          "#text": "",
        },
      ],
      ":@": {
        "@_version": "1.0",
        "@_encoding": "UTF-8",
      },
    },
    // kmehr message
    {
      [addPrefix(PREDEFINED_FIELDS.ROOT_PREFIX, "kmehrmessage")]:
        overwritePARTIAL_MS(
          config,
          kmehrmessage,
          PREDEFINED_FIELDS.COMMON_PREFIX,
        ),
      ":@": newAttributes,
    },
  ];

  return modified_obj;
}
