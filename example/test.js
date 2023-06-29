const tableshop = require("../dist/tableshop");
let data = {
  name: "crime",
  values: [
    { state: "Alabama", year: 2004, crime: 4029.3 },
    { state: "Alabama", year: 2005, crime: 3900 },
    { state: "Alaska", crime: 3370.9, year: 2004 },
    { state: "Alaska", crime: 3615, year: 2005 },
  ],
}

let spec = {
  rowHeader: [{
    attr: {
      name: "state",
      type: "categorical",
      values: ["Alabama", "Alaska"]
    },
    children: [{
      attr: {
        name: "year",
        type: "categorical",
        values: [2004, 2005]
      }
    }]
  }]
}

tableshop.transform({data, spec})