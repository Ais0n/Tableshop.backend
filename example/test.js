const tableShop = require("../dist/tableShop");
let data = {
  name: "crime",
  values: [
    { state: "Alabama", year: 2004, crime: 4029.3 },
    { state: "Alabama", year: 2005, crime: 3900 },
    { state: "Alaska", year: 2004, crime: 3370.9 },
    { state: "Alaska", year: 2005, crime: 3615 },
  ],
}

let spec = {
  rowHeader: [{
    attrName: "state",
    blockId: "3dca2581-a3c5-1fa2-edac-abc1c43123da",
    entityMerge: false,
    children: [{
      attrName: "year",
			blockId: "1beaf109-f1f2-4cb3-acce-bca9b18275aa",
      entityMerge: false,
    }, {
			function: "sum",
			blockId: "186f15a3-7e92-466d-9f8c-ef60bbe96768",
      entityMerge: false,
		}],
  }, {
    attrName: "test",
    blockId: "3dca2581-a3c5-1fa2-edac-abc1c51723da",
    entityMerge: false,
  }],
  columnHeader: undefined,
  cell: [{
		attrName: "crime",
		rowParentId: "...",
		colParentId: "...",
	}],
  attrInfo: [{
		name: "state",
		dataType: "categorical",
		values: ["Alabama", "Alaska"],
	}, {
		name: "year",
		dataType: "categorical",
		values: [2004, 2005]
	}, {
		name: "crime",
		dataType: "numerical",
		values: [4029.3, 3900, 3370.9, 3615]
	}, {
    name: "test",
		dataType: "categorical",
		values: ["KKK"],
  }],
  styles: undefined
}

let spec2 = {
  rowHeader: undefined,
  columnHeader: [{
    attrName: "state",
    blockId: "3dca2581-a3c5-1fa2-edac-abc1c43123da",
    children: [{
      attrName: "year",
			blockId: "1beaf109-f1f2-4cb3-acce-bca9b18275aa",
    }, {
			function: "sum",
			blockId: "186f15a3-7e92-466d-9f8c-ef60bbe96768",
		}],
  }, {
    attrName: "test",
    blockId: "3dca2581-a3c5-1fa2-edac-abc1c51723da"
  }],
  cell: [{
		attrName: "crime",
		rowParentId: "...",
		colParentId: "...",
	}],
  attrInfo: [{
		name: "state",
		dataType: "categorical",
		values: ["Alabama", "Alaska"],
	}, {
		name: "year",
		dataType: "categorical",
		values: [2004, 2005]
	}, {
		name: "crime",
		dataType: "numerical",
		values: [4029.3, 3900, 3370.9, 3615]
	}, {
    name: "test",
		dataType: "categorical",
		values: ["KKK"],
  }],
  styles: undefined
}

let spec3 = {
  rowHeader: [{
    attrName: "state",
    blockId: "3dca2581-a3c5-1fa2-edac-abc1c43123da",
    children: [{
      attrName: "year",
			blockId: "1beaf109-f1f2-4cb3-acce-bca9b18275aa",
    }, {
			function: "sum",
			blockId: "186f15a3-7e92-466d-9f8c-ef60bbe96768",
		}],
  }],
  columnHeader: [{
    attrName: "test",
    blockId: "3dca2581-a3c5-1fa2-edac-abc1c51723da"
  }],
  cell: [{
		attrName: "crime",
		rowParentId: "...",
		colParentId: "...",
	}],
  attrInfo: [{
		name: "state",
		dataType: "categorical",
		values: ["Alabama", "Alaska"],
	}, {
		name: "year",
		dataType: "categorical",
		values: [2004, 2005]
	}, {
		name: "crime",
		dataType: "numerical",
		values: [4029.3, 3900, 3370.9, 3615]
	}, {
    name: "test",
		dataType: "categorical",
		values: ["KKK", "ttt"],
  }],
  styles: undefined
}

let spec4 = {
  rowHeader: [{
    attrName: "state",
    blockId: "3dca2581-a3c5-1fa2-edac-abc1c43123da",
    entityMerge: false,
    expand: false,
    facet: 1,
    blankLine: true,
    children: [{
      attrName: "year",
			blockId: "1beaf109-f1f2-4cb3-acce-bca9b18275aa",
      // entityMerge: true,
    }, {
			function: "sum",
			blockId: "186f15a3-7e92-466d-9f8c-ef60bbe96768",
      // entityMerge: true,
		}],
  }, {
    attrName: "test",
    blockId: "3dca2581-a3c5-1fa2-edac-abc1c51723da",
    entityMerge: false,
    facet: 1,
  }],
  columnHeader: undefined,
  cell: [{
		attrName: "crime",
		rowParentId: "1beaf109-f1f2-4cb3-acce-bca9b18275aa",
		colParentId: undefined,
	}, {
		attrName: "crime",
		rowParentId: "186f15a3-7e92-466d-9f8c-ef60bbe96768",
		colParentId: undefined,
	},{
		attrName: "crime",
		rowParentId: "1beaf109-f1f2-4cb3-acce-bca9b18275aa",
		colParentId: undefined,
	}],
  attrInfo: [{
		name: "state",
		dataType: "categorical",
		values: ["Alabama", "Alaska"],
	}, {
		name: "year",
		dataType: "categorical",
		values: [2004, 2005]
	}, {
		name: "crime",
		dataType: "numerical",
		values: [4029.3, 3900, 3370.9, 3615]
	}, {
    name: "test",
		dataType: "categorical",
		values: ["KKK"],
  }],
  styles: undefined
}

// tableShop.utils.transform({data, spec})
tableShop.utils.transform({data, spec:spec4})