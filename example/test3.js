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
  "rowHeader": [],
  "columnHeader": [
      {
          "attrName": "year",
          "blockId": "60e5f0d4-5668-4b96-a145-1bc86efb2b32",
          "left": 64,
          "top": 44,
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
          ],
          "unfolded": false,
      }
  ],
  "cell": [],
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

let spec2 = {
  "rowHeader": [],
  "columnHeader": [
      {
          "attrName": "year",
          "blockId": "60e5f0d4-5668-4b96-a145-1bc86efb2b32",
          "left": 64,
          "top": 44,
          "width": 140,
          "height": 60,
          "channel": "column",
          "entityMerge": true,
          "gridMerge": true,
          "facet": 1,
          "blankLine": false,
          "style": "TODO",
          "values": [
              "2019",
              "2020",
              "2021"
          ],
          "unfolded": false,
          "children": [
              {
                  "attrName": "season",
                  "blockId": "46a383e6-c12a-42bd-89b1-6765e1fd10dc",
                  "entityMerge": false,
                  "channel": "column"
              }
          ]
      }
  ],
  "cell": [],
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