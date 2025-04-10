import type { MSConfiguration } from "@smals-jy/kmehr-tests";

/*
Test scenario provided by RIZIV :

PANTOPRAZOL EG (EUROGENERICS) 40 mg tablet uit verpakking van 100 tabletten:
1 tablet per dag ’s ochtends nuchter om 8.00 h, langs de mond

KREDEX 25 mg tablet uit verpakking van 56 tabletten:
1 tablet ’s ochtends om 8.00 h bij ontbijt
+ 1 tablet ’s avonds 18.00 h bij avondeten per dag, langs de mond

TRIXEO dosisaerosolsuspenser Aerosphere uit verpakking van 3 stuks
2 puffs ’s ochtends om 8.00 h voor ontbijt
+ puffs ’s avonds om 18.00 h voor avondeten per dag, per inhalatie

JARDIANCE 10 mg tablet uit verpakking van 100 tabletten:
1 tablet per dag ’s ochtends om 8.00 h bij ontbijt, langs de mond

TRESIBA voorgevulde pen FlexTouch uit verpakking van 3 pennen van 3 ml 200 I/1 mL:
12 Eenheden per dag ’s avonds 22h voor slapengaan, onderhuids
*/

export default function (): MSConfiguration {
  const BEGIN_MOMENT = "2020-06-10";

  return {
    author: {
      familyname: "Tasmanian",
      firstname: "Devil",
      type: "persphysician",
      nihdi: "11425214001",
    },
    date: BEGIN_MOMENT,
    transactions: [
      {
        id: 2,
        drug: {
          drugType: "medicinalproduct",
          intendedcd: "3303948",
          intendedname: "Pantoprazole EG 40 mg maagsapresist. tabl. 100",
          temporality: "chronic",
          periodicity: "D",
          route: "00064",
          beginmoment: BEGIN_MOMENT,
          regimen: [
            {
              quantity: 1,
              timeOfDay: {
                dayPeriod: "morning",
              },
              unit: "00005",
            },
          ],
        },
      },
      {
        id: 3,
        drug: {
          drugType: "medicinalproduct",
          intendedcd: "0482554",
          intendedname: "Kredex 25 mg tabl. 56",
          temporality: "chronic",
          periodicity: "D",
          route: "00064",
          beginmoment: BEGIN_MOMENT,
          regimen: [
            {
              quantity: 1,
              unit: "00005",
              timeOfDay: {
                dayPeriod: "duringbreakfast",
              },
            },
            {
              quantity: 1,
              unit: "00005",
              timeOfDay: {
                dayPeriod: "duringdinner",
              },
            },
          ],
        },
      },
      {
        id: 4,
        drug: {
          drugType: "medicinalproduct",
          intendedcd: "4332284",
          intendedname:
            "Trixeo Aerosphere 5 µg dosisaerosol susp. inhalator 3 x 120 doses",
          temporality: "chronic",
          periodicity: "D",
          route: "00049",
          beginmoment: BEGIN_MOMENT,
          regimen: [
            {
              quantity: 2,
              unit: "00023",
              dayIngestion: {
                dayNumber: 1,
              },
              timeOfDay: {
                dayPeriod: "duringbreakfast",
              },
            },
            {
              quantity: 1,
              unit: "00023",
              dayIngestion: {
                dayNumber: 1,
              },
              timeOfDay: {
                dayPeriod: "duringdinner",
              },
            },
          ],
        },
      },
      {
        id: 5,
        drug: {
          drugType: "medicinalproduct",
          intendedcd: "3153665",
          intendedname: "Jardiance 10 mg filmomh. tabl. 100",
          temporality: "chronic",
          periodicity: "D",
          route: "00064",
          beginmoment: BEGIN_MOMENT,
          regimen: [
            {
              quantity: 1,
              unit: "00005",
              timeOfDay: {
                dayPeriod: "duringbreakfast",
              },
            },
          ],
        },
      },
      {
        id: 6,
        drug: {
          drugType: "medicinalproduct",
          intendedcd: "3804788",
          intendedname:
            "Tresiba 200 U/ml inj. opl. s.c. voorgev. pen 3 x 3 ml FlexTouch",
          temporality: "chronic",
          periodicity: "D",
          route: "00068",
          beginmoment: BEGIN_MOMENT,
          regimen: [
            {
              quantity: 12,
              unit: "internationalunits",
              timeOfDay: {
                dayPeriod: "thehourofsleep",
              },
            },
          ],
        },
      },
    ],
  };
}
