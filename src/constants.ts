import type { PrefixConfig } from "./config";

// Constants, for the sake to make my life easier
export const PREDEFINED_FIELDS = {
  // Author data
  AUTHOR_FIRSTNAME: "Donald",
  AUTHOR_LASTNAME: "Duck",
  AUTHOR_NIHDI: "17892144001",
  AUTHOR_SSIN: generateSSIN(),
  AUTHOR_TYPE: "persphysician",
  // ORGANISATION data
  ORGANIZATION_NIHDI: "80000551",
  ORGANIZATION_TYPE: "orgpharmacy",
  ORGANIZATION_NAME: "Pharmacie - code 200",
  // HUB data
  HUB: "RSB",
  // Software data
  SOFTWARE_ID: "nihdi-vidis-caregiver",
  SOFTWARE_NAME: "VIDIS Healthcare Software",
  // Patient data
  PATIENT_FIRSTNAME: "Tasmanian",
  PATIENT_LASTNAME: "Devil",
  PATIENT_SSIN: generateSSIN(),
  PATIENT_SEX: "male",
  PATIENT_BIRTHDAY: "1992-06-19",
  // Date info
  DATE: "2018-04-19",
  TIME: "14:30:09",
  // MS version
  MS_VERSION: "42",
};

// Add : to prefix, if existing
export function addPrefix(prefix: string, element: string) {
  if (prefix.length === 0) {
    return element;
  }
  return `${prefix}:${element}`;
}

// Generate a random ssin
function generateSSIN() {
  return "XXXXXXXXXXX";
}

export const defaultPrefixConfig: PrefixConfig = {
  ROOT_PREFIX: "",
  COMMON_PREFIX: "",
  LOOKUP_KEYS: {
    ID: "id",
    PATIENT: "patient",
    AUTHOR: "author",
    RECIPIENT: "recipient",
    TIME: "time",
    DATE: "date",
    VERSION: "version",
  },
}

// Types for manipulate data with fast-xml-parser
export type Virtual_XML = Array<Virtual_XML_Entry> | Virtual_XML_Entry;
type Attributes = {
  // Attributes
  ":@"?: {
    [x: string]: any;
  };
};
type FreeText = {
  // Free text
  "#text"?: any;
};
export type Virtual_XML_Entry =
  | (Attributes & FreeText)
  | ({
      // Element(s)
      [x: string]: Array<Virtual_XML>;
    } & Attributes);
