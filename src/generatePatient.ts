import type { Configuration } from "./config";
import { PREDEFINED_FIELDS, addPrefix } from "./constants";
import type { Virtual_XML } from "./constants";

export function generatePatient(config?: Configuration): Virtual_XML {
  const commonPrefix = PREDEFINED_FIELDS.COMMON_PREFIX;

  return [
    // ID
    {
      [addPrefix(commonPrefix, "id")]: [
        {
          "#text": PREDEFINED_FIELDS.PATIENT_SSIN,
        },
      ],
      ":@": {
        "@_S": "ID-PATIENT",
        "@_SV": "1.0",
      },
    },
    // Firstname
    {
      [addPrefix(commonPrefix, "firstname")]: [
        { "#text": PREDEFINED_FIELDS.PATIENT_FIRSTNAME },
      ],
    },
    // Lastname
    {
      [addPrefix(commonPrefix, "familyname")]: [
        { "#text": PREDEFINED_FIELDS.PATIENT_LASTNAME },
      ],
    },
    // Birthdate
    {
      [addPrefix(commonPrefix, "birthdate")]: [
        {
          [addPrefix(commonPrefix, "date")]: [
            {
              "#text": PREDEFINED_FIELDS.PATIENT_BIRTHDAY,
            },
          ],
        },
      ],
    },
    // Sex
    {
      [addPrefix(commonPrefix, "sex")]: [
        {
          [addPrefix(commonPrefix, "cd")]: [
            {
              "#text": PREDEFINED_FIELDS.PATIENT_SEX,
            },
          ],
          ":@": {
            "@_S": "CD-SEX",
            "@_SV": "1.0",
          },
        },
      ],
    },
  ];
}
