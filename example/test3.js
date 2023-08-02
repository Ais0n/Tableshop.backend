const tableShop = require("../dist/tableShop");
let data = {
  name: "sales",
  values: [
    { continent: "Asia", country: "CHN", year: "2019", season: "spr", sales: 105 },
    { continent: "Asia", country: "CHN", year: "2019", season: "aut", sales: 110 },
    { continent: "Asia", country: "CHN", year: "2020", season: "spr", sales: 120 },
    { continent: "Asia", country: "CHN", year: "2020", season: "aut", sales: 125 },
    { continent: "Asia", country: "CHN", year: "2021", season: "spr", sales: 131 },
    { continent: "Asia", country: "CHN", year: "2021", season: "aut", sales: 150 },
    { continent: "Asia", country: "JPN", year: "2019", season: "spr", sales: 60 },
    { continent: "Asia", country: "JPN", year: "2019", season: "aut", sales: 80 },
    { continent: "Asia", country: "JPN", year: "2020", season: "spr", sales: 82 },
    { continent: "Asia", country: "JPN", year: "2020", season: "aut", sales: 92 },
    { continent: "Asia", country: "JPN", year: "2021", season: "spr", sales: 95 },
    { continent: "Asia", country: "JPN", year: "2021", season: "aut", sales: 110 },
    { continent: "Europe", country: "GBR", year: "2019", season: "spr", sales: 80 },
    { continent: "Europe", country: "GBR", year: "2019", season: "aut", sales: 92 },
    { continent: "Europe", country: "GBR", year: "2020", season: "spr", sales: 95 },
    { continent: "Europe", country: "GBR", year: "2020", season: "aut", sales: 104 },
    { continent: "Europe", country: "GBR", year: "2021", season: "spr", sales: 112 },
    { continent: "Europe", country: "GBR", year: "2021", season: "aut", sales: 136 },
    { continent: "Europe", country: "FRA", year: "2019", season: "spr", sales: 59 },
    { continent: "Europe", country: "FRA", year: "2019", season: "aut", sales: 63 },
    { continent: "Europe", country: "FRA", year: "2020", season: "spr", sales: 72 },
    { continent: "Europe", country: "FRA", year: "2020", season: "aut", sales: 79 },
    { continent: "Europe", country: "FRA", year: "2021", season: "spr", sales: 86 },
    { continent: "Europe", country: "FRA", year: "2021", season: "aut", sales: 90 },
  ],
}

let spec = {
  "rowHeader": [
      {
          "attrName": "continent",
          "blockId": "bf4f90d0-07b7-49f3-8a50-8dbe00d67b74",
          "left": 84,
          "top": 90,
          "width": 140,
          "height": 60,
          "channel": "row",
          "entityMerge": false,
          "gridMerge": true,
          "facet": 1,
          "blankLine": false,
          "style": "TODO",
          "values": [
              "Asia",
              "Europe"
          ],
          "children": [
              {
                  "attrName": "country",
                  "blockId": "ac0d8a18-34a3-441e-b280-54d33736b9f6",
                  "entityMerge": false,
                  "gridMerge": true,
                  "facet": 1,
                  "blankLine": false,
                  "style": "TODO",
                  "values": [
                      "CHN",
                      "JPN",
                      "GBR",
                      "FRA"
                  ]
              }
          ]
      }
  ],
  "columnHeader": [
      {
          "attrName": "year",
          "blockId": "0fb0864c-e832-4b6f-85cc-056f09d4301b",
          "left": 245,
          "top": 77,
          "width": 140,
          "height": 60,
          "channel": "column",
          "entityMerge": false,
          "gridMerge": true,
          "facet": 1,
          "blankLine": false,
          "style": "TODO",
          "values": [
              "2019",
              "2020",
              "2021"
          ]
      }
  ],
  "cell": [
      {
          "attrName": "sales",
          "blockId": "b57e8cb9-e940-4d95-a9ad-af1a26ec1f71",
          "rowParentId": "ac0d8a18-34a3-441e-b280-54d33736b9f6",
          "colParentId": "0fb0864c-e832-4b6f-85cc-056f09d4301b",
          "style": "TODO2"
      }
  ],
  "attrInfo": [
      {
          "name": "continent",
          "values": [
              "Asia",
              "Europe"
          ],
          "dataType": "categorical"
      },
      {
          "name": "country",
          "values": [
              "CHN",
              "JPN",
              "GBR",
              "FRA"
          ],
          "dataType": "categorical"
      },
      {
          "name": "year",
          "values": [
              "2019",
              "2020",
              "2021"
          ],
          "dataType": "categorical"
      },
      {
          "name": "season",
          "values": [
              "spr",
              "aut"
          ],
          "dataType": "categorical"
      },
      {
          "name": "sales",
          "values": [
              105,
              110,
              120,
              125,
              131,
              150,
              60,
              80,
              82,
              92,
              95,
              104,
              112,
              136,
              59,
              63,
              72,
              79,
              86,
              90
          ],
          "dataType": "numerical"
      }
  ]
}

let res = tableShop.utils.transform({ data, spec: spec })