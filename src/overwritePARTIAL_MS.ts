import { isArray, isObjectLike } from "lodash";

// Constants, for the sake to make my life easier
import { PREDEFINED_FIELDS, addPrefix } from "./constants";

import { generateAuthor } from "./generateHealthcareActor";
import { generatePatient } from "./generatePatient";

import type { Configuration, PrefixConfig } from "./config";
import type { Virtual_XML, Virtual_XML_Entry } from "./constants";

// overwrite PARTIAL_MS
// commonPrefix is used, only when I need the namespaces stuff
export function overwritePARTIAL_MS(
  config: Configuration,
  obj: unknown,
  prefixConfig: PrefixConfig,
): any {

  // Set up variables
  const commonPrefix = prefixConfig.COMMON_PREFIX;
  const LOOKUP_KEYS = prefixConfig.LOOKUP_KEYS;

  // if Array, apply function on all item
  if (isArray(obj)) {
    return obj.map((item) => overwritePARTIAL_MS(config, item, prefixConfig));
  }

  // If object, treat each property separatly
  if (isObjectLike(obj)) {
    let currentXmlObj = obj as Virtual_XML_Entry;
    let entries = Object.entries(currentXmlObj);
    let result = {} as any;

    for (const [entryKey, entryValue] of entries) {
      switch (entryKey) {
        // Override date object
        case LOOKUP_KEYS.DATE:
          result[addPrefix(commonPrefix, "date")] = [
            { "#text": config.date || PREDEFINED_FIELDS.DATE },
          ];
          break;

        // Override time object
        case LOOKUP_KEYS.TIME:
          result[addPrefix(commonPrefix, "time")] = [
            { "#text": config.time || PREDEFINED_FIELDS.TIME },
          ];
          break;

        // Override version of MS
        case LOOKUP_KEYS.VERSION:
          result[addPrefix(commonPrefix, "version")] = [
            { "#text": config.version || PREDEFINED_FIELDS.MS_VERSION },
          ];
          break;

        // Override author / recipient field
        case LOOKUP_KEYS.AUTHOR:
        case LOOKUP_KEYS.RECIPIENT:
          result[entryKey] = generateAuthor(config.author);
          break;

        // Override patient
        case LOOKUP_KEYS.PATIENT:
          result[addPrefix(commonPrefix, "patient")] = generatePatient(commonPrefix);
          break;

        // Override id
        case LOOKUP_KEYS.ID:
          let currentID = entryValue as Virtual_XML;

          // If Vitalink uri, rewrite it
          if (
            currentXmlObj[":@"] !== undefined &&
            currentXmlObj[":@"]["@_SL"] &&
            Array.isArray(currentID)
          ) {
            result[addPrefix(commonPrefix, "id")] = currentID.map((s) => {
              let currentText = s["#text"];
              return {
                "#text": currentText.replace(
                  /\/subject\/[0-9]+/,
                  `/subject/${PREDEFINED_FIELDS.PATIENT_SSIN}`,
                ),
              };
            });
          } else {
            result[addPrefix(commonPrefix, "id")] = currentID;
          }
          break;

        case ":@":
          // Copy attribute(s) as it
          result[entryKey] = entryValue;
          break;

        default:
          // By default, overwrite anything that isn't match the previous conditions
          result[entryKey] = overwritePARTIAL_MS(
            config,
            entryValue,
            prefixConfig,
          );
      }
    }

    return result;
  }

  // anything else ? (like String) return it as it
  return obj;
}
