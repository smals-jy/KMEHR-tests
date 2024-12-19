import { readFile, writeFile } from "fs/promises";
import { get as GetNestedKey } from "lodash";
import { PREDEFINED_FIELDS } from "./constants";
import { generatePayload as generateRemovalPayload } from "./generateDeliveredMedication";
import type { PCDHConfiguration } from "./config";

const { XMLBuilder, XMLParser } = require("fast-xml-parser");

type OptionsConfig = {
    GETDATA_PATH: string;
    OUTPUT_PATH: string;
}

// Main funcion
export async function generateOutput(filesConfig: OptionsConfig){
  // Set up variable to retrieve the config
  let config: PCDHConfiguration;

  // variables for file handling
  const GETDATA_PATH = filesConfig.GETDATA_PATH;
  const OUTPUT_PATH = filesConfig.OUTPUT_PATH;

  // Read response file
  let path = `${GETDATA_PATH}`;
  let contents = await readFile(path, { encoding: "utf8" });

  // Extract configuration from payload
  config = parseConfiguration(contents);

  //console.log(JSON.stringify(config, null, "\t"));

  // Prepare builder
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

  // today date
  let today = new Date().toISOString();
  let date = today.split("T")[0];

  // Since FarmaFlux can only process removal one per one,
  // I will split the operation so that if one removal
  for (let [idx, delivery] of Object.entries(config.deliveries)) {
    // Generate removal payload
    let payload = generateRemovalPayload({
      author: config.author,
      date: date,
      time: "00:00:00",
      patient: config.patient,
      deliveries: [delivery],
      id: GetNestedKey(
        delivery,
        "drugs[0].dispensationGuid",
        "MISSING DGUID - ALERT !!!",
      ),
    });

    let xml = builder.build(payload);

    // Write result into a xml file
    await writeFile(`${OUTPUT_PATH}/TX-dataRemoval_${idx}.xml`, xml, {
      encoding: "utf8",
    });
  }
}

function parseConfiguration(contents: string): PCDHConfiguration {
  const options = {
    attributeNamePrefix: "@_",
    ignoreAttributes: false,
    removeNSPrefix: true,
  };
  const parser = new XMLParser(options);
  const parsed = parser.parse(contents);

  // Get medication events
  const medicationHistoryEvent = GetNestedKey(
    parsed,
    "single-message.unsigned.eventFolder.events.event.medicationHistoryEntity",
    [],
  ) as {
    [x: string]: any;
  }[];

  // Get patient ssin
  const patientSSIN = GetNestedKey(
    parsed,
    "single-message.unsigned.eventFolder.entitySpace.entity.min-Patient.personId.id",
  ) as string;

  return {
    author: {
      org: {
        type: "orgpharmacy",
        name: "Pharmacie - code 200",
        nihdi: "80000551",
      },
    },
    patient: {
      ssin: patientSSIN,
      familyname: PREDEFINED_FIELDS.PATIENT_LASTNAME,
      firstname: PREDEFINED_FIELDS.PATIENT_FIRSTNAME,
    },
    deliveries: medicationHistoryEvent.map((delivery) => {
      // The delivered product
      let product = GetNestedKey(delivery, "product.description");
      let drugType:
        | "medicinalproduct"
        | "substanceproduct"
        | "compoundprescription"
        | undefined =
        "productCode" in product
          ? "medicinalproduct"
          : "magistralPreparation" in product
            ? "compoundprescription"
            : undefined;

      let isFormulary = GetNestedKey(
        product,
        "magistralPreparation.formularyReference",
        false,
      );
      let ingredients = GetNestedKey(
        product,
        "magistralPreparation.compound",
        [],
      ) as {
        [x: string]: any;
      }[];
      let intendedname = GetNestedKey(
        product,
        "unregisteredProduct",
        undefined,
      );
      let compoundprescriptionText = GetNestedKey(
        product,
        "magistralPreparation.magistralText",
        undefined,
      );
      let isPrescribed = GetNestedKey(delivery, "product.@_prescribed", false);

      let intendedcd =
        drugType !== "compoundprescription"
          ? GetNestedKey(product, "productCode.cnk", "0000000")
          : undefined;

      return {
        deliveredMode: isPrescribed
          ? "dispensedForSamePrescription"
          : "dispensedWithoutPrescription",
        drugs: [
          {
            dispensationGuid: GetNestedKey(delivery, "entityId.id"),
            drugType: drugType,
            intendedcd: intendedcd,
            intendedname: intendedname,
            compoundprescriptionText: compoundprescriptionText,
            formulary:
              isFormulary !== false
                ? {
                    code: GetNestedKey(
                      product,
                      "magistralPreparation.formularyReference.formulaCode",
                    ),
                    name: GetNestedKey(
                      product,
                      "magistralPreparation.formularyReference.formulaName",
                    ),
                  }
                : undefined,
            ingredients:
              ingredients.length !== 0
                ? ingredients?.map((ingredient) => {
                    let ingredientType:
                      | "medicinalproduct"
                      | "substanceproduct" =
                      "medicinalproduct" in ingredient
                        ? "medicinalproduct"
                        : "substanceproduct";

                    let quantityIngredient: boolean = "quantity" in ingredient;

                    return {
                      drug: {
                        drugType: ingredientType,
                        intendedcd:
                          ingredientType === "medicinalproduct"
                            ? GetNestedKey(
                                ingredient,
                                "medicinalproduct.intendedProduct",
                                undefined,
                              )
                            : GetNestedKey(
                                ingredient,
                                "substance.substancecode",
                              ),
                        intendedname:
                          ingredientType === "medicinalproduct"
                            ? GetNestedKey(
                                ingredient,
                                "medicinalproduct.intendedname",
                                undefined,
                              )
                            : GetNestedKey(
                                ingredient,
                                "substance.substancename",
                              ),
                        deliveredcd:
                          ingredientType === "medicinalproduct"
                            ? GetNestedKey(
                                ingredient,
                                "medicinalproduct.deliveredProduct",
                                undefined,
                              )
                            : undefined,
                        deliveredname:
                          ingredientType === "medicinalproduct"
                            ? GetNestedKey(
                                ingredient,
                                "medicinalproduct.deliveredname",
                                undefined,
                              )
                            : undefined,
                      },
                      quantityPrefix: GetNestedKey(
                        ingredient,
                        "quantityprefix",
                        undefined,
                      ),
                      quantity: quantityIngredient
                        ? {
                            amount: GetNestedKey(
                              ingredient,
                              "quantity.decimal",
                            ) as number,
                            unit: GetNestedKey(
                              ingredient,
                              "quantity.unit",
                              undefined,
                            ),
                          }
                        : undefined,
                    };
                  })
                : undefined,
          },
        ],
      };
    }),
  };
}