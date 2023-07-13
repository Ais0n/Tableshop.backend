import { channel } from "diagnostics_channel";
import {
  Spec, SourceTable, SingleTable,
  AttrInfoUnit, AttrInfo,
  Key, BorderStyle, FontStyle, Border,
  HeaderBlock, CellBlock, HeaderChannel, CellChannel, StyleClass,
  CROSS_TABLE, ROW_TABLE, COLUM_TABLE, 
  interCell
} from "./types";

const header_fill = (attrInfo: AttrInfo, header?: HeaderChannel): void => {
  if(header !== undefined) {
    for(let hb of header) {
      hb.entityMerge = hb.entityMerge ?? false
      hb.gridMerge = hb.gridMerge ?? true
      hb.expand = hb.expand ?? false 
      hb.facet = hb.facet ?? 1
      hb.blankLine = false 
      hb.style = "TODO"
      if(hb.function !== undefined) {
        hb.values = ["Function(Sum)"]
        continue
      }
      let attr = attrInfo.find((obj) => {
        return obj.name == hb.attrName
      })!
      hb.values = hb.values ?? attr.values
      header_fill(attrInfo, hb.children)
    }
  }
}

// init spec default value
const spec_init = (task: Spec): void => {
  let { rowHeader, columnHeader, cell, styles, attrInfo } = task.spec
  // make sure the header can not be both undefined
  if(rowHeader===undefined && columnHeader===undefined) {
    throw new Error("RowHeader and ColumnHeader can not be both undefined!")
  } else {
    for(let header of [rowHeader, columnHeader]) {
      header_fill(attrInfo, header)
    }
    for(let c of cell) {
      c.style = "TODO2"
    }
    if(styles !== undefined) {
      for(let s of styles) {
        s.indent = '\t'
      }
    }
  }
}

// compute dimension(depth) of rowHeader/columnHeader
const calc_depth = (channel?: HeaderChannel): number => {
  if(!channel || channel.length == 0) return 0;
  let depth = 1;
  for(let hb of channel) {
    if (hb.children) {
      let d:number = calc_depth(hb.children);
      depth = (d+1 > depth) ? d+1 : depth;
    }
  }
  return depth;
}

// compute value counts(size) of rowHeader/columnHeader
const calc_size = (channel?: HeaderChannel, entityFlag: boolean = false): number => {
  if (!channel || channel.length == 0) return 0
  let size = 0
  for(let hb of channel) {
    if(entityFlag) {
      size += hb.values!.length
      for(let _ of hb.values!) {
        size += calc_size(hb.children, entityFlag)
      }
    } else {
      let s = hb.children ? calc_size(hb.children) : 1
      size += s * (hb.values!.length)
    }
  }
  return size
}

// TODO: fix structure judge
const get_structure_type = (channel?: HeaderChannel) => { 
  if (!channel || channel.length == 0) throw new Error("Header can not be undefined")
  let hb: HeaderBlock = channel[0]
  return {
    entityMerge: hb.entityMerge,
    gridMerge : hb.gridMerge,
    expand: hb.expand,
    facet: hb.facet 
  }
}

// generate intermediate row table
const gen_inter_row_table = (interRowTable, rowHeader, width: number, depth: number, outerX: number, bias: number = 0): number => {
  if(rowHeader === undefined) return 1
  let innerX: number = 0
  let flag = get_structure_type(rowHeader)
  for(let rh of rowHeader) {
    for(let i:number=0; i<rh.values.length; i++) {
      let iterCount: number
      if(flag.entityMerge) {
        iterCount = gen_inter_row_table(interRowTable, rh.children, width, depth, outerX+innerX+1, bias)
      } else {
        iterCount = gen_inter_row_table(interRowTable, rh.children, width, depth+1, outerX+innerX, bias)
      }
      if(innerX+outerX+iterCount > width) {
        console.log(innerX, outerX, iterCount);
        throw new Error("Over rowHeader width!")
      }
      if(flag.entityMerge) {
        interRowTable[innerX+outerX+bias][depth] = {
          value: rh.values[i],
          source: rh.attrName ?? rh.function,
          rowSpan: 1, colSpan: 1,
          isUsed: false,
          style: rh.style
        }
      } else if(!flag.gridMerge) {
        interRowTable[innerX+outerX+bias][depth] = {
          value: rh.values[i],
          source: rh.attrName ?? rh.function,
          rowSpan: 1, colSpan: 1,
          isUsed: false,
          style: rh.style
        }
      } else {
        for(let j:number=0; j<iterCount; j++) {
          interRowTable[innerX+outerX+j+bias][depth] = {
            value: rh.values[i],
            source: rh.attrName ?? rh.function,
            rowSpan: iterCount, colSpan: 1,
            isUsed: false,
            style: rh.style
          }
        }
      }
      innerX += iterCount
    }
  }
  return innerX + (flag.entityMerge ? 1 : 0) 
}

const gen_inter_row_table_entityMerge = (interRowTable, rowHeader, width: number, outerX: number, bias: number = 0): number => {
  if(rowHeader === undefined) return 1
  let innerX: number = 0
  for(let rh of rowHeader) {
    for(let i:number=0; i<rh.values.length; i++) {
      let iterCount = gen_inter_row_table_entityMerge(interRowTable, rh.children, width, outerX+innerX+1, bias)
      if(innerX+outerX+iterCount > width) {
        console.log(innerX, outerX, iterCount);
        throw new Error("Over rowHeader width!")
      }
      interRowTable[innerX+outerX+bias][0] = {
        value: rh.values[i],
        source: rh.attrName ?? rh.function,
        rowSpan: 1, colSpan: 1,
        isUsed: false,
        style: rh.style
      }
      innerX += iterCount
    }
  }
  return innerX+1
}

// generate intermediate column table
const gen_inter_column_table = (interColumnTable, columnHeader, width: number, 
  depth: number, outerY: number, bias: number = 0): number => {
  if(columnHeader === undefined) return 1
  let innerY: number = 0
  for(let ch of columnHeader) {
    for(let i: number =0; i<ch.values.length; i++) {
      let iterCount = gen_inter_column_table(interColumnTable, ch.children, width, depth+1, outerY+innerY, bias)
      if(innerY+outerY+iterCount > width) {
        console.log('Error', innerY, outerY, iterCount);
        throw new Error("Over columnHeader width!")
      }
      for(let j: number =0; j<iterCount; j++) {
        interColumnTable[depth][innerY+outerY+j+bias] = {
          value: ch.values[i],
          source: ch.attrName ?? ch.function,
          rowSpan: 1, colSpan: iterCount,
          isUsed: false,
          style: ch.style
        }
      }
      innerY += iterCount
    }
  }
  return innerY
}

const gen_inter_cross_table = (interCrossTable, rowHeader, columnHeader, rowWidth: number, 
  rowDepth: number, colWidth: number, colDepth: number) => {
  gen_inter_row_table(interCrossTable, rowHeader, rowWidth, 0, 0, colDepth)
  gen_inter_column_table(interCrossTable, columnHeader, colWidth, 0, 0, rowDepth)
}

const table_process = (tbClass:string, {rowHeader, columnHeader, cell}) => {
  let interTable, processTable: interCell[][] = []
  let rowDepth = calc_depth(rowHeader);
  let colDepth = calc_depth(columnHeader);
  let rowSize = calc_size(rowHeader);
  let colSize = calc_size(columnHeader);

  if(tbClass == ROW_TABLE) {
    let flag = get_structure_type(rowHeader)
    if(flag.entityMerge) { 
      rowSize = calc_size(rowHeader, true)
      rowDepth = 1
    } 
    interTable = Array.from({length: rowSize}, () => new Array(rowDepth).fill({}))
    gen_inter_row_table(interTable, rowHeader, rowSize, 0, 0)
    console.log('@@@', interTable);
    for(let i=0; i<rowSize; i++) {
      processTable[i] = []
      for(let j=0; j<rowDepth; j++) {
        let tmp = interTable[i][j]
        if(tmp.isUsed || tmp.value===undefined) continue 
        processTable[i].push({
          value: tmp.value, source: tmp.source,
          rowSpan: tmp.rowSpan, colSpan: tmp.colSpan,
          style: tmp.style
        })
        for(let k=0; k<tmp.rowSpan; k++) {
          interTable[i+k][j].isUsed = true
        }
      }
    }
    console.log('XXX', processTable);
  } else if(tbClass == COLUM_TABLE) {
    interTable = Array.from({length: colDepth}, () => new Array(colSize).fill({}))
    gen_inter_column_table(interTable, columnHeader, colSize, 0, 0)
    console.log('@@', interTable);
  } else {
    interTable = Array.from({length: rowSize+colDepth}, () => new Array(rowDepth+colSize).fill({}))
    gen_inter_cross_table(interTable, rowHeader, columnHeader, rowSize, rowDepth, colSize, colDepth)
    console.log('@', interTable);
  }

  console.log(rowDepth, colDepth, rowSize, colSize);
}

const transform = (task: Spec) => {
  let { data, spec } = task;
  spec_init({data, spec})
  let { rowHeader, columnHeader, cell, styles, attrInfo } = spec
  
  // check table class
  let tableClass: string = ""
  if(rowHeader !== undefined) {
    if(columnHeader !== undefined) tableClass = CROSS_TABLE
    else tableClass = ROW_TABLE
  } else {
    tableClass = COLUM_TABLE
  }


  table_process(tableClass, {rowHeader, columnHeader, cell})
}

export {spec_init, transform}