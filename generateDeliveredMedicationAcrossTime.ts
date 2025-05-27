import type { PCDHConfiguration } from "./src/config";
import path from "path";
import fs from "fs";

const drugs = [
  {
    drugType: "medicinalproduct",
    intendedcd: "1727395",
    intendedname: "Sinutab Forte 500 mg - 60 mg comp.",
    instructionForPatient: "productCode",
  },
  {
    drugType: "medicinalproduct",
    intendedcd: "3677846",
    intendedname: "Diarrheel tabl. 50",
    instructionForPatient: "productCode",
  },
  {
    drugType: "medicinalproduct",
    intendedcd: "0669663",
    intendedname: "Neotigason 25 mg harde caps. 30",
    instructionForPatient: "productCode",
  },
  {
    drugType: "medicinalproduct",
    intendedcd: "3759156",
    intendedname: "Gastricumeel tabl. 250",
    instructionForPatient: "productCode",
  },
  {
    drugType: "medicinalproduct",
    intendedcd: "3364833",
    intendedname: "Nervoheel tabl. 250",
    instructionForPatient: "productCode",
  },
  {
    drugType: "medicinalproduct",
    intendedcd: "3170941",
    intendedname: "Fluoricum Acidum Boiron 9CH globuli 4 g",
    instructionForPatient: "productCode",
  },
  {
    drugType: "medicinalproduct",
    intendedcd: "3562170",
    intendedname: "Perdolan Kinderen 32 mg/ml siroop 200 ml",
    instructionForPatient: "productCode",
  },
  {
    drugType: "medicinalproduct",
    intendedcd: "2753127",
    intendedname: "Witte Kruis 500 mg - 50 mg sachet 20",
    instructionForPatient: "productCode",
  },
  {
    drugType: "medicinalproduct",
    intendedcd: "0043265",
    intendedname: "Gabbroral 250 mg tabl. 16",
    instructionForPatient: "productCode",
  },
  {
    drugType: "medicinalproduct",
    intendedcd: "3119328",
    intendedname: "Rhinofebryl 240 mg - 3.2 mg harde caps. 30",
    instructionForPatient: "productCode",
  }
];

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Generates a list of dates, ensuring at least one date per month within the given range,
 * and then filling the rest with random dates.
 * @param numDates The total number of dates to generate.
 * @param startDateStr The start date string (e.g., "YYYY-MM-DD").
 * @param endDateStr The end date string (e.g., "YYYY-MM-DD").
 * @returns An array of Date objects.
 */
function generateDates(numDates: number, startDateStr: string, endDateStr: string): Date[] {
  const dates: Date[] = [];
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const monthDates: Date[] = [];
  let currentMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

  // Generate at least one date for each month within the range
  while (currentMonth <= endDate) {
    // Pick a random day within the current month, ensuring it's not beyond the endDate
    let randomDay = Math.floor(Math.random() * (new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate())) + 1;
    let specificDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), randomDay);

    // Adjust if the random day falls outside the range (e.g., past endDate or before startDate)
    if (specificDate < startDate) {
        specificDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    } else if (specificDate > endDate) {
        specificDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    }

    // Ensure uniqueness for the month's base date (add only if this month hasn't been added yet)
    const monthKey = `${specificDate.getFullYear()}-${specificDate.getMonth()}`;
    if (!monthDates.some(d => `${d.getFullYear()}-${d.getMonth()}` === monthKey)) {
        monthDates.push(specificDate);
    }
    
    currentMonth.setMonth(currentMonth.getMonth() + 1);
  }

  // Add the guaranteed monthly dates to the main dates array
  dates.push(...monthDates);

  // Fill remaining dates with fully random dates within the range
  const datesToAdd = Math.max(0, numDates - dates.length); // Ensure we don't try to add negative
  const startTimestamp = startDate.getTime();
  const endTimestamp = endDate.getTime();

  for (let i = 0; i < datesToAdd; i++) {
    const randomTimestamp = startTimestamp + Math.random() * (endTimestamp - startTimestamp);
    dates.push(new Date(randomTimestamp));
  }

  // Shuffle the array to mix the guaranteed monthly dates with the random ones
  for (let i = dates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [dates[i], dates[j]] = [dates[j], dates[i]];
  }

  return dates;
}

export function generatePCDHConfigurations(
  numDeliveries: number,
  startDateStr: string,
  endDateStr: string
): PCDHConfiguration[] {
  const configurations: PCDHConfiguration[] = [];

  // Generate the dates using the helper function
  const deliveryDates = generateDates(numDeliveries, startDateStr, endDateStr);

  for (const date of deliveryDates) {
    // Random drug selection
    const randomDrug = drugs[Math.floor(Math.random() * drugs.length)];

    const config: PCDHConfiguration = {
      author: {
        org: {
          type: "orgpharmacy",
          name: "Pharmacie - code 200",
          nihdi: "80000551",
        },
      },
      patient: {
        familyname: "Doe",
        firstname: "John",
        ssin: "12345678901",
      },
      date: formatDate(date),
      deliveries: [
        {
          deliveredAmount: 1,
          deliveredMode: "dispensedWithoutPrescription",
          // @ts-ignore
          drugs: [randomDrug],
        },
      ],
    };
    configurations.push(config);
  }

  return configurations;
}

// --- Configuration ---
const numberOfDeliveries = 13; // Total number of delivery files to generate
const startDate = "2024-01-01";
const endDate = "2025-05-26";
const outputDir = "configurations/pcdh"; // The directory where JSON files will be saved
// --- End Configuration ---

/**
 * Generates PCDH configurations and writes them to JSON files in the specified directory.
 * @param numDeliveries The total number of delivery files to generate.
 * @param startDate The start date for delivery generation (e.g., "YYYY-MM-DD").
 * @param endDate The end date for delivery generation (e.g., "YYYY-MM-DD").
 * @param outputDirectory The directory where the JSON files will be saved.
 */
async function writePCDHConfigurationsToFile(
  numDeliveries: number,
  startDate: string,
  endDate: string,
  outputDirectory: string
): Promise<void> {
  console.log(`Starting generation of ${numDeliveries} PCDH configurations...`);
  console.log(`Date range: ${startDate} to ${endDate}`);
  console.log(`Output directory: ${outputDirectory}`);

  // Create the output directory if it doesn't exist
  if (!fs.existsSync(outputDirectory)) {
    console.log(`Creating directory: ${outputDirectory}`);
    fs.mkdirSync(outputDirectory, { recursive: true });
  } else {
    console.log(`Directory already exists: ${outputDirectory}`);
  }

  const generatedConfigs = generatePCDHConfigurations(
    numDeliveries,
    startDate,
    endDate
  );

  console.log(`Generated ${generatedConfigs.length} configurations. Writing to files...`);

  for (let i = 0; i < generatedConfigs.length; i++) {
    const config = generatedConfigs[i];
    // Create a unique filename for each configuration
    const filename = path.join(outputDirectory, `delivery_${i + 1}.json`);
    try {
      // Write the JSON string to the file, formatted for readability
      await fs.promises.writeFile(filename, JSON.stringify(config, null, 2));
      console.log(`✅ Successfully wrote ${filename}`);
    } catch (error) {
      console.error(`❌ Error writing ${filename}:`, error);
    }
  }
  console.log(`\n🎉 All ${generatedConfigs.length} configuration files generated and saved to ${outputDirectory}`);
}

// Call the function to execute the process
// Using .then().catch() for handling the promise returned by the async function
writePCDHConfigurationsToFile(numberOfDeliveries, startDate, endDate, outputDir)
  .then(() => console.log("Process completed."))
  .catch((error) => console.error("An error occurred during the process:", error));
