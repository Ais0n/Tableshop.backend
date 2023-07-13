import {
  Spec, SourceTable, SingleTable,
  AttrInfoUnit, AttrInfo, DataType,
  Key, BorderStyle, FontStyle, Border,
  HeaderBlock, CellBlock, HeaderChannel, CellChannel, StyleClass,
  FUNC_SUM,
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
        if(hb.function === FUNC_SUM) hb.values = [FUNC_SUM]
        else hb.values = ["Function(Unknown)"]
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
const calc_head_depth = (channel?: HeaderChannel): number => {
  if(!channel || channel.length == 0) return 0;
  let depth = 1;
  for(let hb of channel) {
    if (hb.children) {
      let d:number = calc_head_depth(hb.children);
      depth = (d+1 > depth) ? d+1 : depth;
    }
  }
  return depth;
}

// compute value counts(size) of rowHeader/columnHeader
const calc_head_size = (channel?: HeaderChannel, entityFlag: boolean = false): number => {
  if (!channel || channel.length == 0) return 0
  let size = 0
  for(let hb of channel) {
    if(entityFlag) {
      size += hb.values!.length
      for(let _ of hb.values!) {
        size += calc_head_size(hb.children, entityFlag)
      }
    } else {
      let s = hb.children ? calc_head_size(hb.children) : 1
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

const get_cell_val = (preVal, data, key) => {
  for(let d of data) {
    let flag = true
    for(let k in preVal) {
      if(d[k] !== preVal[k]) {
        flag = false
        break
      }
    }
    if(flag) return d[key]
  }
  return undefined
}

// Aggregate Function
const aggregate_use = (preVal, data, key, funcName: string = FUNC_SUM) => {
  if(funcName === FUNC_SUM) return aggregate_sum(preVal, data, key)
}

const aggregate_sum = (preVal, data, key) => {
  let ans: number = 0, cnt: number = 0
  for(let d of data) {
    let flag = true
    for(let k in preVal) {
      if(d[k] !== preVal[k]) {
        flag = false
        break
      }
    }
    if(flag) {
      cnt++
      ans += d[key]
    }
  }
  if(cnt === 0) return undefined
  return ans
}

// check cell type which used for agg function
const agg_type_check = (attrInfo: AttrInfo, attrName: string): boolean => {
  let attr = attrInfo.find((obj) => {
    return obj.name == attrName
  })
  if(attr && attr.dataType===DataType.NUMERICAL) return true 
  return false
}

// generate intermediate row table
const gen_inter_row_table = (interRowTable, rowHeader, extra, width: number, depth: number, outerX: number, bias: number = 0): number => {
  if(rowHeader === undefined) return 1
  let innerX: number = 0
  for(let rh of rowHeader) {
    let isLeaf = rh.children ? false : true
    let source = rh.attrName ?? rh.function
    for(let i:number=0; i<rh.values.length; i++) {
      let iterCount: number
      extra.preVal[source] = rh.values[i]
      if(extra.entityMerge) {
        iterCount = gen_inter_row_table(interRowTable, rh.children, extra, width, depth, outerX+innerX+1, bias)
      } else {
        iterCount = gen_inter_row_table(interRowTable, rh.children, extra, width, depth+1, outerX+innerX, bias)
      }
      if(innerX+outerX+iterCount > width) {
        console.log(innerX, outerX, iterCount);
        throw new Error("Over rowHeader width!")
      }
      // process entities merged
      if(extra.entityMerge) {
        let flag = !isLeaf && extra.expand, delta = flag ? 1 : 0
        interRowTable[innerX+outerX+bias][depth+delta] = {
          value: rh.values[i],
          source,
          rowSpan: 1, colSpan: flag ? 1 : extra.rowDepth,
          isUsed: false, 
          isLeaf,
          style: rh.style
        }
      // process cells unmerged
      } else if(!extra.gridMerge) {
        interRowTable[innerX+outerX+bias][depth] = {
          value: rh.values[i],
          source,
          rowSpan: 1, colSpan: 1,
          isUsed: false,
          isLeaf,
          style: rh.style
        }
      // process cells merged
      } else {
        for(let j:number=0; j<iterCount; j++) {
          interRowTable[innerX+outerX+j+bias][depth] = {
            value: rh.values[i],
            source,
            rowSpan: iterCount, colSpan: 1,
            isUsed: false,
            isLeaf,
            style: rh.style
          }
        }
      }
      // process cell unit
      if(isLeaf) {
        for(let c of extra.cell) {
          if(c.rowParentId == rh.blockId) {
            // process function cell
            if(rh.function) {
              if(!agg_type_check(extra.attrInfo, c.attrName)) throw new Error("Function can only be used to numerical>")
              delete extra.preVal[source]
              extra.cellTable[innerX+outerX+bias].push({
                value: aggregate_use(extra.preVal, extra.data, c.attrName, FUNC_SUM),
                source: c.attrName,
                style: c.style
              }) 
            // Process attr cell
            } else {
              extra.cellTable[innerX+outerX+bias].push({
                value: get_cell_val(extra.preVal, extra.data, c.attrName),
                source: c.attrName,
                style: c.style
              }) 
            }
          }
        }
      }
      innerX += iterCount
      delete extra.preVal[source]
    }
  }
  return innerX + (extra.entityMerge ? 1 : 0) 
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

// generate intermediate cross table
const gen_inter_cross_table = (interCrossTable, rowHeader, columnHeader, rowWidth: number, 
  rowDepth: number, colWidth: number, colDepth: number) => {
  gen_inter_row_table(interCrossTable, rowHeader, rowWidth, 0, 0, colDepth)
  gen_inter_column_table(interCrossTable, columnHeader, colWidth, 0, 0, rowDepth)
}

const table_process = (tbClass:string, data, {rowHeader, columnHeader, cell, attrInfo}) => {
  let interTable, processTable: interCell[][] = []
  let rowDepth = calc_head_depth(rowHeader);
  let colDepth = calc_head_depth(columnHeader);
  let rowSize = calc_head_size(rowHeader);
  let colSize = calc_head_size(columnHeader);

  if(tbClass == ROW_TABLE) {
    let flag = get_structure_type(rowHeader)
    if(flag.entityMerge) { 
      rowSize = calc_head_size(rowHeader, true)
      rowDepth = flag.expand ? 2 : 1
    } 
    let extra = {
      ...flag,
      preVal: {},
      data: data.values,
      cell, 
      cellTable: Array.from({length: rowSize}, () => new Array()),
      attrInfo,
      rowDepth,
    }
    interTable = Array.from({length: rowSize}, () => new Array(rowDepth).fill({}))
    gen_inter_row_table(interTable, rowHeader, extra, rowSize, 0, 0)
    let cell_length = 0
    if(flag.expand) {
      for(let ct of extra.cellTable) cell_length = (cell_length>ct.length) ? cell_length : ct.length
    }
    console.log('@@@', interTable);
    console.log('hhh', extra.cellTable);
    for(let i=0; i<rowSize; i++) {
      processTable[i] = []
      for(let j=0; j<rowDepth; j++) {
        let tmp = interTable[i][j]
        // if(tmp.isUsed || tmp.value===undefined) continue 
        if(tmp.isUsed) continue
        if(flag.expand && processTable[i].length>0 && tmp.value===undefined) continue
        if(flag.expand && !tmp.isLeaf) tmp.colSpan = cell_length
        if(tmp.value) {
          processTable[i].push({
            value: tmp.value, 
            source: tmp.source,
            rowSpan: tmp.rowSpan, 
            colSpan: tmp.colSpan,
            style: tmp.style
          })
        } else {
          processTable[i].push({
            value: tmp.value, 
            source: tmp.source,
            rowSpan: 1, 
            colSpan: 1,
            style: tmp.style
          })
        }
        for(let k=0; k<tmp.rowSpan; k++) {
          interTable[i+k][j].isUsed = true
        }
      }
      for(let c of extra.cellTable[i]) {
        processTable[i].push({
          value: c.value,
          source: c.source,
          rowSpan: 1,
          colSpan: 1,
          style: c.style
        })
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


  table_process(tableClass, data, {rowHeader, columnHeader, cell, attrInfo})
}

export {spec_init, transform}