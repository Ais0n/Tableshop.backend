import {
  Spec, SourceTable, SingleTable,
  AttrInfoUnit, AttrInfo, DataType,
  Key, KEY_ALPHABETIC, KEY_ROMAN, KEY_NUMERICAL, Pattern, Position,
  BorderStyle, FontStyle, Border,
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
      hb.blankLine = hb.blankLine ?? false 
      if(hb.key && Object.keys(hb.key).length === 0) hb.key = undefined
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

const calc_overall_key_layer = (channel?: HeaderChannel, entityFlag = false, tableClass = ROW_TABLE): number => {
  if (!channel || channel.length == 0) return 0
  let layerCount = 0, d1 = 0, d2 = 0
  for(let hb of channel) {
    if(hb.key && hb.key.position!==Position.EMBEDDED) {
      if(tableClass === ROW_TABLE) {
        if(hb.key.position === Position.LEFT) d1 = 1
        else if(hb.key.position === Position.RIGHT) d2 = 1
      } else if(tableClass === COLUM_TABLE) {
        if(hb.key.position === Position.TOP) d1 = 1
        else if(hb.key.position === Position.BOTTOM) d2 = 1
      }
    }
    let tmp = calc_overall_key_layer(hb.children, entityFlag, tableClass)
    if(entityFlag) tmp = (d1+d2 < tmp) ? tmp : d1 + d2
    layerCount = (layerCount < tmp) ? tmp : layerCount
  }
  return layerCount + (entityFlag ? 0 : d1+d2)
}

const calc_current_key_layer = (channel: HeaderChannel, tableClass: string) => {
  let beforeLayer = 0, afterLayer = 0
  if(tableClass === ROW_TABLE) {
    for(let hb of channel) {
      if(hb.key && hb.key.position === Position.LEFT) beforeLayer = 1
      if(hb.key && hb.key.position === Position.RIGHT) afterLayer = 1
    }    
  } else if(tableClass === COLUM_TABLE) {
    for(let hb of channel) {
      if(hb.key && hb.key.position === Position.TOP) beforeLayer = 1
      if(hb.key && hb.key.position === Position.BOTTOM) afterLayer = 1
    }
  }
  let beforeBias = beforeLayer, afterBias = afterLayer
  return [beforeLayer+afterLayer, beforeBias, afterBias]
}

const calc_each_key_layer = (channel?: HeaderChannel, layersBias: any = [], depth = 0, entityFlag = false, tableClass = ROW_TABLE) => {
  if (!channel || channel.length == 0) return 
  let [_, leftBias, rightBias] = calc_current_key_layer(channel, tableClass), lyb
  if(entityFlag) {
    if(layersBias.length === 0) layersBias[0] = leftBias, layersBias[1] = rightBias
    else {
      layersBias[0] = layersBias[0]<leftBias ? leftBias : layersBias[0]
      layersBias[1] = layersBias[1]<rightBias ? rightBias : layersBias[1]
    }
  } else {
    if(layersBias[depth] === undefined) layersBias[depth] = [leftBias, rightBias]
    else {
      layersBias[depth][0] = layersBias[depth][0]<leftBias ? leftBias : layersBias[depth][0]
      layersBias[depth][1] = layersBias[depth][1]<rightBias ? rightBias : layersBias[depth][1]
    }
  }
  for(let hb of channel) {
    calc_each_key_layer(hb.children, layersBias, depth+1, entityFlag, tableClass)
  }
}

// TODO: fix structure judge
const get_structure_type = (channel?: HeaderChannel) => { 
  if (!channel || channel.length == 0) throw new Error("Header can not be undefined")
  let hb0: HeaderBlock = channel[0], facetList: number[][] = Array.from({length:2}, () => new Array())
  let blankList: boolean[] = new Array()
  for(let hb of channel) {
    if(hb.values!.length % hb.facet! !== 0) throw new Error("Facet can not be divided exactly")
    facetList[0].push(hb.facet!)
    facetList[1].push(hb.values!.length / hb.facet!)
    blankList.push(hb.blankLine!)
  }
  return {
    entityMerge: hb0.entityMerge,
    gridMerge : hb0.gridMerge,
    expand: hb0.expand,
    facet: facetList,
    blankLine: blankList
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

const get_key = (key: Key, level: number, preKey: string) => {
  if(!key) return ''
  let nowKey = ''
  if(key.pattern === Pattern.ROMAN) {
    nowKey = KEY_ROMAN[level]
  } else if(key.pattern === Pattern.NUMERICAL) {
    nowKey = KEY_NUMERICAL[level]
  } else if(key.pattern === Pattern.ALPHABETIC) {
    nowKey = KEY_ALPHABETIC[level]
  }
  return (key.isInherited && preKey!=='') ? [preKey, nowKey].join('.') : nowKey
}

// Aggregate Function
// TODO: add more function
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
const gen_inter_row_table = (interRowTable, rowHeader, extra, width: number, depth: number, 
  outerX: number, bias = 0, isRoot = true, preKey = '', keyBias = 0): number => {
  if(rowHeader === undefined) return 1
  let innerX = 0, rhId = -1
  let leftBias = 0, rightBias = 0
  if(extra.entityMerge) {
    let [lb, rb] = extra.layersBias
    leftBias = lb, rightBias = rb
  } else {
    let [lb, rb] = extra.layersBias[depth]
    leftBias = lb, rightBias = rb
  }
  let currentKeyLayer = leftBias + rightBias
  for(let rh of rowHeader) {
    let isLeaf = rh.children ? false : true
    let source = rh.attrName ?? rh.function
    let headerDepth = depth + keyBias + leftBias, keyDepth = headerDepth
    let isKeyEmbedded = false
    if(rh.key && rh.key.position === Position.LEFT) keyDepth = headerDepth - 1
    if(rh.key && rh.key.position === Position.RIGHT) keyDepth = headerDepth + 1
    if(rh.key && rh.key.position === Position.EMBEDDED) isKeyEmbedded = true
    rhId++
    for(let i=0; i<rh.values.length; i++) {
      let iterCount: number, key = rh.key ? get_key(rh.key, i, preKey) : ''
      let headValue = isKeyEmbedded ? key+ ' ' + rh.values[i] : rh.values[i]
      let keyData = {
        value: key, 
        source: '@KEY',
        rowSpan: 1, colSpan: 1,
        isUsed: false,
        isLeaf,
        isKey: true,
        style: 'KEY STYLE'
      }
      extra.preVal[source] = rh.values[i]
      if(extra.entityMerge) {
        iterCount = gen_inter_row_table(interRowTable, rh.children, extra, width, depth, 
          outerX+innerX+1, bias, false, key, keyBias)
      } else {
        iterCount = gen_inter_row_table(interRowTable, rh.children, extra, width, depth+1, 
          outerX+innerX, bias, false, key, currentKeyLayer+keyBias)
      }
      if(innerX+outerX+iterCount > width) {
        console.log('Error', innerX, outerX, iterCount);
        throw new Error("Over rowHeader width!")
      }
      if(isRoot) {
        extra.rootSpan[rhId].push(iterCount)
        extra.rootIdList[rhId].push(innerX)
      }
      // process entities merged
      if(extra.entityMerge) {
        let flag = !isLeaf && extra.expand, delta = flag ? 1+rightBias : 0
        interRowTable[innerX+outerX+bias][keyDepth] = keyData
        if(flag) interRowTable[innerX+outerX+bias][headerDepth] = {rowSpan: 1, colSpan: extra.depth}
        if(isLeaf && extra.expand) interRowTable[innerX+outerX+bias][headerDepth+1+rightBias] = {isDelete: true}
        interRowTable[innerX+outerX+bias][headerDepth+delta] = {
          value: headValue,
          source,
          rowSpan: 1, colSpan: flag ? 1 : extra.depth,
          isUsed: false, 
          isLeaf,
          isKey: false,
          style: rh.style
        }
      // process cells unmerged
      } else if(!extra.gridMerge) {
        interRowTable[innerX+outerX+bias][keyDepth] = keyData
        interRowTable[innerX+outerX+bias][headerDepth] = {
          value: headValue,
          source,
          rowSpan: 1, colSpan: 1,
          isUsed: false,
          isLeaf,
          isKey: false,
          style: rh.style
        }
      // process cells merged
      } else {
        keyData.rowSpan = iterCount
        for(let j:number=0; j<iterCount; j++) {
          interRowTable[innerX+outerX+j+bias][keyDepth] = keyData
          interRowTable[innerX+outerX+j+bias][headerDepth] = {
            value: headValue,
            source,
            rowSpan: iterCount, colSpan: 1,
            isUsed: false,
            isLeaf,
            isKey: false,
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
const gen_inter_column_table = (interColumnTable, columnHeader, extra, width: number, depth: number, 
  outerY: number, bias = 0, isRoot = true, preKey = '', keyBias = 0): number => {
  if(columnHeader === undefined) return 1
  let innerY: number = 0, chId = -1
  let topBias = 0, bottomBias = 0
  if(extra.entityMerge) {
    let [tb, bb] = extra.layersBias
    topBias = tb, bottomBias = bb
  } else {
    let [tb, bb] = extra.layersBias[depth]
    topBias = tb, bottomBias = bb
  }
  let currentKeyLayer = topBias + bottomBias
  for(let ch of columnHeader) {
    let isLeaf = ch.children ? false : true
    let source = ch.attrName ?? ch.function
    let headerDepth = depth + keyBias + topBias, keyDepth = headerDepth
    let isKeyEmbedded = false
    if(ch.key && ch.key.position === Position.TOP) keyDepth = headerDepth - 1
    if(ch.key && ch.key.position === Position.BOTTOM) keyDepth = headerDepth + 1
    if(ch.key && ch.key.position === Position.EMBEDDED) isKeyEmbedded = true
    chId++
    for(let i: number =0; i<ch.values.length; i++) {
      let iterCount: number, key = ch.key ? get_key(ch.key, i, preKey) : ''
      let headValue = isKeyEmbedded ? key+ ' ' + ch.values[i] : ch.values[i]
      let keyData = {
        value: key, 
        source: '@KEY',
        rowSpan: 1, colSpan: 1,
        isUsed: false,
        isLeaf,
        isKey: true,
        style: 'KEY STYLE'
      }
      extra.preVal[source] = ch.values[i]
      if(extra.entityMerge) {
        iterCount = gen_inter_column_table(interColumnTable, ch.children, extra, width, depth, 
          outerY+innerY+1, bias, false, key, keyBias)
      } else {
        iterCount = gen_inter_column_table(interColumnTable, ch.children, extra, width, depth+1, 
          outerY+innerY, bias, false, key, currentKeyLayer+keyBias)
      }
      if(innerY+outerY+iterCount > width) {
        console.log('Error', innerY, outerY, iterCount);
        throw new Error("Over columnHeader width!")
      }
      if(isRoot) {
        extra.rootSpan[chId].push(iterCount)
        extra.rootIdList[chId].push(innerY)
      }
      // process entities merged
      if(extra.entityMerge) {
        let flag = !isLeaf && extra.expand, delta = flag ? 1+bottomBias : 0
        // console.log('key', keyDepth, innerY+outerY+bias, keyData.value, headerDepth);
        interColumnTable[keyDepth][innerY+outerY+bias] = keyData
        if(flag) interColumnTable[headerDepth][innerY+outerY+bias] = {rowSpan: extra.depth, colSpan: 1}
        if(isLeaf && extra.expand) interColumnTable[headerDepth+1+bottomBias][innerY+outerY+bias] = {isDelete: true}
        interColumnTable[headerDepth+delta][innerY+outerY+bias] = {
          value: headValue,
          source,
          rowSpan: flag ? 1 : extra.depth, colSpan: 1,
          isUsed: false, 
          isLeaf,
          isKey: false,
          style: ch.style
        }
      // process cells unmerged
      } else if(!extra.gridMerge) {
        interColumnTable[keyDepth][innerY+outerY+bias] = keyData
        interColumnTable[headerDepth][innerY+outerY+bias] = {
          value: headValue,
          source,
          rowSpan: 1, colSpan: 1,
          isUsed: false,
          isLeaf,
          isKey: false,
          style: ch.style
        }
      // process cells merged
      } else {
        keyData.colSpan = iterCount
        for(let j:number=0; j<iterCount; j++) {
          interColumnTable[keyDepth][innerY+outerY+j+bias] = keyData
          interColumnTable[headerDepth][innerY+outerY+j+bias] = {
            value: headValue,
            source,
            rowSpan: 1, colSpan: iterCount,
            isUsed: false,
            isLeaf,
            isKey: false,
            style: ch.style
          }
        }
      }
      // process cell unit
      if(isLeaf) {
        for(let c of extra.cell) {
          if(c.rowParentId == ch.blockId) {
            // process function cell
            if(ch.function) {
              if(!agg_type_check(extra.attrInfo, c.attrName)) throw new Error("Function can only be used to numerical>")
              delete extra.preVal[source]
              extra.cellTable[innerY+outerY+bias].push({
                value: aggregate_use(extra.preVal, extra.data, c.attrName, FUNC_SUM),
                source: c.attrName,
                style: c.style
              }) 
            // Process attr cell
            } else {
              extra.cellTable[innerY+outerY+bias].push({
                value: get_cell_val(extra.preVal, extra.data, c.attrName),
                source: c.attrName,
                style: c.style
              }) 
            }
          }
        }
      }
      // for(let j: number =0; j<iterCount; j++) {
      //   interColumnTable[depth][innerY+outerY+j+bias] = {
      //     value: ch.values[i],
      //     source: ch.attrName ?? ch.function,
      //     rowSpan: 1, colSpan: iterCount,
      //     isUsed: false,
      //     style: ch.style
      //   }
      // }
      innerY += iterCount
      delete extra.preVal[source]
    }
  }
  return innerY + (extra.entityMerge ? 1 : 0) 
}

// generate intermediate cross table
const gen_inter_cross_table = (interCrossTable, rowHeader, columnHeader, rowWidth: number, 
  rowDepth: number, colWidth: number, colDepth: number) => {
  gen_inter_row_table(interCrossTable, rowHeader, rowWidth, 0, 0, colDepth)
  gen_inter_column_table(interCrossTable, columnHeader, colWidth, 0, 0, rowDepth)
}

const gen_final_table = (table, tableClass, entityFlag) => {
  let finalTable = new Array(), lenList = new Array(), usedRecord = new Array()
  let maxLength = 0, maxSpan = 0
  for(let i=0; i<table.length; i++) {
    if(maxLength < table[i].length) maxLength = table[i].length
    if(entityFlag) {
      let tmpSpan = 0
      if(tableClass === ROW_TABLE) for(let t of table[i]) tmpSpan += t.colSpan
      else if(tableClass === COLUM_TABLE) for(let t of table[i]) tmpSpan += t.rowSpan
      maxSpan = maxSpan > tmpSpan ? maxSpan : tmpSpan
    }
    lenList.push(table[i].length)
    usedRecord.push(0)
  }
  console.log('len', maxLength, lenList);
  if(tableClass === ROW_TABLE) {
    //TODO
  } else if(tableClass === COLUM_TABLE) {
    for(let i=0; i<maxLength; i++) {
      finalTable[i] = new Array()
      let addCnt = 0
      for(let j=0; j<table.length; j++) {
        if(lenList[j] === 0) {
          finalTable[i].push({
            value: undefined as any,
            source: undefined as any,
            rowSpan: entityFlag ? maxSpan : maxLength,
            colSpan: 1,
            style: undefined as any
          })
          lenList[j]--
          addCnt++
        }
        let tmp = usedRecord[j]
        if(lenList[j]>0 && tmp<lenList[j]) {
          // console.log('kkk', i, j, usedRecord);
          usedRecord[j]++
          if(table[j][tmp].isSkip) continue
          finalTable[i].push(table[j][tmp])
          addCnt++
          if(entityFlag && table[j][tmp].rowSpan>1) {
            for(let k=1; k<table[j][tmp].rowSpan; k++) {
              table[j].splice(tmp+1, 0, {isSkip: true})
              lenList[j]++
            }
          } 
          j += table[j][tmp].colSpan-1
        }
      }
      // console.log('cnt', addCnt);
      if(addCnt === 0) i--
    }
  }
  return finalTable
}

const table_process = (tbClass:string, data, {rowHeader, columnHeader, cell, attrInfo}) => {
  let interTable, processTable: interCell[][] = []
  // let finalTable: interCell[][] = []
  let rowDepth = calc_head_depth(rowHeader);
  let colDepth = calc_head_depth(columnHeader);
  let rowSize = calc_head_size(rowHeader);
  let colSize = calc_head_size(columnHeader);

  if(tbClass == ROW_TABLE) {
    let oldRowDepth = rowDepth
    let flag = get_structure_type(rowHeader)
    if(flag.entityMerge) { 
      rowSize = calc_head_size(rowHeader, true)
      rowDepth = flag.expand ? 2 : 1
    } 
    rowDepth += calc_overall_key_layer(rowHeader, flag.entityMerge, tbClass)
    // console.log('total layer', calc_overall_key_layer(rowHeader, flag.entityMerge));
    let layersBias = []
    calc_each_key_layer(rowHeader, layersBias, 0, flag.entityMerge, tbClass)
    // console.log('layers bias', layersBias);
    let extra = {
      ...flag,
      preVal: {},
      data: data.values,
      cell, 
      cellTable: Array.from({length: rowSize}, () => new Array()),
      attrInfo,
      rootSpan: Array.from({length: rowHeader.length}, () => new Array()),
      rootIdList: Array.from({length: rowHeader.length}, () => new Array()),
      depth: oldRowDepth,
      layersBias
    }
    interTable = Array.from({length: rowSize}, () => new Array(rowDepth)
                  .fill(null).map(_ => ({rowSpan: 1, colSpan: 1})))
    gen_inter_row_table(interTable, rowHeader, extra, rowSize, 0, 0)
    let cell_length = 0
    if(flag.expand) {
      for(let ct of extra.cellTable) cell_length = (cell_length>ct.length) ? cell_length : ct.length
    }
    console.log('@@@', interTable);
    // console.log('hhh', extra.cellTable);
    let maxLength = 0, tmpLength: number[] = []
    for(let i=0; i<rowSize; i++) {
      processTable[i] = [], tmpLength[i] = 0
      for(let j=0; j<rowDepth; j++) {
        let tmp = interTable[i][j]
        // if(tmp.isUsed || tmp.value===undefined) continue 
        if(tmp.isUsed) continue
        // if(flag.entityMerge && flag.expand && tmp.isLeaf && 
        //   processTable[i].length>0 && tmp.value===undefined) continue
        if(flag.entityMerge && flag.expand && tmp.isDelete) continue
        if(flag.entityMerge && flag.expand && tmp.isLeaf===false &&
           tmp.isKey===false) tmp.colSpan = cell_length
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
            colSpan: tmp.colSpan,
            style: tmp.style
          })
        }
        for(let k=0; k<tmp.rowSpan; k++) {
          interTable[i+k][j].isUsed = true
        }
      }
      if(flag.entityMerge) for(let p of processTable[i]) tmpLength[i] += p.colSpan
      else tmpLength[i] = rowDepth
      for(let c of extra.cellTable[i]) {
        tmpLength[i]++
        processTable[i].push({
          value: c.value,
          source: c.source,
          rowSpan: 1,
          colSpan: 1,
          style: c.style
        })
      }
      // console.log('len', tmpLength[i], tmpLength[i]-extra.cellTable[i].length);
      maxLength = maxLength>tmpLength[i] ? maxLength : tmpLength[i]
    }
    // fill empty unit
    for(let i=0; i<processTable.length; i++) {
      let resLength = maxLength - tmpLength[i]
      for(let j=0; j<resLength; j++) processTable[i].push({
          value: undefined as any,
          source: undefined as any,
          rowSpan: 1,
          colSpan: 1,
          style: undefined as any
      })
    }
    // process blank line
    let blankBias = 0
    for(let i=0; i<rowHeader.length; i++) {
      if(flag.blankLine[i]) {
        let rootIdList = extra.rootIdList[i]
        for(let j=0; j<rootIdList.length; j++) {
          processTable.splice(rootIdList[j]+blankBias, 0, [])
          extra.rootSpan[i][j]++
          blankBias++
        }
      }
    }
    // process facet structure
    let finalTable: interCell[][] = [], rootSpan = extra.rootSpan
    let preH = 0, processH = 0
    for(let i=0; i<rowHeader.length; i++) {
      let facetLen = flag.facet[1][i]
      rootSpan[i] = rootSpan[i].reduce((newSpan, _, idx, arr) => {
        if(idx % facetLen === 0) {
          let sum = 0
          for(let i=0; i<facetLen; i++) sum += arr[idx+i]
          newSpan.push(sum)
        }
        return newSpan
      }, [])
      for(let j=0; j<rootSpan[i].length; j++) {
        for(let k=0; k<rootSpan[i][j]; k++) {
          if(!finalTable[preH+k]) finalTable[preH+k] = []
          finalTable[preH+k] = finalTable[preH+k].concat(processTable[processH+k])
        }
        processH += rootSpan[i][j]
      }
      preH += rootSpan[i][0]
    }
    // console.log('XXX', processTable);
    console.log('YYY', finalTable);
  } else if(tbClass == COLUM_TABLE) {
    let oldColDepth = colDepth
    let flag = get_structure_type(columnHeader)
    if(flag.entityMerge) { 
      colSize = calc_head_size(columnHeader, true)
      colDepth = flag.expand ? 2 : 1
    } 
    colDepth += calc_overall_key_layer(columnHeader, flag.entityMerge, tbClass)
    let layersBias = []
    calc_each_key_layer(columnHeader, layersBias, 0, flag.entityMerge, tbClass)
    console.log('total layer', calc_overall_key_layer(columnHeader, flag.entityMerge, tbClass));
    console.log('layers bias', layersBias);
    let extra = {
      ...flag,
      preVal: {},
      data: data.values,
      cell, 
      cellTable: Array.from({length: colSize}, () => new Array()),
      attrInfo,
      rootSpan: Array.from({length: columnHeader.length}, () => new Array()),
      rootIdList: Array.from({length: columnHeader.length}, () => new Array()),
      depth: oldColDepth,
      layersBias
    }
    interTable = Array.from({length: colDepth}, () => new Array(colSize)
                  .fill(null).map(_ => ({rowSpan: 1, colSpan: 1})))
    gen_inter_column_table(interTable, columnHeader, extra, colSize, 0, 0)
    let cell_length = 0
    if(flag.expand) {
      for(let ct of extra.cellTable) cell_length = (cell_length>ct.length) ? cell_length : ct.length
    }
    console.log('@@', interTable);
    let maxLength = 0, tmpLength: number[] = []
    for(let j=0; j<colSize; j++) {
      processTable[j] = [], tmpLength[j] = 0
      for(let i=0; i<colDepth; i++) {
        let tmp = interTable[i][j]
        if(tmp.isUsed) continue
        if(flag.entityMerge && flag.expand && tmp.isDelete) continue
        if(flag.entityMerge && flag.expand && tmp.isLeaf===false &&
           tmp.isKey===false) tmp.rowSpan = cell_length
        if(tmp.value) {
          processTable[j].push({
            value: tmp.value, 
            source: tmp.source,
            rowSpan: tmp.rowSpan, 
            colSpan: tmp.colSpan,
            style: tmp.style
          })
        } else {
          processTable[j].push({
            value: tmp.value, 
            source: tmp.source,
            rowSpan: tmp.rowSpan, 
            colSpan: 1,
            style: tmp.style
          })
        }
        for(let k=0; k<tmp.colSpan; k++) {
          interTable[i][j+k].isUsed = true
        }
      }
      if(flag.entityMerge) for(let p of processTable[j]) tmpLength[j] += p.rowSpan
      else tmpLength[j] = colDepth
      for(let c of extra.cellTable[j]) {
        tmpLength[j]++
        processTable[j].push({
          value: c.value,
          source: c.source,
          rowSpan: 1,
          colSpan: 1,
          style: c.style
        })
      }
      // console.log('len', tmpLength[j], tmpLength[j]-extra.cellTable[j].length);
      maxLength = maxLength>tmpLength[j] ? maxLength : tmpLength[j]
    }
    // fill empty unit
    for(let i=0; i<processTable.length; i++) {
      let resLength = maxLength - tmpLength[i]
      for(let j=0; j<resLength; j++) processTable[i].push({
          value: undefined as any,
          source: undefined as any,
          rowSpan: 1,
          colSpan: 1,
          style: undefined as any
      })
    }
    // process blank line
    let blankBias = 0
    for(let i=0; i<columnHeader.length; i++) {
      if(flag.blankLine[i]) {
        let rootIdList = extra.rootIdList[i]
        for(let j=0; j<rootIdList.length; j++) {
          processTable.splice(rootIdList[j]+blankBias, 0, [])
          extra.rootSpan[i][j]++
          blankBias++
        }
      }
    }
    // process facet structure
    let finalTable: interCell[][] = [], rootSpan = extra.rootSpan
    let preH = 0, processH = 0
    for(let i=0; i<columnHeader.length; i++) {
      let facetLen = flag.facet[1][i]
      rootSpan[i] = rootSpan[i].reduce((newSpan, _, idx, arr) => {
        if(idx % facetLen === 0) {
          let sum = 0
          for(let i=0; i<facetLen; i++) sum += arr[idx+i]
          newSpan.push(sum)
        }
        return newSpan
      }, [])
      for(let j=0; j<rootSpan[i].length; j++) {
        for(let k=0; k<rootSpan[i][j]; k++) {
          if(!finalTable[preH+k]) finalTable[preH+k] = []
          finalTable[preH+k] = finalTable[preH+k].concat(processTable[processH+k])
        }
        processH += rootSpan[i][j]
      }
      preH += rootSpan[i][0]
    }
    // console.log('XX', processTable);
    console.log('YY', finalTable);
    console.log('final',gen_final_table(finalTable, tbClass, flag.entityMerge))
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