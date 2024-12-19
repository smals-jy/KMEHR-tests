import { opendir, readFile, writeFile } from "fs/promises";
import { basename } from "path";
import { v4 as uuidv4 } from "uuid";
import { PREDEFINED_FIELDS, Virtual_XML } from "./constants";
import type {
  PCDHConfiguration,
  TransactionPCDHConfig,
  RegimenPosology,
  OptionsConfig
} from "./config";

const { XMLBuilder } = require("fast-xml-parser");

export async function generateOutput(filesConfig: OptionsConfig) {

  // Constants for file handling
  const CONFIGURATIONS_PATH = filesConfig.CONFIGURATIONS_PATH;
  const OUTPUT_PATH = filesConfig.OUTPUT_PATH;

  // Read configuration file(s)
  const dir = await opendir(CONFIGURATIONS_PATH);
  for await (const dirent of dir) {
    if (dirent.isFile()) {
      console.log(`Processing ${dirent.name}`);
      try {
        await processSingleFile(`${CONFIGURATIONS_PATH}/${dirent.name}`, OUTPUT_PATH);
      } catch (error) {
        console.log(error);
      }
    }
  }
}

async function processSingleFile(path: string, outputPath: string) {
  // Get filename without extension
  let name = basename(path);
  let filename = name.substring(0, name.lastIndexOf("."));
  let extension = name.substring(name.lastIndexOf(".") + 1);

  // Set up variable to retrieve the config
  let config: PCDHConfiguration;

  // Depending of the extension, different load strategies
  switch (extension) {
    case "ts":
      // TODO later find out how to use await() instead ...
      let module = require(`${path}`).default;
      config = module() as PCDHConfiguration;
      break;

    // It is considered as json by default
    default:
      // Read file
      let contents = await readFile(path, { encoding: "utf8" });
      // Turn that to a JSON payload
      config = JSON.parse(contents) as PCDHConfiguration;
  }

  let payload = generatePayload(config!);

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

export function generatePayload(config: PCDHConfiguration): Virtual_XML {
  return [
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
    {
      "smc:single-message": [
        {
          "smc:unsigned": [
            // Header
            {
              "smc:header": [
                {
                  "smc:version": [
                    {
                      "#text": "1.0",
                    },
                  ],
                },
                {
                  "smc:messageCreateDate": [
                    {
                      "#text": `${config.date || PREDEFINED_FIELDS.DATE}T${config.time || PREDEFINED_FIELDS.TIME}`,
                    },
                  ],
                },
                {
                  "smc:messageID": [
                    {
                      "#text": uuidv4(),
                    },
                  ],
                },
                {
                  "smc:sender": [
                    {
                      "model:refPharmacy": [
                        {
                          "model:pharmacyId": [
                            {
                              "id:nihiiPharmacyNumber": [
                                {
                                  "#text":
                                    config.author?.org?.nihdi || "12345679",
                                },
                              ],
                            },
                          ],
                          ":@": {
                            "@_xsi:type": "id:NihiiIdType",
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            // Folder
            {
              "smc:eventFolder": [
                {
                  "smc:events": [
                    {
                      "smc:event": generatePharmaceuticalCareEventType(config),
                      ":@": {
                        "@_xsi:type": "smc:PharmaceuticalCareEventType",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      ":@": {
        "@_xmlns:code": "http://www.apb.be/standards/smoa/schema/code/v1",
        "@_xmlns:id": "http://www.apb.be/standards/smoa/schema/id/v1",
        "@_xmlns:model": "http://www.apb.be/standards/smoa/schema/model/v1",
        "@_xmlns:smc": "http://www.apb.be/standards/smoa/schema/v1",
        "@_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "@_xsi:schemaLocation":
          "http://www.apb.be/standards/smoa/schema/v1 xsd/smc-v1/single-message/maindoc/single-message-oa-1.0.xsd",
      },
    },
  ];
}

// Generate id of PCDH transation (aka DGUID)
function generateIdentification(config: PCDHConfiguration): Virtual_XML {
  return {
    "smc:id": [
      {
        "#text": config.id,
      },
    ],
  };
}

// Generate session info
function generateSessionInfo(config: PCDHConfiguration): Virtual_XML {
  return {
    "smc:sessionDateTime": [
      {
        "#text": `${config.date || PREDEFINED_FIELDS.DATE}T${config.time || PREDEFINED_FIELDS.TIME}`,
      },
    ],
  };
}

// Generate pharmacy info
function generatePharmacyInfo(config: PCDHConfiguration): Virtual_XML {
  return {
    "smc:pharmacyId": [
      {
        "id:nihiiPharmacyNumber": [
          {
            "#text":
              config.author?.org?.nihdi || PREDEFINED_FIELDS.ORGANIZATION_NIHDI,
          },
        ],
      },
    ],
  };
}

// Generate patient info
function generatePatientInfo(config: PCDHConfiguration): Virtual_XML {
  return {
    "model:max-Patient": [
      {
        "model:identification": [
          {
            "model:personId": [
              {
                "id:id": [
                  {
                    "#text":
                      config?.patient?.ssin || PREDEFINED_FIELDS.AUTHOR_SSIN,
                  },
                ],
              },
            ],
            ":@": {
              "@_xsi:type": "id:InssIdType",
            },
          },
          {
            "model:name": [
              {
                "#text":
                  config?.patient?.firstname ||
                  PREDEFINED_FIELDS.AUTHOR_FIRSTNAME,
              },
            ],
          },
          {
            "model:familyName": [
              {
                "#text":
                  config.patient?.familyname ||
                  PREDEFINED_FIELDS.AUTHOR_LASTNAME,
              },
            ],
          },
        ],
      },
    ],
  };
}

// Generate Regimen
function generateRegimen(regimen: RegimenPosology[]): Virtual_XML {
  // map to XML / KMEHR
  let mappedRegimen = regimen.map((regimentEntry) => {
    let result: Virtual_XML[] = [];

    // Day number
    if (regimentEntry.dayIngestion?.dayNumber !== undefined) {
      result.push({
        "model:daynumber": [
          {
            "#text": regimentEntry.dayIngestion.dayNumber || 1,
          },
        ],
      });
    }

    // Date
    if (regimentEntry.dayIngestion?.date !== undefined) {
      result.push({
        "model:date": [
          {
            "#text": regimentEntry.dayIngestion.date,
          },
        ],
      });
    }

    // Weekday
    if (regimentEntry.dayIngestion?.weekday !== undefined) {
      result.push({
        "model:weekday": [
          {
            "#text": regimentEntry.dayIngestion.weekday,
          },
        ],
      });
    }

    // daytime
    result.push({
      "model:daytime": [
        // daytime - time option
        regimentEntry.timeOfDay.time !== undefined && {
          "model:time": [
            {
              "#text": regimentEntry.timeOfDay.time,
            },
          ],
        },
        // daytime - dayperiod
        regimentEntry.timeOfDay.dayPeriod !== undefined && {
          "model:dayperiod": [
            {
              "code:cd": [
                {
                  // Don't ask me why, but Farmaflux put enum values in uppercase
                  "#text": regimentEntry.timeOfDay.dayPeriod.toUpperCase(),
                },
              ],
            },
          ],
          ":@": {
            "@_xsi:type": "code:DayPeriodCodeType",
          },
        },
      ].filter((s) => s !== false) as Virtual_XML[],
    });

    // Quantity
    result.push({
      "model:quantity": [
        // amount
        {
          "model:decimal": [
            {
              "#text": regimentEntry.quantity,
            },
          ],
        },
        regimentEntry.unit !== undefined && {
          "model:unit": [
            {
              "code:cd": [
                {
                  "#text": regimentEntry.unit,
                },
              ],
            },
          ],
          ":@": {
            "@_xsi:type": "code:AdministrationUnitValuesCodeType",
          },
        },
      ].filter((s) => s !== undefined) as Virtual_XML[],
    });

    return result;
  });

  // Flat
  let flattenRegimen = mappedRegimen.flat();

  return {
    "model:regimen": flattenRegimen,
  };
}

// Generate delivery
function generateDelivery(
  entry: TransactionPCDHConfig,
  config: PCDHConfiguration,
): Virtual_XML {
  // Is a drug from prescription of not
  let fromPrescription = entry.deliveredMode !== "dispensedWithoutPrescription";

  let technicalKey = fromPrescription
    ? "smc:dispensedForSamePrescription"
    : "smc:dispensedWithoutPrescription";

  // Information to use
  let author = config.author;

  return {
    [technicalKey]: [
      // If from prescription, we need the author of the prescription
      fromPrescription && {
        "model:hcparty": [
          {
            "model:type": [
              {
                "#text": author?.type || PREDEFINED_FIELDS.AUTHOR_TYPE,
              },
            ],
          },
          {
            "model:address": [
              {
                "model:country": [
                  {
                    "#text": "BE",
                  },
                ],
              },
              {
                "model:zip": [
                  {
                    "#text": 3000,
                  },
                ],
              },
              {
                "model:city": [
                  {
                    "#text": "Leuven",
                  },
                ],
              },
              {
                "model:street": [
                  {
                    "#text": "Langestraat",
                  },
                ],
              },
              {
                "model:housenumber": [
                  {
                    "#text": 5,
                  },
                ],
              },
            ],
            ":@": {
              "@_xsi:type": "model:EuropeanAddressType",
              "@_usage": "HOME",
            },
          },
          {
            "model:telecom": [
              {
                "model:kind": [
                  {
                    "code:type": [
                      {
                        "#text": "PHONE",
                      },
                    ],
                  },
                  {
                    "code:usage": [
                      {
                        "#text": "HOME",
                      },
                    ],
                  },
                ],
              },
              {
                "model:value": [
                  {
                    "#text": 123456789,
                  },
                ],
              },
            ],
            ":@": {
              "@_xsi:type": "model:GenericTelecomType",
            },
          },
        ],
      },
      // The medication(s) itself
      ...entry.drugs.map((drug) => {
        // Drug information
        let identifier = drug.deliveredcd || drug.intendedcd;
        drug.compoundprescriptionText;
        // unregisteredProduct
        let isUnregisteredProduct = identifier === "0000000";
        let drugKey = isUnregisteredProduct
          ? "unregisteredProduct"
          : drug.drugType === "compoundprescription"
            ? "magistralPreparation"
            : "productCode";

        return {
          "smc:product": [
            {
              "model:description": [
                // CNK case
                drugKey === "productCode" && {
                  "model:productCode": [
                    {
                      "id:cnk": [
                        {
                          "#text": identifier || "1234567",
                        },
                      ],
                    },
                  ],
                  ":@": {
                    "@_xsi:type": "id:CnkIdType",
                  },
                },
                // Not a drug
                drugKey === "unregisteredProduct" && {
                  "model:unregisteredProduct": [
                    {
                      "#text":
                        drug.deliveredname ||
                        drug.intendedname ||
                        "Unregistered drug",
                    },
                  ],
                },
                // Magistral preparation
                drugKey === "magistralPreparation" && {
                  "model:magistralPreparation": [
                    // Magistral text
                    (drug.magistralText || drug.compoundprescriptionText) !==
                      undefined && {
                      "model:magistralText": [
                        {
                          "#text":
                            drug.magistralText ||
                            drug.compoundprescriptionText ||
                            "Magistral free text",
                        },
                      ],
                    },
                    // Formulary
                    drug.formulary !== undefined && {
                      "model:formularyReference": [
                        // 0589028
                        {
                          "model:formulaCode": [
                            {
                              "#text": drug.formulary.code,
                            },
                          ],
                        },
                        // ERYTHROMYCINE SOL. HYDRO-ALC. 4% FTM2
                        {
                          "model:formulaName": [
                            {
                              "#text": drug.formulary.name,
                            },
                          ],
                        },
                      ],
                    },
                    // Ingredients
                    ...(drug.ingredients || []).map((ingredient, idx) => {
                      let isSubstance =
                        ingredient.drug.drugType === "substanceproduct";

                      return {
                        "model:compound": [
                          // Step order
                          {
                            "model:order": [
                              {
                                "#text": idx + 1,
                              },
                            ],
                          },
                          // medicinal product
                          !isSubstance && {
                            "model:medicinalproduct": [
                              ingredient.drug.intendedcd !== undefined && {
                                "model:intendedProduct": [
                                  {
                                    "#text": ingredient.drug.intendedcd,
                                  },
                                ],
                              },
                              ingredient.drug.deliveredcd !== undefined && {
                                "model:deliveredProduct": [
                                  {
                                    "#text": ingredient.drug.deliveredcd,
                                  },
                                ],
                              },
                              ingredient.drug.intendedname !== undefined && {
                                "model:intendedname": [
                                  {
                                    "#text": ingredient.drug.intendedname,
                                  },
                                ],
                              },
                              ingredient.drug.deliveredname !== undefined && {
                                "model:deliveredname": [
                                  {
                                    "#text": ingredient.drug.deliveredname,
                                  },
                                ],
                              },
                            ].filter((s) => s !== false) as Virtual_XML[],
                          },
                          // Substance case
                          isSubstance && {
                            "model:substance": [
                              // CNK
                              {
                                "model:substancecode": [
                                  {
                                    "#text":
                                      ingredient.drug.deliveredcd ||
                                      ingredient.drug.intendedcd ||
                                      "0525337",
                                  },
                                ],
                              },
                              // Text
                              {
                                "model:substancename": [
                                  {
                                    "#text":
                                      ingredient.drug.deliveredname ||
                                      ingredient.drug.intendedname ||
                                      "Free text substance",
                                  },
                                ],
                              },
                            ],
                          },
                          // Quantityprefix
                          ingredient.quantityPrefix !== undefined && {
                            "model:quantityprefix": [
                              {
                                "#text": ingredient.quantityPrefix,
                              },
                            ],
                          },
                          // Quantity
                          ingredient.quantity !== undefined && {
                            "model:quantity": [
                              // amount
                              {
                                "smc:decimal": [
                                  {
                                    "#text": ingredient.quantity.amount,
                                  },
                                ],
                              },
                              ingredient.quantity.unit !== undefined && {
                                "smc:unit": [
                                  {
                                    "#text": ingredient.quantity.unit,
                                  },
                                ],
                              },
                            ].filter((s) => s !== false) as Virtual_XML[],
                          },
                        ].filter((s) => s !== false) as Virtual_XML[],
                      };
                    }),
                    // Galenic form
                    drug.galenic !== undefined && {
                      "model:galenicform": [
                        // Code
                        drug.galenic.code !== undefined && {
                          "model:galenicformcode": [
                            {
                              "#text": drug.galenic.code,
                            },
                          ],
                        },
                        // Free text
                        drug.galenic.text !== undefined && {
                          "model:galenicformtext": [
                            {
                              "#text": drug.galenic.text,
                            },
                          ],
                        },
                      ].filter((s) => s !== false) as Virtual_XML[],
                    },
                    // Quantity
                    drug.quantity !== undefined && {
                      "model:quantity": [
                        // amount
                        {
                          "smc:decimal": [
                            {
                              "#text": drug.quantity.amount,
                            },
                          ],
                        },
                        drug.quantity.unit !== undefined && {
                          "smc:unit": [
                            {
                              "#text": drug.quantity.unit,
                            },
                          ],
                        },
                      ].filter((s) => s !== false) as Virtual_XML[],
                    },
                  ].filter((s) => s !== false) as Virtual_XML[],
                },
              ].filter((s) => s !== false) as Virtual_XML[],
            },
            // Delivered quantity & posology
            {
              "model:dispensation": [
                // Delivered quantity
                {
                  "model:numberOfUnits": [
                    {
                      "#text": entry.deliveredAmount || 1,
                    },
                  ],
                },
                // administrationInstructions
                drug.skipAdministrationInstructionsGeneration !== true && {
                  "model:administrationInstructions": [
                    // TODO other attributes of AdministrationType to map ???
                    // beginmoment
                    drug.beginmoment !== undefined && {
                      "model:beginmoment": [
                        {
                          "smc:date": [
                            {
                              "#text": drug.beginmoment,
                            },
                          ],
                        },
                      ],
                    },
                    // endmoment
                    drug.endmoment !== undefined && {
                      "model:endmoment": [
                        {
                          "smc:date": [
                            {
                              "#text": drug.endmoment,
                            },
                          ],
                        },
                      ],
                    },
                    // duration
                    drug.duration !== undefined && {
                      "model:duration": [
                        {
                          "smc:decimal": [
                            {
                              "#text": drug.duration.quantity,
                            },
                          ],
                        },
                        {
                          "smc:unit": [
                            {
                              "#text": drug.duration.timeunit,
                            },
                          ],
                        },
                      ],
                    },
                    // posology
                    drug.regimen === undefined && {
                      "model:posology": [
                        {
                          "model:text": [
                            {
                              "#text":
                                drug.posologyFreeText || "Posology free text",
                            },
                          ],
                        },
                      ],
                    },
                    // regimen
                    drug.regimen !== undefined && generateRegimen(drug.regimen),
                    // route
                    drug.route !== undefined && {
                      "model:route": [
                        {
                          "#text": drug.route,
                        },
                      ],
                    },
                    // instructionforpatient
                    drug.instructionForPatient !== undefined && {
                      "model:instructionforpatient": [
                        {
                          "#text": drug.instructionForPatient,
                        },
                      ],
                    },
                  ].filter((s) => s !== false) as Virtual_XML[],
                },
              ].filter((s) => s !== false) as Virtual_XML[],
            },
            // DGuid
            {
              "model:dispensationGUID": [
                {
                  "#text": drug.dispensationGuid || uuidv4(),
                },
              ],
            },
            // Motivation is ONLY needed when removing / updating entries
            drug.dispensationGuid !== undefined && {
              "model:motivation": [
                {
                  "model:type": [
                    {
                      "#text": "wrong medicine",
                    },
                  ],
                },
                {
                  "model:freeText": [
                    {
                      "#text": "No effect",
                    },
                  ],
                },
              ],
            },
          ].filter((s) => s !== false) as Virtual_XML[],
          ":@": fromPrescription
            ? {
                "@_onSubstanceName": true,
              }
            : {},
        };
      }),
    ].filter((s) => s !== false) as Virtual_XML[],
  };
}

function generatePharmaceuticalCareEventType(
  config: PCDHConfiguration,
): Virtual_XML[] {
  const xmlArray: Virtual_XML[] = [];

  if (config.id !== undefined) {
    xmlArray.push(generateIdentification(config));
  }
  xmlArray.push(generateSessionInfo(config));

  xmlArray.push(generatePharmacyInfo(config));
  xmlArray.push(generatePatientInfo(config));

  config.deliveries.forEach((entry) => {
    xmlArray.push(generateDelivery(entry, config));
  });

  return xmlArray;
}
