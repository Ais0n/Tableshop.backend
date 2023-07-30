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
  let depth = 1
  for(let hb of channel) {
    if (hb.children) {
      let selfDepth = hb.entityMerge ? 0 : 1
      let d:number = calc_head_depth(hb.children);
      depth = (d+selfDepth > depth) ? d+selfDepth : depth;
    }
  }
  return depth;
}

// compute value counts(size) of rowHeader/columnHeader
const calc_head_size = (channel?: HeaderChannel): number => {
  if (!channel || channel.length == 0) return 0
  let size = 0
  for(let hb of channel) {
    if(hb.entityMerge) {
      size += hb.values!.length
      for(let _ of hb.values!) {
        size += calc_head_size(hb.children)
      }
    } else {
      let s = hb.children ? calc_head_size(hb.children) : 1
      size += s * (hb.values!.length)
    } 
  }
  return size
}

// compute each depth span length
const calc_head_span = (channel?: HeaderChannel, headSpan: any = [], depth = 0, d = 0, preLen = 1) => {
  if (!channel || channel.length == 0) return 0
  if(headSpan[depth][d]) headSpan[depth][d] = headSpan[depth][d]<preLen ? preLen : headSpan[depth][d]
  else headSpan[depth][d] = preLen
  for(let hb of channel) {
    let delta = hb.entityMerge ? 0 : 1
    let len = hb.entityMerge ? preLen+1 : 1
    calc_head_span(hb.children, headSpan, depth+delta, d+1, len)
  }
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

const calc_each_key_layer = (channel?: HeaderChannel, layersBias: any = [], depth = 0, tableClass = ROW_TABLE) => {
  if (!channel || channel.length == 0) return 
  let [_, leftBias, rightBias] = calc_current_key_layer(channel, tableClass)
  if(layersBias[depth] === undefined) layersBias[depth] = [leftBias, rightBias]
  else {
    layersBias[depth][0] = layersBias[depth][0]<leftBias ? leftBias : layersBias[depth][0]
    layersBias[depth][1] = layersBias[depth][1]<rightBias ? rightBias : layersBias[depth][1]
  }
  for(let hb of channel) {
    calc_each_key_layer(hb.children, layersBias, depth+(hb.entityMerge ? 0 : 1), tableClass)
  }
}

// TODO: fix structure judge
const get_structure_type = (channel?: HeaderChannel) => { 
  if (!channel || channel.length == 0) throw new Error("Header can not be undefined")
  let hb0: HeaderBlock = channel[0], facetList: number[][] = Array.from({length:2}, () => new Array())
  let blankList: boolean[] = new Array()
  for(let hb of channel) {
    facetList[0].push(hb.facet!)
    facetList[1].push(hb.values!.length / hb.facet!)
    blankList.push(hb.blankLine!)
  }
  return {
    entityMerge: hb0.entityMerge,
    gridMerge : hb0.gridMerge,
    facet: facetList,
    blankLine: blankList
  }
}

const get_block_structure = (block: HeaderBlock) => {

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
  outerX: number, bias = 0, isPreMerge = false, preKey = '', keyBias = 0): number => {
  if(rowHeader === undefined) return 1
  let innerX = 0, rhId = -1
  let leftBias = 0, rightBias = 0
  let [lb, rb] = extra.layersBias[depth]
  leftBias = lb, rightBias = rb
  let currentKeyLayer = leftBias + rightBias
  for(let rh of rowHeader) {
    let isLeaf = rh.children ? false : true
    let sourceBlockId = rh.blockId, source = rh.attrName ?? rh.function
    let headerDepth = depth + keyBias + leftBias, keyDepth = headerDepth
    let isKeyEmbedded = false
    if(rh.key && rh.key.position === Position.LEFT) keyDepth = headerDepth - 1
    if(rh.key && rh.key.position === Position.RIGHT) keyDepth = headerDepth + 1
    if(rh.key && rh.key.position === Position.EMBEDDED) isKeyEmbedded = true
    rhId++
    for(let i=0; i<rh.values.length; i++) {
      let iterCount: number, key = rh.key ? get_key(rh.key, i, preKey) : ''
      let headValue = isKeyEmbedded ? key+ ' ' + rh.values[i] : rh.values[i]
      let span = extra.headSpan[depth]
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
      if(rh.entityMerge) {
        iterCount = gen_inter_row_table(interRowTable, rh.children, extra, width, depth, 
          outerX+innerX+1, bias, rh.entityMerge, key, keyBias)
      } else {
        iterCount = gen_inter_row_table(interRowTable, rh.children, extra, width, depth+1, 
          outerX+innerX, bias, rh.entityMerge, key, currentKeyLayer+keyBias)
      }
      if(innerX+outerX+iterCount > width) {
        console.log('Error', innerX, outerX, iterCount);
        throw new Error("Over rowHeader width!")
      }
      // process entities merged
      if(rh.entityMerge) {
        interRowTable[innerX+outerX+bias][keyDepth] = keyData
        interRowTable[innerX+outerX+bias][headerDepth] = {
          value: headValue,
          source,
          rowSpan: 1, colSpan: span,
          isUsed: false, 
          isLeaf,
          isKey: false,
          style: rh.style
        }
      // process cells unmerged
      } else if(!rh.gridMerge) {
        interRowTable[innerX+outerX+bias][keyDepth] = keyData
        interRowTable[innerX+outerX+bias][headerDepth] = {
          value: headValue,
          source,
          rowSpan: 1, colSpan: span,
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
            rowSpan: iterCount, colSpan: span,
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
  return innerX + (isPreMerge ? 1 : 0) 
}

// generate intermediate column table
const gen_inter_column_table = (interColumnTable, columnHeader, extra, width: number, depth: number, 
  outerY: number, bias = 0, isPreMerge = false, preKey = '', keyBias = 0): number => {
  if(columnHeader === undefined) return 1
  let innerY = 0, chId = -1
  let topBias = 0, bottomBias = 0
  let [tb, bb] = extra.layersBias[depth]
  topBias = tb, bottomBias = bb
  let currentKeyLayer = topBias + bottomBias
  for(let ch of columnHeader) {
    let isLeaf = ch.children ? false : true
    let sourceBlockId = ch.blockId, source = ch.attrName ?? ch.function
    let headerDepth = depth + keyBias + topBias, keyDepth = headerDepth
    let isKeyEmbedded = false
    if(ch.key && ch.key.position === Position.TOP) keyDepth = headerDepth - 1
    if(ch.key && ch.key.position === Position.BOTTOM) keyDepth = headerDepth + 1
    if(ch.key && ch.key.position === Position.EMBEDDED) isKeyEmbedded = true
    chId++
    for(let i=0; i<ch.values.length; i++) {
      let iterCount: number, key = ch.key ? get_key(ch.key, i, preKey) : ''
      let headValue = isKeyEmbedded ? key+ ' ' + ch.values[i] : ch.values[i]
      let span = extra.headSpan[depth]
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
      if(ch.entityMerge) {
        iterCount = gen_inter_column_table(interColumnTable, ch.children, extra, width, depth, 
          outerY+innerY+1, bias, ch.entityMerge, key, keyBias)
      } else {
        iterCount = gen_inter_column_table(interColumnTable, ch.children, extra, width, depth+1, 
          outerY+innerY, bias, ch.entityMerge, key, currentKeyLayer+keyBias)
      }
      if(innerY+outerY+iterCount > width) {
        console.log('Error', innerY, outerY, iterCount);
        throw new Error("Over columnHeader width!")
      }
      // process entities merged
      if(ch.entityMerge) {
        interColumnTable[keyDepth][innerY+outerY+bias] = keyData
        interColumnTable[headerDepth][innerY+outerY+bias] = {
          value: headValue,
          source,
          rowSpan: span, colSpan: 1,
          isUsed: false, 
          isLeaf,
          isKey: false,
          style: ch.style
        }
      // process cells unmerged
      } else if(!ch.gridMerge) {
        interColumnTable[keyDepth][innerY+outerY+bias] = keyData
        interColumnTable[headerDepth][innerY+outerY+bias] = {
          value: headValue,
          source,
          rowSpan: span, colSpan: 1,
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
            rowSpan: span, colSpan: iterCount,
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
          if(c.colParentId == ch.blockId) {
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
      innerY += iterCount
      delete extra.preVal[source]
    }
  }
  return innerY + (isPreMerge ? 1 : 0) 
}

// generate intermediate cross table
const gen_inter_cross_table = (interCrossTable, rowHeader, columnHeader, rowWidth: number, 
  rowDepth: number, colWidth: number, colDepth: number) => {
  gen_inter_row_table(interCrossTable, rowHeader, rowWidth, 0, 0, colDepth)
  gen_inter_column_table(interCrossTable, columnHeader, colWidth, 0, 0, rowDepth)
}

const gen_blank_facet_table = (rawTable, header, info, depth, outerX, 
  bias = 0, isPreMerge = false, keyBias = 0) => {
  if(header === undefined) return [1, info.cellLength, 1, 0]
  let innerX = 0, maxLen = info.cellLength, facetSpan = 0, blankLine = 0
  let [beforeBias, afterBias] = info.layersBias[depth]
  let keyLayer = beforeBias+afterBias
  for(let hd of header) {
    let start = innerX + outerX + bias, subFacetSpan = 0
    for(let i=0; i<hd.values.length; i++) {
      let iterCount = 1, len = info.cellLength, tmpFacetSpan = 1, blank = 0
      let x = innerX + outerX + bias, y = depth + keyBias
      if(hd.entityMerge) {
        [iterCount, len, tmpFacetSpan, blank] = gen_blank_facet_table(rawTable, hd.children, info, depth, outerX+innerX+1, 
          bias, hd.entityMerge, keyBias)
      } else {
        [iterCount, len, tmpFacetSpan, blank] = gen_blank_facet_table(rawTable, hd.children, info, depth+1, outerX+innerX, 
          bias, hd.entityMerge, keyBias+keyLayer)
      }
      
      for(let j=0; j<iterCount; j++) {
        // console.log('xxxxxx',  info.oldTable[x+j][y+beforeBias].value, x+j, y+beforeBias);
        if(rawTable[x+j][y+beforeBias] !== undefined && !hd.entityMerge && hd.gridMerge) {
          if(info.tbClass === ROW_TABLE) {
            if(beforeBias > 0) rawTable[x+j][y].rowSpan = tmpFacetSpan + blank
            rawTable[x+j][y+beforeBias].rowSpan = tmpFacetSpan + blank
            if(afterBias > 0) rawTable[x+j][y+beforeBias+afterBias].rowSpan = tmpFacetSpan + blank
          }
          else if(info.tbClass === COLUM_TABLE) {
            if(beforeBias > 0) rawTable[x+j][y].colSpan = tmpFacetSpan + blank
            rawTable[x+j][y+beforeBias].colSpan = tmpFacetSpan + blank
            if(afterBias > 0) rawTable[x+j][y+beforeBias+afterBias].colSpan = tmpFacetSpan + blank
          }          
        }
        if(rawTable[x+j][y+beforeBias] !== undefined && j===0 && hd.blankLine) {
          if(beforeBias > 0) rawTable[x+j][y].hasBlank = true
          rawTable[x+j][y+beforeBias].hasBlank = true
          if(afterBias > 0) rawTable[x+j][y+beforeBias+afterBias].hasBlank = true
        }
      }
      if(hd.facet > 1) {
        let copyLen = len - y
        let group = i % hd.facet
        // console.log('Bi', group, innerX, hd.facet);
        for(let j=0; j<iterCount; j++) {
          for(let k=0; k<copyLen; k++) {
            let tarX = start + Math.floor(i/hd.facet)*iterCount + j, tarY = y + k + group*copyLen
            rawTable[tarX][tarY] = rawTable[x+j][y+k]
            if(rawTable[x+j][y+k] !== undefined && (tarX !== x+j || tarY !== y+k)) 
              rawTable[x+j][y+k] = {isDelete: true}
            // console.log('Ai', start+Math.floor(i/hd.facet)*iterCount+j, y+k+group*copyLen, x+j, y+k);
          }
        }
        let delta = (hd.facet-1) * copyLen
        len += delta
      }

      innerX += iterCount
      if(maxLen < len) maxLen = len
      subFacetSpan += tmpFacetSpan
    }
    if(hd.facet>1) subFacetSpan = Math.ceil(subFacetSpan / hd.facet)
    facetSpan += subFacetSpan
    if(hd.blankLine) blankLine += Math.ceil(hd.values.length / hd.facet)
  }
  let delta1 = isPreMerge ? 1 : 0, delta2 = isPreMerge?0:1
  return [innerX+delta1, maxLen+delta2, facetSpan+delta1, blankLine]
}

const gen_final_table = (table, tableClass) => {
  let finalTable = new Array()
  let h = 0, oldLen = table.length, maxLength = 0
  let spanList = new Array()
  for(let i=0; i<oldLen; i++) {
    let isDelete = true
    for(let j=0; j<table[h].length; j++) {
      if(table[h][j]===undefined || table[h][j].isDelete) continue
      if(tableClass === ROW_TABLE) spanList[j] = table[h][j].colSpan
      else if(tableClass === COLUM_TABLE) spanList[j] = table[h][j].rowSpan
      isDelete = false
    }
    if(isDelete) table.splice(h, 1)
    else {
      if(table[h].length > maxLength) maxLength = table[h].length
      h++
    }
  }
  // fill each length
  for(let t of table) {
    let resLen = maxLength - t.length, tmp = t.length 
    for(let i=0; i<resLen; i++) {
      if(tableClass === ROW_TABLE) t.push({rowSpan: 1, colSpan: spanList[i+tmp]})
      else if(tableClass === COLUM_TABLE) t.push({rowSpan: spanList[i+tmp], colSpan: 1})
    }
  }
  let locMap = new Array(maxLength).fill(0)
  for(let i=0; i<table.length; i++) {
    let t = table[i], isBlank = false
    if(finalTable[i] === undefined) finalTable[i] = new Array()
    for(let j=0; j<table[i].length; j++) {
      if(table[i][j] === undefined) {
        if(i+1 >= table.length) throw new Error("Final Table: Over Boundary")
        if(isBlank) {
          if(finalTable[locMap[j]] === undefined) finalTable[locMap[j]] = new Array()
          if(tableClass === ROW_TABLE) 
            finalTable[locMap[j]].push({ rowSpan: 1, colSpan: table[i+1][j].colSpan})
          else if(tableClass === COLUM_TABLE) 
            finalTable[locMap[j]].push({ rowSpan: table[i+1][j].rowSpan, colSpan: 1})
          locMap[j]++
        }
        if(tableClass === ROW_TABLE) 
          finalTable[locMap[j]].push({ rowSpan: 1, colSpan: table[i+1][j].colSpan})
        else if(tableClass === COLUM_TABLE) 
          finalTable[locMap[j]].push({ rowSpan: table[i+1][j].rowSpan, colSpan: 1})
        // finalTable[locMap[j]].push({rowSpan: 1, colSpan: table[i+1][j].colSpan})
        locMap[j]++
      } else if(!table[i][j].isDelete){
        if(table[i][j].hasBlank) {
          delete table[i][j].hasBlank
          isBlank = true
        }
        if(isBlank) {
          if(finalTable[locMap[j]] === undefined) finalTable[locMap[j]] = new Array()
          if(tableClass === ROW_TABLE) 
            finalTable[locMap[j]].push({ rowSpan: 1, colSpan: table[i][j].colSpan})
          else if(tableClass === COLUM_TABLE) 
            finalTable[locMap[j]].push({ rowSpan: table[i][j].rowSpan, colSpan: 1})
          // finalTable[locMap[j]].push({ rowSpan: 1, colSpan: table[i][j].colSpan})
          locMap[j]++
        }
        if(finalTable[locMap[j]] === undefined) finalTable[locMap[j]] = new Array()
        finalTable[locMap[j]].push(table[i][j])
        if(tableClass === ROW_TABLE)
          locMap[j] += table[i][j].rowSpan
        else if(tableClass === COLUM_TABLE)
          locMap[j] += table[i][j].colSpan
        // locMap[j] += table[i][j].rowSpan
      }
    }
  }
  if(tableClass === COLUM_TABLE) {
    let newFinalTable = new Array()
    let useRecord = new Array(finalTable.length).fill(0)
    for(let i=0; i<maxLength; i++) {
      newFinalTable[i] = new Array()
      for(let j=0; j<finalTable.length; j++) {
        let tmp = useRecord[j]
        newFinalTable[i].push(finalTable[j][tmp])
        useRecord[j]++
        j += finalTable[j][tmp].colSpan - 1
      }
    }
    finalTable = newFinalTable
  }
  return finalTable
}

const table_process = (tbClass:string, data, {rowHeader, columnHeader, cell, attrInfo}) => {
  let interTable, processTable = new Array()
  let finalTable: interCell[][] = []
  let rowDepth = calc_head_depth(rowHeader);
  let colDepth = calc_head_depth(columnHeader);
  let rowSize = calc_head_size(rowHeader);
  let colSize = calc_head_size(columnHeader);

  if(tbClass == ROW_TABLE) {
    let headTmpSpan = Array.from({length: rowDepth}, () => ({}))
    let headSpan = new Array(rowDepth).fill(1)
    calc_head_span(rowHeader, headTmpSpan)
    console.log('head tmp span', headTmpSpan);
    for(let i=0; i<headTmpSpan.length; i++) {
      let hts = headTmpSpan[i]
      for(let k in hts) if(hts[k] > headSpan[i]) headSpan[i] = hts[k]
    }
    console.log('head span', headSpan);
    let layersBias = [], totalLayer = 0
    calc_each_key_layer(rowHeader, layersBias, 0, tbClass)
    for(let lb of layersBias) totalLayer += lb[0] + lb[1]
    rowDepth += totalLayer
    console.log('layers bias', layersBias);
    console.log('total layer', totalLayer);
    let headKeySpan = new Array()
    for(let i=0; i<headSpan.length; i++) {
      if(layersBias[i][0] > 0) headKeySpan.push(1)
      headKeySpan.push(headSpan[i])
      if(layersBias[i][1] > 0) headKeySpan.push(1)
    }
    console.log("head key span", headKeySpan);
    let extra = {
      preVal: {},
      data: data.values,
      cell, 
      cellTable: Array.from({length: rowSize}, () => new Array()),
      attrInfo,
      layersBias,
      headSpan
    }
    interTable = Array.from({length: rowSize}, () => new Array(rowDepth)
                  .fill(null).map(_ => ({rowSpan: 1, colSpan: 1})))
    gen_inter_row_table(interTable, rowHeader, extra, rowSize, 0, 0)
    // console.log('@@@', interTable);
    let maxLength = 0, tmpLength: number[] = []
    // console.log('cell', extra.cellTable);
    for(let i=0; i<rowSize; i++) {
      processTable[i] = [], tmpLength[i] = 0
      for(let j=0; j<rowDepth; j++) {
        let tmp = interTable[i][j] 
        if(tmp.isUsed) {
          processTable[i].push({isDelete: true})
          continue
        }
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
            colSpan: headKeySpan[j],
            style: tmp.style
          })
        }
        for(let k=0; k<tmp.rowSpan; k++) {
          interTable[i+k][j].isUsed = true
        }
      }
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
    // process blankLine and facet structure
    let info = {
      layersBias,
      cellLength: maxLength + rowDepth,
      tbClass,
      // oldTable: JSON.parse(JSON.stringify(processTable))
    }
    gen_blank_facet_table(processTable, rowHeader, info, 0, 0)
    console.log('new', processTable);
    finalTable =  gen_final_table(processTable, tbClass)
    console.log('final', finalTable);

  } else if(tbClass == COLUM_TABLE) {
    let headTmpSpan = Array.from({length: colDepth}, () => ({}))
    let headSpan = new Array(colDepth).fill(1)
    calc_head_span(columnHeader, headTmpSpan)
    console.log('head tmp span', headTmpSpan);
    for(let i=0; i<headTmpSpan.length; i++) {
      let hts = headTmpSpan[i]
      for(let k in hts) if(hts[k] > headSpan[i]) headSpan[i] = hts[k]
    }
    console.log('head span', headSpan);
    let layersBias = [], totalLayer = 0
    calc_each_key_layer(columnHeader, layersBias, 0, tbClass)
    for(let lb of layersBias) totalLayer += lb[0] + lb[1]
    colDepth += totalLayer
    console.log('layers bias', layersBias);
    console.log('total layer', totalLayer);
    let headKeySpan = new Array()
    for(let i=0; i<headSpan.length; i++) {
      if(layersBias[i][0] > 0) headKeySpan.push(1)
      headKeySpan.push(headSpan[i])
      if(layersBias[i][1] > 0) headKeySpan.push(1)
    }
    console.log("head key span", headKeySpan);
    let extra = {
      preVal: {},
      data: data.values,
      cell, 
      cellTable: Array.from({length: colSize}, () => new Array()),
      attrInfo,
      rootSpan: Array.from({length: columnHeader.length}, () => new Array()),
      rootIdList: Array.from({length: columnHeader.length}, () => new Array()),
      layersBias,
      headSpan
    }
    interTable = Array.from({length: colDepth}, () => new Array(colSize)
                  .fill(null).map(_ => ({rowSpan: 1, colSpan: 1})))
    gen_inter_column_table(interTable, columnHeader, extra, colSize, 0, 0)
    console.log('@@', interTable);
    let maxLength = 0, tmpLength: number[] = []
    // console.log('cell', extra.cellTable);
    for(let j=0; j<colSize; j++) {
      processTable[j] = [], tmpLength[j] = 0
      for(let i=0; i<colDepth; i++) {
        let tmp = interTable[i][j]
        if(tmp.isUsed) {
          processTable[j].push({isDelete: true})
          continue
        }
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
            rowSpan: headKeySpan[i], 
            colSpan: 1,
            style: tmp.style
          })
        }
        for(let k=0; k<tmp.colSpan; k++) {
          interTable[i][j+k].isUsed = true
        }
      }
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
    // process blankLine and facet structure
    let info = {
      layersBias,
      cellLength: maxLength + colDepth,
      tbClass,
      // oldTable: JSON.parse(JSON.stringify(processTable))
    }
    gen_blank_facet_table(processTable, columnHeader, info, 0, 0)
    console.log('new', processTable);
    finalTable =  gen_final_table(processTable, tbClass)
    console.log('final', finalTable);
  } else {
  //   let oldRowDepth = rowDepth, oldColDepth = colDepth
  //   let rowFlag = get_structure_type(rowHeader), colFlag = get_structure_type(columnHeader)
    
  //   // Row Header Process
  //   if(rowFlag.entityMerge) {
  //     rowSize = calc_head_size(rowHeader, true)
  //     // rowDepth = rowFlag.expand ? 2 : 1
  //   }
  //   let rowLayersBias = [], rowTotalLayer = 0
  //   calc_each_key_layer(rowHeader, rowLayersBias, 0, rowFlag.entityMerge, ROW_TABLE)
  //   if(rowFlag.entityMerge) {
  //     rowTotalLayer = rowLayersBias[0] + rowLayersBias[1]
  //   } else {
  //     for(let lb of rowLayersBias) rowTotalLayer += lb[0] + lb[1]
  //   }
  //   rowDepth += rowTotalLayer
  //   let rowExtra = {
  //     ...rowFlag,
  //     data: data.values,
  //     cell, 
  //     cellTable: Array.from({length: rowSize}, () => new Array()),
  //     attrInfo,
  //     rootSpan: Array.from({length: rowHeader.length}, () => new Array()),
  //     rootIdList: Array.from({length: rowHeader.length}, () => new Array()),
  //     depth: oldRowDepth,
  //     layersBias: rowLayersBias
  //   }

  //   // Column Header Process
  //   if(colFlag.entityMerge) { 
  //     colSize = calc_head_size(columnHeader, true)
  //     // colDepth = colFlag.expand ? 2 : 1
  //   } 
  //   let colLayersBias = [], colTotalLayer = 0
  //   calc_each_key_layer(columnHeader, colLayersBias, 0, colFlag.entityMerge, COLUM_TABLE)
  //   if(colFlag.entityMerge) {
  //     colTotalLayer = colLayersBias[0] + colLayersBias[1]
  //   } else {
  //     for(let lb of colLayersBias) colTotalLayer += lb[0] + lb[1]
  //   }
  //   colDepth += colTotalLayer
    
  //   interTable = Array.from({length: rowSize+colDepth}, () => new Array(rowDepth+colSize)
  //                 .fill(null).map(_ => ({rowSpan: 1, colSpan: 1})))
  //   gen_inter_row_table(interTable, rowHeader, rowExtra, rowSize, 0, 0, colDepth)

  //   // gen_inter_cross_table(interTable, rowHeader, columnHeader, rowSize, rowDepth, colSize, colDepth)
  //   console.log('@', interTable);
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