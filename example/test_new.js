const tableShop = require("../dist/tableShop");

let specOld = {
  metaData: [
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
  "type": "block",
  "rowHeader": [
    {
      "entityName": "continent",
      "blockId": "15b0c4d5-fbf1-4393-b31b-5756a4ccb695",
      "channel": "row",
      "entityMerge": false,
      "gridMerge": "merged",
      "facet": 1,
      "blankLine": false,

      "values": [
        "Asia",
        "Europe"
      ],
      "children": [
        {
          "entityName": "country",
          "blockId": "c2ebc12f-bc87-4add-b0e7-009379705ab5",
          "entityMerge": false,
          "channel": "row",
          "gridMerge": "merged",
          "facet": 1,
          "blankLine": false,

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
      "entityName": "year",
      "blockId": "71fd29a2-cf54-442e-b23d-70d71584543a",
      "children": [
        {
          "entityName": "season",
          "blockId": "6a7f1ce2-e0cf-48c2-8f9d-6a796cd45780",
          "entityMerge": false,
          "channel": "column"
        }
      ],
      "channel": "column",
      "entityMerge": false,
      "gridMerge": "merged",
      "facet": 1,
      "blankLine": false,

      "values": [
        "2019",
        "2020",
        "2021"
      ]
    }
  ],
  "cell": [
    {
      "entityName": "sales",
      "blockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "channel": "cell",
      "rowParentId": "c2ebc12f-bc87-4add-b0e7-009379705ab5",
      "colParentId": "6a7f1ce2-e0cf-48c2-8f9d-6a796cd45780",
      "style": {}
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
  ],
  "left": 219,
  "top": 256,
  "styles": {
    ".table": {
      "font": {
        "weight": "Regular",
      }
    },
    ".rl1": {
      "font": {
        "size": 14,
      }
    },
    ".rl2": {
      "font": {
        "size": 12,
      }
    },
    ".cl1": {
      "font": {
        "size": 14,
      }
    },
    ".cl2": {
      "font": {
        "size": 12,
      }
    },
    // ".cell": {
    //   "font": {
    //     "size": 10,
    //   }
    // },
    ".header": {
      "border": {
        color: "#000000",
        width: 1,
        position: "All",
      }
    },
    ".evenRows": {
      "background": {
        color: "#cccccc"
      }
    }
  }
}

let spec = {
  metaData: [
    {
      continent: "Asia",
      country: "CHN",
      year: "2019",
      season: "spr",
      sales: 105,
    },
    {
      continent: "Asia",
      country: "CHN",
      year: "2019",
      season: "aut",
      sales: 110,
    },
    {
      continent: "Asia",
      country: "CHN",
      year: "2020",
      season: "spr",
      sales: 120,
    },
    {
      continent: "Asia",
      country: "CHN",
      year: "2020",
      season: "aut",
      sales: 125,
    },
    {
      continent: "Asia",
      country: "CHN",
      year: "2021",
      season: "spr",
      sales: 131,
    },
    {
      continent: "Asia",
      country: "CHN",
      year: "2021",
      season: "aut",
      sales: 150,
    },
    {
      continent: "Asia",
      country: "JPN",
      year: "2019",
      season: "spr",
      sales: 60,
    },
    {
      continent: "Asia",
      country: "JPN",
      year: "2019",
      season: "aut",
      sales: 80,
    },
    {
      continent: "Asia",
      country: "JPN",
      year: "2020",
      season: "spr",
      sales: 82,
    },
    {
      continent: "Asia",
      country: "JPN",
      year: "2020",
      season: "aut",
      sales: 92,
    },
    {
      continent: "Asia",
      country: "JPN",
      year: "2021",
      season: "spr",
      sales: 95,
    },
    {
      continent: "Asia",
      country: "JPN",
      year: "2021",
      season: "aut",
      sales: 110,
    },
    {
      continent: "Europe",
      country: "GBR",
      year: "2019",
      season: "spr",
      sales: 80,
    },
    {
      continent: "Europe",
      country: "GBR",
      year: "2019",
      season: "aut",
      sales: 92,
    },
    {
      continent: "Europe",
      country: "GBR",
      year: "2020",
      season: "spr",
      sales: 95,
    },
    {
      continent: "Europe",
      country: "GBR",
      year: "2020",
      season: "aut",
      sales: 104,
    },
    {
      continent: "Europe",
      country: "GBR",
      year: "2021",
      season: "spr",
      sales: 112,
    },
    {
      continent: "Europe",
      country: "GBR",
      year: "2021",
      season: "aut",
      sales: 136,
    },
    {
      continent: "Europe",
      country: "FRA",
      year: "2019",
      season: "spr",
      sales: 59,
    },
    {
      continent: "Europe",
      country: "FRA",
      year: "2019",
      season: "aut",
      sales: 63,
    },
    {
      continent: "Europe",
      country: "FRA",
      year: "2020",
      season: "spr",
      sales: 72,
    },
    {
      continent: "Europe",
      country: "FRA",
      year: "2020",
      season: "aut",
      sales: 79,
    },
    {
      continent: "Europe",
      country: "FRA",
      year: "2021",
      season: "spr",
      sales: 86,
    },
    {
      continent: "Europe",
      country: "FRA",
      year: "2021",
      season: "aut",
      sales: 90,
    },
    {
      continent: "America",
      country: "USA",
      year: "2019",
      season: "spr",
      sales: 101,
    },
    {
      continent: "America",
      country: "USA",
      year: "2019",
      season: "aut",
      sales: 125,
    },
    {
      continent: "America",
      country: "USA",
      year: "2020",
      season: "spr",
      sales: 130,
    },
    {
      continent: "America",
      country: "USA",
      year: "2020",
      season: "aut",
      sales: 134,
    },
    {
      continent: "America",
      country: "USA",
      year: "2021",
      season: "spr",
      sales: 140,
    },
    {
      continent: "America",
      country: "USA",
      year: "2021",
      season: "aut",
      sales: 146,
    },
    {
      continent: "America",
      country: "CAN",
      year: "2019",
      season: "spr",
      sales: 79,
    },
    {
      continent: "America",
      country: "CAN",
      year: "2019",
      season: "aut",
      sales: 80,
    },
    {
      continent: "America",
      country: "CAN",
      year: "2020",
      season: "spr",
      sales: 82,
    },
    {
      continent: "America",
      country: "CAN",
      year: "2020",
      season: "aut",
      sales: 85,
    },
    {
      continent: "America",
      country: "CAN",
      year: "2021",
      season: "spr",
      sales: 88,
    },
    {
      continent: "America",
      country: "CAN",
      year: "2021",
      season: "aut",
      sales: 90,
    },
  ],
  rowHeader: [
    {
      entityName: "continent",
      puzzleId: "0336f761-23ab-4d2b-bdaa-9cb05e93d6c6",
      structure: {
        hierarchy: {
          groupBy: false,
          cellMerge: "merged",
        },
        facet: {
          division: 1,
        },
        marginalia: {
          spacing: false,
        //   key: {
        //     position: "left",
        //     pattern: "number",
        //     nesting: true,
        //   },
        },
      },
      children: [
        {
          entityName: "country",
          puzzleId: "16a1e67d-9ae9-4781-8de3-44a60db3573b",
          structure: {
            hierarchy: {
              groupBy: false,
              cellMerge: "merged",
            },
            facet: {
              division: 1,
            },
            marginalia: {
              spacing: false,
            //   key: {
            //     position: "left",
            //     pattern: "number",
            //     nesting: true,
            //   },
            },
          },
        },
      ],
    },
  ],
  columnHeader: [
    {
      entityName: "year",
      puzzleId: "18d42a42-57bd-478a-96e4-aa3a30343279",
      children: [
        {
          entityName: "season",
          puzzleId: "143565c5-5e65-4baf-8e3c-2509fc65d999",
          structure: {
            hierarchy: {
              groupBy: false,
              cellMerge: "merged",
            },
            facet: {
              division: 1,
            },
            marginalia: {
              spacing: false,
            },
          },
        },
      ],
      structure: {
        hierarchy: {
          groupBy: false,
          cellMerge: "merged",
        },
        facet: {
          division: 1,
        },
        marginalia: {
          spacing: false,
        },
      },
    },
  ],
  cell: [
    {
        entityName: "sales",
        puzzleId: "de830993-ab5f-4eeb-b57a-12d23739812c",
        rowParentId: "16a1e67d-9ae9-4781-8de3-44a60db3573b",
        colParentId: "143565c5-5e65-4baf-8e3c-2509fc65d999",
    }
  ],
  attrInfo: [
    {
      name: "continent",
      dataType: "categorical",
      values: ["Asia", "Europe"],
    },
    {
      name: "country",
      dataType: "categorical",
      values: ["CHN", "JPN", "GBR", "FRA"],
    },
    {
      name: "year",
      dataType: "categorical",
      values: ["2019", "2020", "2021"],
    },
    {
      name: "season",
      dataType: "categorical",
      values: ["spr", "aut"],
    },
    {
      name: "sales",
      dataType: "numerical",
      values: [
        105, 110, 120, 125, 131, 150, 60, 80, 82, 92, 95, 110, 80, 92, 95, 104,
        112, 136, 59, 63, 72, 79, 86, 90,
      ],
    },
  ],
  globalStyle: {
    '.c7': {
      font: {
        fontWeight: 'Bold'
      }
    },
    '.c8': {
      font: {
        fontWeight: 'Bold'
      }
    },
    '.rl1': {
      backgroundColor: '#edb97e'
    },
    '.rl2': {
      backgroundColor: 'rgba(237, 185, 126, 0.40)'
    },
    '.cl1': {
      backgroundColor: '#90c3f9'
    },
    '.cl2': {
      backgroundColor: 'rgba(144, 195, 249, 0.40)'
    }
  }
};

// tableShop.utils.transform({data, spec})
let res = tableShop.utils.transform(specOld);

// 参考输出
let output = [
  [
    {
      // 最左上角的empty block
      rowSpan: 2,
      colSpan: 2,
      style: undefined,
    },
    {
      value: "2019",
      sourceBlockId: "44444",
      rowSpan: 1,
      colSpan: 2,
      style: undefined,
    },
    {
      value: "2020",
      sourceBlockId: "44444",
      rowSpan: 1,
      colSpan: 2,
      style: undefined,
    },
    {
      value: "2021",
      sourceBlockId: "44444",
      rowSpan: 1,
      colSpan: 2,
      style: undefined,
    },
  ],
  [
    {
      value: "spr",
      sourceBlockId: "55555",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: "aut",
      sourceBlockId: "55555",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: "spr",
      sourceBlockId: "55555",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: "aut",
      sourceBlockId: "55555",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: "spr",
      sourceBlockId: "55555",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: "aut",
      sourceBlockId: "55555",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
  ],
  [
    {
      value: "Asia",
      sourceBlockId: "11111",
      rowSpan: 2,
      colSpan: 1,
      style: undefined,
    },
    {
      value: "CHN",
      sourceBlockId: "22222",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: 105,
      sourceBlockId: "66666",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: 110,
      sourceBlockId: "66666",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: 120,
      sourceBlockId: "66666",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: 125,
      sourceBlockId: "66666",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: 131,
      sourceBlockId: "66666",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: 150,
      sourceBlockId: "66666",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
  ],
  [
    {
      value: "JPN",
      sourceBlockId: "22222",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: 60,
      sourceBlockId: "66666",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: 80,
      sourceBlockId: "66666",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: 82,
      sourceBlockId: "66666",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: 92,
      sourceBlockId: "66666",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: 95,
      sourceBlockId: "66666",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: 110,
      sourceBlockId: "66666",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
  ],
  [
    {
      value: "Europe",
      sourceBlockId: "11111",
      rowSpan: 2,
      colSpan: 1,
      style: undefined,
    },
    {
      value: "GBR",
      sourceBlockId: "22222",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: 80,
      sourceBlockId: "66666",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: 92,
      sourceBlockId: "66666",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: 95,
      sourceBlockId: "66666",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: 104,
      sourceBlockId: "66666",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: 112,
      sourceBlockId: "66666",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: 136,
      sourceBlockId: "66666",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
  ],
  [
    {
      value: "FRA",
      sourceBlockId: "22222",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: 59,
      sourceBlockId: "66666",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: 63,
      sourceBlockId: "66666",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: 72,
      sourceBlockId: "66666",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: 79,
      sourceBlockId: "66666",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: 86,
      sourceBlockId: "66666",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
    {
      value: 90,
      sourceBlockId: "66666",
      rowSpan: 1,
      colSpan: 1,
      style: undefined,
    },
  ],
];
