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
  rowHeader: [{
    attrName: "continent",
    blockId: "11111",
    values: ["Asia"],
    entityMerge: false,
    blankLine: true,
    key: {
      position: "left",
      // position: "embedded",
      pattern: "1",
      isInherited: true
    },
    children: [{
      attrName: "country",
      blockId: "22222",
      values: ["CHN", "JPN"],
      entityMerge: false,
    }]
    // }, {
    //   function: "sum",
    //   blockId: "33333",
    //   entityMerge: false,
    // }],
  },{
    attrName: "continent",
    blockId: "11111",
    values: ["Europe"],
    entityMerge: false,
    blankLine: true,
    children: [{
      attrName: "country",
      blockId: "22222",
      values: ["GBR", "FRA"],
      entityMerge: false,
    }]
  }],
  columnHeader: [{
    attrName: "year",
    blockId: "44444",
    entityMerge: false,
    // blankLine: true,
    key: {
      position: "top",
      // position: "embedded",
      pattern: "I",
      isInherited: true
    },
    children: [{
      attrName: "season",
      blockId: "55555",
      entityMerge: false,
    }],
  }],
  cell: [{
    attrName: "sales",
    rowParentId: "22222",
    colParentId: "55555",
    blockId: "66666",
  }, 
  // {
  //   attrName: "crime",
  //   rowParentId: "33333",
  //   colParentId: "55555",
  // }
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
  styles: undefined
}

// tableShop.utils.transform({data, spec})
tableShop.utils.transform({ data, spec: spec })

// 参考输出
let output = [
  [
    { // 最左上角的empty block
      "rowspan": 2,
      "colspan": 2,
      "style": undefined,
    },
    {
      "value": "2019",
      "sourceBlockId": "44444",
      "rowspan": 1,
      "colspan": 2,
      "style": undefined,
    },
    {
      "value": "2020",
      "sourceBlockId": "44444",
      "rowspan": 1,
      "colspan": 2,
      "style": undefined,
    },
    {
      "value": "2021",
      "sourceBlockId": "44444",
      "rowspan": 1,
      "colspan": 2,
      "style": undefined,
    }
  ], 
  [
    {
      "value": "spr",
      "sourceBlockId": "55555",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": "aut",
      "sourceBlockId": "55555",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": "spr",
      "sourceBlockId": "55555",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": "aut",
      "sourceBlockId": "55555",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": "spr",
      "sourceBlockId": "55555",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": "aut",
      "sourceBlockId": "55555",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
  ],
  [
    {
      "value": "Asia",
      "sourceBlockId": "11111",
      "rowspan": 2,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": "CHN",
      "sourceBlockId": "22222",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": 105,
      "sourceBlockId": "66666",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": 110,
      "sourceBlockId": "66666",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": 120,
      "sourceBlockId": "66666",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": 125,
      "sourceBlockId": "66666",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": 131,
      "sourceBlockId": "66666",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": 150,
      "sourceBlockId": "66666",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
  ],
  [
    {
      "value": "JPN",
      "sourceBlockId": "22222",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": 60,
      "sourceBlockId": "66666",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": 80,
      "sourceBlockId": "66666",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": 82,
      "sourceBlockId": "66666",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": 92,
      "sourceBlockId": "66666",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": 95,
      "sourceBlockId": "66666",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": 110,
      "sourceBlockId": "66666",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
  ],
  [
    {
      "value": "Europe",
      "sourceBlockId": "11111",
      "rowspan": 2,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": "GBR",
      "sourceBlockId": "22222",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": 80,
      "sourceBlockId": "66666",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": 92,
      "sourceBlockId": "66666",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": 95,
      "sourceBlockId": "66666",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": 104,
      "sourceBlockId": "66666",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": 112,
      "sourceBlockId": "66666",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": 136,
      "sourceBlockId": "66666",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
  ],
  [
    {
      "value": "FRA",
      "sourceBlockId": "22222",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": 59,
      "sourceBlockId": "66666",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": 63,
      "sourceBlockId": "66666",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": 72,
      "sourceBlockId": "66666",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": 79,
      "sourceBlockId": "66666",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": 86,
      "sourceBlockId": "66666",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
    {
      "value": 90,
      "sourceBlockId": "66666",
      "rowspan": 1,
      "colspan": 1,
      "style": undefined,
    },
  ],
]