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

export const numToString = (num: number): string => {
  let str = "";
  while (num > 0) {
    let rem = num % 26;
    let quo = Math.floor(num / 26);
    if (rem == 0) {
      rem = 26;
      quo--;
    }
    str = String.fromCharCode(rem + 64) + str;
    num = quo;
  }
  return str;
}

export const stringToNum = (str) => {
  let num = 0;
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    let val = char.charCodeAt() - 64;
    num = num * 26 + val;
  }
  return num;
}

export const genBid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}