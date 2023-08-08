import { parse } from "path";

export const shallowCopy = (origin) => {
  let target = {};
  for (let i in origin) {
    target[i] = origin[i];
  }
  return target;
}

export const transposeTable = (table) => {
  let maxLength = 0, maxId = -1
  for(let i=0; i<table.length; i++) {
    if(maxLength < table[i].length) {
      maxLength = table[i].length
      maxId = i
    }
  }

  return table[maxId].map((_, i) => {
    return table.map(row => row[i])
  })
}

export const deepAssign = (target, source) => {
  for (var key in source) {
    if(typeof source[key] !== "object") {
      target[key] = source[key];
    } else {
      if(Array.isArray(source[key])) {
        target[key] = JSON.parse(JSON.stringify(source[key]))
      } else {
        if(!target.hasOwnProperty(key)) target[key] = {}
        deepAssign(target[key], source[key]);
      }
    }
  }
  return target;
}