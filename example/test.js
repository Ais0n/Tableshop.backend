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

let data2 = {
  name: "crime",
  values: [
    { state: "Alabama", year: 2004, sex: 'Boy' , age: 10, crime: 4029.3 },
    { state: "Alabama", year: 2005, sex: 'Boy' , age: 10, crime: 3900 },
    { state: "Alaska" , year: 2004, sex: 'Boy' , age: 10, crime: 3370.9 },
    { state: "Alaska" , year: 2005, sex: 'Boy' , age: 10, crime: 3615 },
    { state: "Alabama", year: 2004, sex: 'Girl', age: 10, crime: 4029.3 },
    { state: "Alabama", year: 2005, sex: 'Girl', age: 10, crime: 3900 },
    { state: "Alaska" , year: 2004, sex: 'Girl', age: 10, crime: 3370.9 },
    { state: "Alaska" , year: 2005, sex: 'Girl', age: 10, crime: 3615 },
    { state: "Alabama", year: 2004, sex: 'Boy' , age: 2, crime: 4029.3 },
    { state: "Alabama", year: 2005, sex: 'Boy' , age: 2, crime: 3900 },
    { state: "Alaska" , year: 2004, sex: 'Boy' , age: 2, crime: 3370.9 },
    { state: "Alaska" , year: 2005, sex: 'Boy' , age: 2, crime: 3615 },
    { state: "Alabama", year: 2004, sex: 'Girl', age: 2, crime: 4029.3 },
    { state: "Alabama", year: 2005, sex: 'Girl', age: 2, crime: 3900 },
    { state: "Alaska" , year: 2004, sex: 'Girl', age: 2, crime: 3370.9 },
    { state: "Alaska" , year: 2005, sex: 'Girl', age: 2, crime: 3615 },
  ],
}

let spec = {
  rowHeader: [{
    attrName: "state",
    blockId: "1111",
    entityMerge: false,
    gridMerge: true,
    // blankLine: true,
    key: {
      position: "left",
      // position: "embedded",
      pattern: "1",
      isInherited: true
    },
    children: [{
      attrName: "year",
			blockId: "2222",
      entityMerge: true,
      facet: 1,
      blankLine: true,
      key: {
        // position: "left",
        position: "embedded",
        pattern: "I",
        isInherited: true
      },
      children: [{
        attrName: "year",
        blockId: "3333",
        entityMerge: true,
        facet: 1,
        key: {
          // position: "left",
          position: "embedded",
          pattern: "1",
          isInherited: true
        },
      }]
    }, {
			function: "sum",
			blockId: "4444",
      entityMerge: false,
      key: {
        // position: "left",
        position: "embedded",
        pattern: "A",
        isInherited: true
      },
		}],
  }],
  columnHeader: undefined,
  cell: [{
		attrName: "crime",
		rowParentId: "3333",
		colParentId: undefined,
	}, {
		attrName: "crime",
		rowParentId: "3333",
		colParentId: undefined,
	},{
		attrName: "crime",
		rowParentId: "4444",
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
    gridMerge : true,
    entityMerge: false,
    expand: true,
    facet: 2,
    key: {
      position: "left",
      // position: "embedded",
      pattern: "1",
      isInherited: true
    },
    blankLine: true,
    children: [{
      attrName: "year",
			blockId: "1beaf109-f1f2-4cb3-acce-bca9b18275aa",
      key: {
        // position: "left",
      position: "embedded",
        pattern: "I",
        isInherited: true
      },
    }, {
			function: "sum",
      key: {
        position: "right",
        // position: "embedded",
        pattern: "I",
        isInherited: true
      },
			blockId: "186f15a3-7e92-466d-9f8c-ef60bbe96768",
		}],
  }, {
    attrName: "test",
    blockId: "3dca2581-a3c5-1fa2-edac-abc1c51723da",
    entityMerge: false,
    facet: 1,
    key: {
      // position: "right",
      position: "embedded",
      pattern: "A",
      isInherited: false
    },
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

let spec5 = {
  rowHeader: undefined,
  columnHeader: [{
    attrName: "state",
    blockId: "3dca2581-a3c5-1fa2-edac-abc1c43123da",
    gridMerge : true,
    entityMerge: true,
    expand: true,
    facet: 2,
    key: {
      position: "top",
      // position: "embedded",
      pattern: "1",
      isInherited: true
    },
    blankLine: true,
    children: [{
      attrName: "year",
			blockId: "1beaf109-f1f2-4cb3-acce-bca9b18275aa",
      key: {
        // position: "top",
      position: "embedded",
        pattern: "I",
        isInherited: true
      },
    }, {
			function: "sum",
      key: {
        position: "bottom",
        // position: "embedded",
        pattern: "I",
        isInherited: true
      },
			blockId: "186f15a3-7e92-466d-9f8c-ef60bbe96768",
		}],
  }, {
    attrName: "test",
    blockId: "3dca2581-a3c5-1fa2-edac-abc1c51723da",
    entityMerge: false,
    facet: 1,
    key: {
      // position: "bottom",
      position: "embedded",
      pattern: "A",
      isInherited: false
    },
  }],
  cell: [{
		attrName: "crime",
		rowParentId: undefined,
		colParentId: "1beaf109-f1f2-4cb3-acce-bca9b18275aa",
	}, {
		attrName: "crime",
		rowParentId: undefined,
		colParentId: "186f15a3-7e92-466d-9f8c-ef60bbe96768",
	},{
		attrName: "crime",
		rowParentId: undefined,
		colParentId: "1beaf109-f1f2-4cb3-acce-bca9b18275aa",
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

let spec6 = {
  rowHeader: [{
    attrName: "state",
    blockId: "3dca2581-a3c5-1fa2-edac-abc1c43123da",
    gridMerge : true,
    entityMerge: false,
    expand: true,
    facet: 2,
    key: {
      position: "left",
      // position: "embedded",
      pattern: "1",
      isInherited: true
    },
    blankLine: true,
    children: [{
      attrName: "year",
			blockId: "1beaf109-f1f2-4cb3-acce-bca9b18275aa",
      key: {
        // position: "left",
      position: "embedded",
        pattern: "I",
        isInherited: true
      },
    }, {
			function: "sum",
      key: {
        position: "right",
        // position: "embedded",
        pattern: "I",
        isInherited: true
      },
			blockId: "186f15a3-7e92-466d-9f8c-ef60bbe96768",
		}],
  }, {
    attrName: "test",
    blockId: "3dca2581-a3c5-1fa2-edac-abc1c51723da",
    entityMerge: false,
    facet: 1,
    key: {
      // position: "right",
      position: "embedded",
      pattern: "A",
      isInherited: false
    },
  }],
  columnHeader: [{
    attrName: "state",
    blockId: "3dca2581-a3c5-1fa2-edac-abc1c43123da",
    gridMerge : true,
    entityMerge: true,
    expand: true,
    facet: 2,
    key: {
      position: "top",
      // position: "embedded",
      pattern: "1",
      isInherited: true
    },
    blankLine: true,
    children: [{
      attrName: "year",
			blockId: "1beaf109-f1f2-4cb3-acce-bca9b18275aa",
      key: {
        // position: "top",
      position: "embedded",
        pattern: "I",
        isInherited: true
      },
    }, {
			function: "sum",
      key: {
        position: "bottom",
        // position: "embedded",
        pattern: "I",
        isInherited: true
      },
			blockId: "186f15a3-7e92-466d-9f8c-ef60bbe96768",
		}],
  }, {
    attrName: "test",
    blockId: "3dca2581-a3c5-1fa2-edac-abc1c51723da",
    entityMerge: false,
    facet: 1,
    key: {
      // position: "bottom",
      position: "embedded",
      pattern: "A",
      isInherited: false
    },
  }],
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

tableShop.utils.transform({data, spec:spec})
// tableShop.utils.transform({data:data2, spec:spec6})