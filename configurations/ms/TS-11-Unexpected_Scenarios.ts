// TODO change that import a bit later
import type { TransactionConfig } from "../../src/config";
import type { MSConfiguration } from "@smals-jy/kmehr-tests";

// In case I need to tweak date
function addDaysToDate(dateString: string, daysToAdd: number) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + daysToAdd);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function (): MSConfiguration {
  const BEGIN_MOMENT = "2011-12-20";
  const END_MOMENT = "2019-01-15";

  return {
    transactions: [
      // Weekday is used when frequency is a multiple of days.
      {
        id: 2,
        drug: {
          identifierType: "CD-INNCLUSTER",
          drugType: "substanceproduct",
          intendedcd: "2329969",
          intendedname: "Aspirine 500 mg (36 bruistabletten)",
          beginmoment: BEGIN_MOMENT,
          endmoment: END_MOMENT,
          temporality: "acute",
          periodicity: "DX",
          route: "00001",
          instructionForPatient:
            "Weekday is used when frequency is a multiple of days ===EVSREF:100===",
          regimen: [
            {
              quantity: 1001,
              unit: "00001",
              timeOfDay: {
                dayPeriod: "duringdinner",
              },
              dayIngestion: {
                weekday: "thursday",
              },
            },
          ],
        },
      },
      // Daynumber is bigger than the frequency.
      {
        id: 3,
        drug: {
          identifierType: "CD-INNCLUSTER",
          drugType: "substanceproduct",
          intendedcd: "1365543",
          intendedname: "Asaflow 80 mg (56 tabletten)",
          medicationuse: "Daynumber is bigger than the frequency",
          beginmoment: BEGIN_MOMENT,
          endmoment: END_MOMENT,
          temporality: "acute",
          periodicity: "DQ",
          route: "00001",
          instructionForPatient:
            "Daynumber is bigger than the frequency. ===EVSREF:101===",
          regimen: [5, 6, 4].map((dayNumber) => ({
            quantity: 1001,
            unit: "00001",
            timeOfDay: {
              dayPeriod: "beforedinner",
            },
            dayIngestion: {
              dayNumber: dayNumber,
            },
          })),
        },
      },
      // Date is used when frequency is a multiple of weeks.
      {
        id: 4,
        drug: {
          identifierType: "CD-INNCLUSTER",
          drugType: "substanceproduct",
          intendedcd: "2621936",
          intendedname: "Cardio Aspirine 100 mg (84 tabletten)",
          beginmoment: BEGIN_MOMENT,
          endmoment: END_MOMENT,
          temporality: "acute",
          periodicity: "WQ",
          route: "00001",
          instructionForPatient:
            "Date is used when frequency is a multiple of weeks. ===EVSREF:102===",
          regimen: [
            {
              dayIngestion: {
                date: "2011-12-21",
              },
              quantity: 1001,
              unit: "00001",
              timeOfDay: {
                dayPeriod: "duringdinner",
              },
            },
          ],
        },
      },
      // Regimen with both weekdays and nothing (startdate will be used).
      {
        id: 5,
        drug: {
          identifierType: "CD-INNCLUSTER",
          drugType: "substanceproduct",
          intendedcd: "1690262",
          intendedname: "Aspirine 100 mg (30 tabletten)",
          beginmoment: BEGIN_MOMENT,
          endmoment: END_MOMENT,
          instructionForPatient:
            "Regimen with both weekdays and nothing (startdate will be used) ===EVSREF:103===",
          temporality: "acute",
          periodicity: "WZ",
          route: "00001",
          regimen: [
            {
              quantity: 1001,
              unit: "00001",
              timeOfDay: {
                dayPeriod: "duringdinner",
              },
              dayIngestion: {
                weekday: "thursday",
              },
            },
            {
              quantity: 1001,
              unit: "00001",
              timeOfDay: {
                dayPeriod: "duringlunch",
              },
              dayIngestion: {
                weekday: "thursday",
              },
            },
            {
              quantity: 1001,
              unit: "00001",
              timeOfDay: {
                dayPeriod: "duringdinner",
              },
              dayIngestion: {
                weekday: "friday",
              },
            },
            {
              quantity: 1001,
              unit: "00001",
              timeOfDay: {
                dayPeriod: "duringlunch",
              },
              dayIngestion: {
                weekday: "friday",
              },
            },
          ],
        },
      },
      // No frequency is specified and weekday is used.
      {
        id: 6,
        drug: {
          drugType: "substanceproduct",
          identifierType: "CD-INNCLUSTER",
          intendedcd: "3040532",
          intendedname: "ASA EG 100 mg (168 tabletten)",
          beginmoment: BEGIN_MOMENT,
          endmoment: END_MOMENT,
          temporality: "acute",
          route: "00001",
          regimen: [
            {
              quantity: 1001,
              unit: "00001",
              timeOfDay: {
                dayPeriod: "duringdinner",
              },
              dayIngestion: {
                weekday: "tuesday",
              },
            },
          ],
          instructionForPatient:
            "No frequency is specified and weekday is used. ===EVSREF:104===",
        },
      },
      // Daynumber is used when frequency is a multiple of months.
      {
        id: 7,
        drug: {
          drugType: "substanceproduct",
          identifierType: "CD-INNCLUSTER",
          intendedcd: "3150158",
          intendedname: "Aspirine Fasttabs 500 mg (20 tabletten)",
          beginmoment: BEGIN_MOMENT,
          endmoment: END_MOMENT,
          temporality: "acute",
          periodicity: "MN",
          route: "00001",
          regimen: [
            {
              dayIngestion: {
                dayNumber: 6,
              },
              quantity: 1001,
              unit: "00001",
              timeOfDay: {
                dayPeriod: "duringdinner",
              },
            },
          ],
          instructionForPatient:
            "Daynumber is used when frequency is a multiple of months ===EVSREF:105===",
        },
      },
      // The 'day' part in the date field of the regimen is higher than 28 when frequency is a multiple of months.
      {
        id: 8,
        drug: {
          drugType: "substanceproduct",
          identifierType: "CD-INNCLUSTER",
          intendedcd: "2605335",
          intendedname: "Cardio Aspirine 100 mg (56 tabletten)",
          beginmoment: BEGIN_MOMENT,
          endmoment: END_MOMENT,
          temporality: "acute",
          periodicity: "MN",
          regimen: [
            {
              quantity: 1001,
              unit: "00001",
              timeOfDay: {
                dayPeriod: "duringdinner",
              },
              dayIngestion: {
                date: "2020-03-29",
              },
            },
          ],
          route: "00001",
          instructionForPatient:
            "The 'day' part in the date field of the regimen is higher than 28 when frequency is a multiple of months. ===EVSREF:106===",
        },
      },
      // Weekday is used when frequency is a multiple of years.
      {
        id: 9,
        drug: {
          drugType: "substanceproduct",
          identifierType: "CD-INNCLUSTER",
          intendedcd: "3001898",
          intendedname: "Alka-Seltzer 324 mg (20 bruistabletten)",
          beginmoment: BEGIN_MOMENT,
          endmoment: END_MOMENT,
          temporality: "acute",
          periodicity: "J",
          route: "00001",
          regimen: [
            {
              quantity: 1001,
              unit: "00001",
              timeOfDay: {
                dayPeriod: "duringdinner",
              },
              dayIngestion: {
                weekday: "thursday",
              },
            },
          ],
          instructionForPatient:
            "Weekday is used when frequency is a multiple of years. ===EVSREF:107===",
        },
      },
      // The 'day' part in the date field of the regimen is higher than 28 when frequency is a multiple of years.
      {
        id: 10,
        drug: {
          drugType: "substanceproduct",
          identifierType: "CD-INNCLUSTER",
          intendedcd: "1112481",
          intendedname: "Cardegic 160 mg (30 zakjes)",
          beginmoment: BEGIN_MOMENT,
          endmoment: END_MOMENT,
          temporality: "acute",
          periodicity: "JT",
          route: "00001",
          regimen: [
            {
              dayIngestion: {
                date: "2020-02-29",
              },
              quantity: 1001,
              unit: "00001",
              timeOfDay: {
                dayPeriod: "duringdinner",
              },
            },
          ],
          instructionForPatient:
            "The 'day' part in the date field of the regimen is higher than 28 when frequency is a multiple of years. ===EVSREF:108===",
        },
      },
      // Daynumber in the regimen is higher than the multiple of weeks frequency.
      {
        id: 11,
        drug: {
          drugType: "substanceproduct",
          identifierType: "CD-INNCLUSTER",
          intendedcd: "2962975",
          intendedname: "Aspirine Caffeïne 650 mg / 65 mg (30 tabletten)",
          beginmoment: BEGIN_MOMENT,
          endcondition: END_MOMENT,
          temporality: "acute",
          periodicity: "WD",
          route: "00001",
          regimen: [
            {
              quantity: 1001,
              unit: "00001",
              timeOfDay: {
                dayPeriod: "duringdinner",
              },
              dayIngestion: {
                dayNumber: 22,
              },
            },
          ],
          instructionForPatient:
            "Daynumber in the regimen is higher than the multiple of weeks frequency. ===EVSREF:109===",
        },
      },
      // Medication is suspended without an endmoment.
      {
        id: 12,
        drug: {
          drugType: "substanceproduct",
          identifierType: "CD-INNCLUSTER",
          intendedcd: "0102566",
          intendedname: "Aspirine C 400 mg / 240 mg (20 bruistabletten)",
          beginmoment: BEGIN_MOMENT,
          endmoment: END_MOMENT,
          temporality: "acute",
          route: "00001",
          regimen: [
            {
              dayIngestion: {
                date: "2011-12-23",
              },
              quantity: 1,
              unit: "00002",
              timeOfDay: {
                time: "12:00:00",
              },
            },
            {
              dayIngestion: {
                date: "2011-12-23",
              },
              quantity: 1.5,
              unit: "00002",
              timeOfDay: {
                time: "15:00:00",
              },
            },
            {
              dayIngestion: {
                date: "2011-12-23",
              },
              quantity: 2,
              unit: "00002",
              timeOfDay: {
                time: "18:00:00",
              },
            },
          ],
          instructionForPatient:
            "Medication is suspended without an endmoment. ===EVSREF:110===",
        },
      },
      {
        id: 13,
        drug: {
          drugType: "substanceproduct",
          identifierType: "CD-INNCLUSTER",
          intendedcd: "0102566",
          intendedname: "Aspirine C 400 mg / 240 mg (20 bruistabletten)",
          beginmoment: BEGIN_MOMENT,
          lifecycle: "suspended",
          posologyFreeText: null,
        },
        suspensionReason: "Wegens interactie met andere medicatie. definitief.",
        suspensionReference: 12,
      },
      // Temporality is missing.
      {
        id: 14,
        drug: {
          drugType: "substanceproduct",
          identifierType: "CD-INNCLUSTER",
          intendedcd: "0102566",
          intendedname: "Aspirine C 400 mg / 240 mg (20 bruistabletten)",
          beginmoment: BEGIN_MOMENT,
          endmoment: END_MOMENT,
          route: "00001",
          regimen: [
            {
              dayIngestion: {
                date: "2011-12-23",
              },
              quantity: 1,
              unit: "00002",
              timeOfDay: {
                time: "12:00:00",
              },
            },
            {
              dayIngestion: {
                date: "2011-12-23",
              },
              quantity: 1.5,
              unit: "00002",
              timeOfDay: {
                time: "15:00:00",
              },
            },
            {
              dayIngestion: {
                date: "2011-12-23",
              },
              quantity: 2,
              unit: "00002",
              timeOfDay: {
                time: "18:00:00",
              },
            },
          ],
          instructionForPatient: "Temporality is missing ===EVSREF:111===",
        },
      },
      // Length of the instructionforpatient field is longer than 340 characters.
      {
        id: 15,
        drug: {
          drugType: "substanceproduct",
          identifierType: "CD-INNCLUSTER",
          intendedcd: "2542488",
          intendedname: "Asaflow 80 mg (168 tabletten)",
          beginmoment: BEGIN_MOMENT,
          endmoment: END_MOMENT,
          temporality: "acute",
          posologyFreeText:
            "Length of the instructionforpatient field is longer than 340 characters",
          instructionForPatient:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi id condimentum risus. Suspendisse non viverra justo, malesuada commodo tellus. Aenean et quam id nunc fermentum auctor nec vel erat. Suspendisse nec imperdiet ex, eu convallis neque. Proin tempor urna eget augue tincidunt, eu dignissim nibh ultrices. Sed at congue ex. Curabitur ===EVSREF:112===",
        },
      },
      // Medication in the treatment suspension differs from the corresponding medicationscheme element.
      {
        id: 16,
        drug: {
          drugType: "substanceproduct",
          identifierType: "CD-INNCLUSTER",
          intendedcd: "2767796",
          intendedname: "Algostase Mono 500 mg (10 tabletten)",
          beginmoment: BEGIN_MOMENT,
          endmoment: END_MOMENT,
          instructionForPatient:
            "Medication in the treatment suspension differs from the corresponding medicationscheme element. ===EVSREF:113===",
        },
      },
      {
        id: 17,
        drug: {
          lifecycle: "stopped",
          drugType: "medicinalproduct",
          identifierType: "CD-DRUG-CNK",
          intendedcd: "0102566",
          intendedname: "Aspirine C 400 mg / 240 mg (20 bruistabletten)",
          posologyFreeText: null,
        },
        suspensionReference: 16,
        suspensionReason: "Wegens interactie met andere medicatie. definitief.",
      },
      // Quantity contains a value that is bigger than 4 digits.
      {
        id: 18,
        drug: {
          drugType: "medicinalproduct",
          identifierType: "CD-DRUG-CNK",
          intendedcd: "0656835",
          intendedname:
            "Actilyse inj./inf. oploss. (pdr.+solv.) i.v. [2x flac.] 1x 50mg",
          beginmoment: "2017-11-02",
          endmoment: "2017-11-03",
          periodicity: "D",
          temporality: "acute",
          regimen: [
            {
              quantity: 9999,
              unit: "00024",
              timeOfDay: {
                dayPeriod: "beforelunch",
              },
            },
            {
              quantity: 9999,
              unit: "00024",
              timeOfDay: {
                dayPeriod: "duringlunch",
              },
            },
            {
              quantity: 99999,
              unit: "00024",
              timeOfDay: {
                dayPeriod: "afterlunch",
              },
            },
          ],
          instructionForPatient:
            "Quantity contains a value that is bigger than 4 digits. ===EVSREF:114===",
        },
      },
      // More than five treatment suspensions.
      ...Array.from({ length: 7 }, (_, i) => i).map((idx) => {
        let payload: TransactionConfig = {
          id: 19 + idx,
          drug: {
            drugType: "substanceproduct",
            identifierType: "CD-INNCLUSTER",
            intendedcd: "1553957",
            intendedname: "Aspégic 500 mg (30 zakjes)",
            beginmoment: idx === 0 ? BEGIN_MOMENT : "2011-12-21",
            endmoment: idx === 0 ? END_MOMENT : "2011-12-22",
            instructionForPatient:
              "More than five treatment suspensions. ===EVSREF:115===",
            lifecycle: idx !== 0 ? "suspended" : undefined,
            posologyFreeText: idx === 0 ? "Free text posology" : null,
          },
          suspensionReference: idx !== 0 ? 19 : undefined,
          suspensionReason:
            idx !== 0
              ? "Wegens interactie met andere medicatie. definitief."
              : undefined,
        };
        return payload;
      }),
      // Endmoment and duration are used together.
      {
        id: 26,
        drug: {
          drugType: "substanceproduct",
          identifierType: "CD-INNCLUSTER",
          intendedcd: "1170232",
          intendedname: "Troc (20 tabletten)",
          beginmoment: BEGIN_MOMENT,
          endmoment: END_MOMENT,
          temporality: "acute",
          duration: {
            quantity: 5,
            timeunit: "d",
          },
          regimen: [
            {
              dayIngestion: {
                date: "2011-12-23",
              },
              quantity: 1,
              unit: "00002",
              timeOfDay: {
                time: "12:00:00",
              },
            },
            {
              dayIngestion: {
                date: "2011-12-23",
              },
              quantity: 1.5,
              unit: "00002",
              timeOfDay: {
                time: "15:00:00",
              },
            },
            {
              dayIngestion: {
                date: "2011-12-23",
              },
              quantity: 2,
              unit: "00002",
              timeOfDay: {
                time: "18:00:00",
              },
            },
          ],
          instructionForPatient:
            "Endmoment and duration are used together. ===EVSREF:117===",
        },
      },
      // Duration bevat de waarde 0.
      {
        id: 27,
        drug: {
          drugType: "substanceproduct",
          identifierType: "CD-INNCLUSTER",
          intendedcd: "2113082",
          intendedname:
            "Perdolan Compositum Volwassenen 200 mg / 200 mg / 46 mg (30 tabletten)",
          beginmoment: BEGIN_MOMENT,
          endmoment: END_MOMENT,
          temporality: "acute",
          route: "00001",
          instructionForPatient: "Duration bevat de waarde 0. ===EVSREF:119===",
        },
      },
      {
        id: 28,
        drug: {
          drugType: "substanceproduct",
          identifierType: "CD-INNCLUSTER",
          intendedcd: "2113082",
          intendedname:
            "Perdolan Compositum Volwassenen 200 mg / 200 mg / 46 mg (30 tabletten)",
          beginmoment: addDaysToDate(BEGIN_MOMENT, 1),
          lifecycle: "suspended",
          posologyFreeText: null,
          duration: {
            quantity: 0,
            timeunit: "d",
          },
        },
        suspensionReference: 27,
        suspensionReason: "Wegens interactie met andere medicatie. definitief.",
      },
      // Quantity is kleiner of gelijk aan 0.
      {
        id: 29,
        drug: {
          drugType: "substanceproduct",
          identifierType: "CD-INNCLUSTER",
          intendedcd: "1563295",
          intendedname: "Perdolan Kinderen 350 mg (12 zetpillen)",
          beginmoment: BEGIN_MOMENT,
          endmoment: END_MOMENT,
          temporality: "acute",
          regimen: [
            {
              quantity: -1,
              unit: "00002",
              timeOfDay: {
                dayPeriod: "afterbreakfast",
              },
            },
            {
              quantity: 1.5,
              unit: "00002",
              timeOfDay: {
                dayPeriod: "betweenlunchanddinner",
              },
            },
          ],
          instructionForPatient:
            "Quantity is kleiner of gelijk aan 0. ===EVSREF:120===",
        },
      },
      // Quantity contains a value with trailing zeros.
      {
        id: 30,
        drug: {
          drugType: "medicinalproduct",
          identifierType: "CD-DRUG-CNK",
          intendedcd: "0656835",
          intendedname:
            "Actilyse inj./inf. oploss. (pdr.+solv.) i.v. [2x flac.] 1x 50mg",
          beginmoment: BEGIN_MOMENT,
          endmoment: END_MOMENT,
          periodicity: "D",
          regimen: [
            {
              quantity: "1.00",
              unit: "00001",
              timeOfDay: {
                dayPeriod: "duringbreakfast",
              },
            },
            {
              quantity: "1.00",
              unit: "00001",
              timeOfDay: {
                dayPeriod: "duringlunch",
              },
            },
            {
              quantity: "1.00",
              unit: "00001",
              timeOfDay: {
                dayPeriod: "duringdinner",
              },
            },
          ],
          instructionForPatient:
            "Quantity contains a value with trailing zeros. ===EVSREF:121===",
        },
      },
      // Invalid CNK / INNCLUSTER code.
      {
        id: 31,
        drug: {
          drugType: "substanceproduct",
          intendedcd: "1439561",
          deliveredcd: "1439562",
          identifierType: "CD-DRUG-CNK",
          intendedname: "STOFNAAM: Topazolam tab 50x 0,5mg",
          deliveredname: "Topazolam tab 50x 1,0mg",
          beginmoment: BEGIN_MOMENT,
          endmoment: END_MOMENT,
          identifierIntendedType: "CD-INNCLUSTER",
          identifierDeliveredType: "CD-DRUG-CNK",
          instructionForPatient:
            "Invalid CNK / INNCLUSTER code. ===EVSREF:126===",
        },
      },
    ],
  };
}
