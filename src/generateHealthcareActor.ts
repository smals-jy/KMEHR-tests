import { PREDEFINED_FIELDS, addPrefix } from "./constants";
import type { Virtual_XML, Virtual_XML_Entry } from "./constants";

// Generate a XML-like author

export type OrganizationConfig = {
  nihdi?: string;
  type: string;
  name?: string;
};

export type Hub = "VITALINK" | "RSW" | "RSB";

export type AuthorConfig = {
  firstname?: string;
  familyname?: string;
  nihdi?: string;
  ssin?: string;
  type?: string;
  org?: OrganizationConfig;
  hub?: Hub;
  software?: SoftwareConfig;
};

type HubConfig = {
  name: string;
  id: string;
};

// Source : EVS
// PROP_HUBID
const HubConfig = {
  RSW: {
    id: "1990000035",
    name: "RSW",
  },
  RSB: {
    id: "1990000728",
    name: "RSB",
  },
  VITALINK: {
    id: "1990001916",
    name: "VITALINK",
  },
} satisfies Record<Hub, HubConfig>;

type SoftwareConfig = {
  name?: string;
  id: string;
};

// Generate individual
/*
Fields (as individual) [1-1]:
- INAMI/NIHII [0-1]
- SSIN [0-1]
- Type of individual [1-1]: CD-HCPARTY
- Name [0-1]
- First name [0-1]
*/
function generateIndividual(config?: AuthorConfig): Virtual_XML_Entry {
  const commonPrefix = PREDEFINED_FIELDS.COMMON_PREFIX;

  let result: Virtual_XML[] = [];

  // Nihii number (could be null)
  if (config?.nihdi !== null) {
    result.push({
      [addPrefix(commonPrefix, "id")]: [
        {
          "#text": config?.nihdi || PREDEFINED_FIELDS.AUTHOR_NIHDI,
        },
      ],
      ":@": {
        "@_S": "ID-HCPARTY",
        "@_SV": "1.0",
      },
    });
  }

  // SSIN (could be null)
  if (config?.ssin !== null) {
    result.push({
      [addPrefix(commonPrefix, "id")]: [
        {
          "#text": config?.ssin || PREDEFINED_FIELDS.AUTHOR_SSIN,
        },
      ],
      ":@": {
        "@_S": "INSS",
        "@_SV": "1.0",
      },
    });
  }

  // Mandatory
  result.push(
    ...[
      // HC-PARTY
      {
        [addPrefix(commonPrefix, "cd")]: [
          {
            "#text": config?.type || PREDEFINED_FIELDS.AUTHOR_TYPE,
          },
        ],
        ":@": {
          "@_S": "CD-HCPARTY",
          "@_SV": "1.0",
        },
      },
      // firstname
      {
        [addPrefix(commonPrefix, "firstname")]: [
          {
            "#text": config?.firstname || PREDEFINED_FIELDS.AUTHOR_FIRSTNAME,
          },
        ],
      },
      // lastname
      {
        [addPrefix(commonPrefix, "familyname")]: [
          {
            "#text": config?.familyname || PREDEFINED_FIELDS.AUTHOR_LASTNAME,
          },
        ],
      },
    ],
  );

  // Result
  return {
    [addPrefix(commonPrefix, "hcparty")]: result,
  };
}

// Generate organisation
/*
- INAMI/NIHII [0-1] : ID-HCPARTY
- Type of organisation [1-1]: CD-HCPARTY
- Name [0-1]: name of the organisation
*/
function generateOrganization(config?: OrganizationConfig): Virtual_XML_Entry {
  const commonPrefix = PREDEFINED_FIELDS.COMMON_PREFIX;

  let result: Virtual_XML[] = [];

  // Nihii number (could be null)
  if (config?.nihdi !== null) {
    result.push({
      [addPrefix(commonPrefix, "id")]: [
        {
          "#text": config?.nihdi || PREDEFINED_FIELDS.ORGANIZATION_NIHDI,
        },
      ],
      ":@": {
        "@_S": "ID-HCPARTY",
        "@_SV": "1.0",
      },
    });
  }

  // Type of organization
  result.push(
    // HC-PARTY
    {
      [addPrefix(commonPrefix, "cd")]: [
        {
          "#text": config?.type || PREDEFINED_FIELDS.ORGANIZATION_TYPE,
        },
      ],
      ":@": {
        "@_S": "CD-HCPARTY",
        "@_SV": "1.0",
      },
    },
  );

  // Name of organization (could be null)
  if (config?.name !== null) {
    result.push(
      // NAME
      {
        [addPrefix(commonPrefix, "name")]: [
          {
            "#text": config?.name || PREDEFINED_FIELDS.ORGANIZATION_NAME,
          },
        ],
      },
    );
  }

  // Result
  return {
    [addPrefix(commonPrefix, "hcparty")]: result,
  };
}

/*
Fields (as hub) [0-1]:
- Type (=hub) [1-1]: CD-HCPARTY
- Name [0-1]: name of the hub
*/
function generateHub(hub: Hub): Virtual_XML_Entry {
  const commonPrefix = PREDEFINED_FIELDS.COMMON_PREFIX;
  let safeConfig = HubConfig[hub];

  // Result
  return {
    [addPrefix(commonPrefix, "hcparty")]: [
      // ID
      {
        [addPrefix(commonPrefix, "id")]: [
          {
            "#text": safeConfig.id,
          },
        ],
        ":@": {
          "@_S": "ID-HCPARTY",
          "@_SV": "1.0",
        },
      },
      // HC-PARTY
      {
        [addPrefix(commonPrefix, "cd")]: [
          {
            "#text": "hub",
          },
        ],
        ":@": {
          "@_S": "CD-HCPARTY",
          "@_SV": "1.0",
        },
      },
      // NAME
      {
        [addPrefix(commonPrefix, "name")]: [
          {
            "#text": safeConfig.name,
          },
        ],
      },
    ],
  };
}

/*
Fields (as software) [0-1]:
- Type (=software) [1-1]: CD-HCPARTY
- Name [0-1]: name of the software
- ID [1-1] : id of the software
*/
function generateSoftware(software: SoftwareConfig): Virtual_XML_Entry {
  const commonPrefix = PREDEFINED_FIELDS.COMMON_PREFIX;

  // Result
  let result: Virtual_XML[] = [];

  // ID (mandatory)
  result.push({
    [addPrefix(commonPrefix, "id")]: [
      {
        "#text": software.id || PREDEFINED_FIELDS.SOFTWARE_ID,
      },
    ],
    ":@": {
      "@_S": "LOCAL",
      "@_SL": "endusersoftwareinfo",
      "@_SV": "1.0",
    },
  });

  // Type (software)
  result.push(
    // HC-PARTY
    {
      [addPrefix(commonPrefix, "cd")]: [
        {
          "#text": "software",
        },
      ],
      ":@": {
        "@_S": "CD-HCPARTY",
        "@_SV": "1.0",
      },
    },
  );

  // Name of software
  if (software?.name !== undefined) {
    result.push(
      // NAME
      {
        [addPrefix(commonPrefix, "name")]: [
          {
            "#text": software?.name || PREDEFINED_FIELDS.SOFTWARE_NAME,
          },
        ],
      },
    );
  }

  // Result
  return {
    [addPrefix(commonPrefix, "hcparty")]: result,
  };
}

/*
  A medicationscheme has one responsible author. This
  author must be identified as an individual, but can
  furthermore also be part of an organisation.
*/
export function generateAuthor(config?: AuthorConfig): Virtual_XML {
  return [
    // (Optional) hub
    config?.hub ? generateHub(config.hub) : undefined,
    // (Optional) organization
    config?.org ? generateOrganization(config.org) : undefined,
    // (Optional) sofware
    config?.software ? generateSoftware(config.software) : undefined,
    // Mandatory - Individual that wrote the MS line
    generateIndividual(config),
  ].filter((s) => s !== undefined) as Virtual_XML;
}
