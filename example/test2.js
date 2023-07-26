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
    entityMerge: false,
    children: [{
      attrName: "country",
			blockId: "22222",
      entityMerge: false,
    }, {
			function: "sum",
			blockId: "33333",
      entityMerge: false,
		}],
  }],
  columnHeader: [{
    attrName: "year",
    blockId: "44444",
    entityMerge: false,
    children: [{
      attrName: "season",
			blockId: "55555",
      entityMerge: false,
    }],
  }],
  cell: [{
		attrName: "crime",
		rowParentId: "22222",
		colParentId: "55555",
	}, {
		attrName: "crime",
		rowParentId: "33333",
		colParentId: "55555",
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
    name: "crime",
		dataType: "numerical",
		values: [105, 110, 120, 125, 131, 150, 60, 80, 82, 92, 95, 110, 80, 92, 95, 104, 112, 136, 59, 63, 72, 79, 86, 90],
  },],
  styles: undefined
}

// tableShop.utils.transform({data, spec})
tableShop.utils.transform({data, spec:spec})