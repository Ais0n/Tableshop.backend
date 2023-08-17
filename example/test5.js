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
  "type": "block",
  "rowHeader": [
    {
      "attrName": "continent",
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
          "attrName": "country",
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
      "attrName": "year",
      "blockId": "71fd29a2-cf54-442e-b23d-70d71584543a",
      "children": [
        {
          "attrName": "season",
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
      "attrName": "sales",
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
let spec2 = {
  rowHeader: [{
    attrName: "continent",
    blockId: "11111",
    gridMerge: "unmerged-first", //"merged" | "unmerged-first" | "unmerged-all"
    facet: 2,
    children: [{
      attrName: "country",
      blockId: "22222",
    }]
  }],
  // rowHeader: [],
  // columnHeader: [{
    // attrName: "year",
    // blockId: "44444",
    // children: [{
    //   attrName: "season",
    //   blockId: "55555",
    //   entityMerge: false,
    // }],
  // }],
  columnHeader: [],
  cell: [{
    attrName: "sales",
    rowParentId: "22222",
    // colParentId: "55555",
    blockId: "66666",
  }
  ],
  attrInfo: [{
    name: "continent",
    dataType: "categorical",
    values: ["Asia", "Europe"],
  }, {
    name: "country",
    dataType: "categorical",
    values: ["CHN", "JPN", "GBR", "FRA"]
  }, {
    name: "year",
    dataType: "categorical",
    values: ["2019", "2020", "2021"]
  }, {
    name: "season",
    dataType: "categorical",
    values: ["spr", "aut"],
  }, {
    name: "sales",
    dataType: "numerical",
    values: [105, 110, 120, 125, 131, 150, 60, 80, 82, 92, 95, 110, 80, 92, 95, 104, 112, 136, 59, 63, 72, 79, 86, 90],
  },],
  styles: {class1: {
    border: {
      color: "#ffffff",
      width: 1,
      position: "All",
    },
    font: {
      size: 14,
      weight: "Regular",
      color: "#000000",
    },
    background: {
      color: "#123456",
    },
    indent: 5,
  }}
}

let spec3 = {
  rowHeader: [{
    attrName: "continent",
    blockId: "44444",
    entityMerge: false,
    gridMerge: "merged", //"merged" | "unmerged-first" | "unmerged-all"
    // facet: 2,
    blankLine: true,
    // key: {
    //   position: "left",
    //   // position: "embedded",
    //   pattern: "I",
    //   isInherited: true
    // },
    children: [{
      attrName: "country",
      blockId: "55555",
      entityMerge: false,
      blankLine: true,
      // facet: 2,
      // children: [{
      //   attrName: "season",
      //   blockId: "77777",
      //   entityMerge: false,
      // }]
      // key: {
      //   position: "right",
      //   // position: "embedded",
      //   pattern: "A",
      //   isInherited: true
      // },
    }],
  }],
  columnHeader: [],
  cell: [{
    attrName: "sales",
    colParentId: "77777",
    blockId: "66666",
  }],
  attrInfo: [{
    name: "continent",
    dataType: "categorical",
    values: ["Asia", "Europe"],
  }, {
    name: "country",
    dataType: "categorical",
    values: ["CHN", "JPN", "GBR", "FRA"]
  }, {
    name: "year",
    dataType: "categorical",
    values: ["2019", "2020", "2021"]
  }, {
    name: "season",
    dataType: "categorical",
    values: ["spr", "aut"],
  }, {
    name: "sales",
    dataType: "numerical",
    values: [105, 110, 120, 125, 131, 150, 60, 80, 82, 92, 95, 110, 80, 92, 95, 104, 112, 136, 59, 63, 72, 79, 86, 90],
  },],
  styles: undefined
}


// tableShop.utils.transform({data, spec})
let res = tableShop.utils.transform({ data, spec: spec2 })


// output
[
  [
    {
      "rowSpan": 2,
      "colSpan": 2,
      "row": 0,
      "col": 0,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
      }
    },
    {
      "value": "2019",
      "sourceBlockId": "71fd29a2-cf54-442e-b23d-70d71584543a",
      "rowSpan": 1,
      "colSpan": 2,

      "row": 0,
      "col": 2,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "border": "1px solid #000000",
        "font-size": 14,
      }
    },
    {
      "value": "2020",
      "sourceBlockId": "71fd29a2-cf54-442e-b23d-70d71584543a",
      "rowSpan": 1,
      "colSpan": 2,

      "row": 0,
      "col": 4,
      "unfoldbutton": true,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "border": "1px solid #000000",
        "font-size": 14,
      }
    },
    {
      "value": "2021",
      "sourceBlockId": "71fd29a2-cf54-442e-b23d-70d71584543a",
      "rowSpan": 1,
      "colSpan": 2,

      "row": 0,
      "col": 6,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "border": "1px solid #000000",
        "font-size": 14,
      }
    }
  ],
  [
    {
      "value": "spr",
      "sourceBlockId": "6a7f1ce2-e0cf-48c2-8f9d-6a796cd45780",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 1,
      "col": 2,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "border": "1px solid #000000",
        "font-size": 12,
        "background-color": "#cccccc",
      }
    },
    {
      "value": "aut",
      "sourceBlockId": "6a7f1ce2-e0cf-48c2-8f9d-6a796cd45780",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 1,
      "col": 3,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "border": "1px solid #000000",
        "font-size": 12,
        "background-color": "#cccccc",
      }
    },
    {
      "value": "spr",
      "sourceBlockId": "6a7f1ce2-e0cf-48c2-8f9d-6a796cd45780",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 1,
      "col": 4,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "border": "1px solid #000000",
        "font-size": 12,
        "background-color": "#cccccc",
      }
    },
    {
      "value": "aut",
      "sourceBlockId": "6a7f1ce2-e0cf-48c2-8f9d-6a796cd45780",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 1,
      "col": 5,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "border": "1px solid #000000",
        "font-size": 12,
        "background-color": "#cccccc",
      }
    },
    {
      "value": "spr",
      "sourceBlockId": "6a7f1ce2-e0cf-48c2-8f9d-6a796cd45780",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 1,
      "col": 6,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "border": "1px solid #000000",
        "font-size": 12,
        "background-color": "#cccccc",
      }
    },
    {
      "value": "aut",
      "sourceBlockId": "6a7f1ce2-e0cf-48c2-8f9d-6a796cd45780",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 1,
      "col": 7,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "border": "1px solid #000000",
        "font-size": 12,
        "background-color": "#cccccc",
      }
    }
  ],
  [
    {
      "value": "Asia",
      "sourceBlockId": "15b0c4d5-fbf1-4393-b31b-5756a4ccb695",
      "rowSpan": 4,
      "colSpan": 1,

      "row": 2,
      "col": 0,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "border": "1px solid #000000",
        "font-size": 14,
      }
    },
    {
      "value": "CHN",
      "sourceBlockId": "c2ebc12f-bc87-4add-b0e7-009379705ab5",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 2,
      "col": 1,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "border": "1px solid #000000",
        "font-size": 12,
      }
    },
    {
      "value": "105",
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 2,
      "col": 2,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9"
      }
    },
    {
      "value": "110",
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 2,
      "col": 3,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9"
      }
    },
    {
      "value": "120",
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 2,
      "col": 4,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9"
      }
    },
    {
      "value": "125",
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 2,
      "col": 5,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9"
      }
    },
    {
      "value": "131",
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 2,
      "col": 6,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9"
      }
    },
    {
      "value": "150",
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 2,
      "col": 7,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9"
      }
    }
  ],
  [
    {
      "value": "JPN",
      "sourceBlockId": "c2ebc12f-bc87-4add-b0e7-009379705ab5",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 3,
      "col": 1,
      "unfoldbutton": true,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "border": "1px solid #000000",
        "font-size": 12,
        "background-color": "#cccccc",
      }
    },
    {
      "value": "60",
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 3,
      "col": 2,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "background-color": "#cccccc",
      }
    },
    {
      "value": "80",
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 3,
      "col": 3,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "background-color": "#cccccc",
      }
    },
    {
      "value": "82",
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 3,
      "col": 4,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "background-color": "#cccccc",
      }
    },
    {
      "value": "92",
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 3,
      "col": 5,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "background-color": "#cccccc",
      }
    },
    {
      "value": "95",
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 3,
      "col": 6,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "background-color": "#cccccc",
      }
    },
    {
      "value": "110",
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 3,
      "col": 7,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "background-color": "#cccccc",
      }
    }
  ],
  [
    {
      "value": "GBR",
      "sourceBlockId": "c2ebc12f-bc87-4add-b0e7-009379705ab5",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 4,
      "col": 1,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "border": "1px solid #000000",
        "font-size": 12,
      }
    },
    {
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 4,
      "col": 2,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9"
      }
    },
    {
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 4,
      "col": 3,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9"
      }
    },
    {
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 4,
      "col": 4,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9"
      }
    },
    {
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 4,
      "col": 5,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9"
      }
    },
    {
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 4,
      "col": 6,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9"
      }
    },
    {
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 4,
      "col": 7,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9"
      }
    }
  ],
  [
    {
      "value": "FRA",
      "sourceBlockId": "c2ebc12f-bc87-4add-b0e7-009379705ab5",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 5,
      "col": 1,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "border": "1px solid #000000",
        "font-size": 12,
        "background-color": "#cccccc",
      }
    },
    {
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 5,
      "col": 2,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "background-color": "#cccccc",
      }
    },
    {
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 5,
      "col": 3,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "background-color": "#cccccc",
      }
    },
    {
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 5,
      "col": 4,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "background-color": "#cccccc",
      }
    },
    {
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 5,
      "col": 5,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "background-color": "#cccccc",
      }
    },
    {
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 5,
      "col": 6,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "background-color": "#cccccc",
      }
    },
    {
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 5,
      "col": 7,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "background-color": "#cccccc",
      }
    }
  ],
  [
    {
      "value": "Europe",
      "sourceBlockId": "15b0c4d5-fbf1-4393-b31b-5756a4ccb695",
      "rowSpan": 4,
      "colSpan": 1,

      "row": 6,
      "col": 0,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "border": "1px solid #000000",
        "font-size": 14,
      }
    },
    {
      "value": "CHN",
      "sourceBlockId": "c2ebc12f-bc87-4add-b0e7-009379705ab5",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 6,
      "col": 1,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "border": "1px solid #000000",
        "font-size": 12,
      }
    },
    {
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 6,
      "col": 2,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9"
      }
    },
    {
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 6,
      "col": 3,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9"
      }
    },
    {
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 6,
      "col": 4,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9"
      }
    },
    {
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 6,
      "col": 5,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9"
      }
    },
    {
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 6,
      "col": 6,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9"
      }
    },
    {
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 6,
      "col": 7,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9"
      }
    }
  ],
  [
    {
      "value": "JPN",
      "sourceBlockId": "c2ebc12f-bc87-4add-b0e7-009379705ab5",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 7,
      "col": 1,
      "unfoldbutton": true,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "border": "1px solid #000000",
        "font-size": 12,
        "background-color": "#cccccc",
      }
    },
    {
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 7,
      "col": 2,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "background-color": "#cccccc",
      }
    },
    {
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 7,
      "col": 3,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "background-color": "#cccccc",
      }
    },
    {
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 7,
      "col": 4,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "background-color": "#cccccc",
      }
    },
    {
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 7,
      "col": 5,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "background-color": "#cccccc",
      }
    },
    {
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 7,
      "col": 6,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "background-color": "#cccccc",
      }
    },
    {
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 7,
      "col": 7,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "background-color": "#cccccc",
      }
    }
  ],
  [
    {
      "value": "GBR",
      "sourceBlockId": "c2ebc12f-bc87-4add-b0e7-009379705ab5",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 8,
      "col": 1,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "border": "1px solid #000000",
        "font-size": 12,
      }
    },
    {
      "value": "80",
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 8,
      "col": 2,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9"
      }
    },
    {
      "value": "92",
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 8,
      "col": 3,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9"
      }
    },
    {
      "value": "95",
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 8,
      "col": 4,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9"
      }
    },
    {
      "value": "104",
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 8,
      "col": 5,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9"
      }
    },
    {
      "value": "112",
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 8,
      "col": 6,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9"
      }
    },
    {
      "value": "136",
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 8,
      "col": 7,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9"
      }
    }
  ],
  [
    {
      "value": "FRA",
      "sourceBlockId": "c2ebc12f-bc87-4add-b0e7-009379705ab5",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 9,
      "col": 1,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "border": "1px solid #000000",
        "font-size": 12,
        "background-color": "#cccccc",
      }
    },
    {
      "value": "59",
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 9,
      "col": 2,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "background-color": "#cccccc",
      }
    },
    {
      "value": "63",
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 9,
      "col": 3,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "background-color": "#cccccc",
      }
    },
    {
      "value": "72",
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 9,
      "col": 4,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "background-color": "#cccccc",
      }
    },
    {
      "value": "79",
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 9,
      "col": 5,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "background-color": "#cccccc",
      }
    },
    {
      "value": "86",
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 9,
      "col": 6,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "background-color": "#cccccc",
      }
    },
    {
      "value": "90",
      "sourceBlockId": "316924ac-2e61-41bd-8999-7ac7ef6addd6",
      "rowSpan": 1,
      "colSpan": 1,

      "row": 9,
      "col": 7,
      "unfoldbutton": false,
      "indent": 0,
      "style": {
        "font-family": "Inter-Regular-9",
        "background-color": "#cccccc",
      }
    }
  ]
]