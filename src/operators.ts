import {
  Spec, SourceTable, SingleTable,
  AttrInfoUnit, AttrInfo, DataType,
  Key, KEY_ALPHABETIC, KEY_ROMAN, KEY_NUMERICAL, Pattern, Position,
  GridMerge,
  BorderPosition, BorderStyle, Border, FontUnderscore, FontWeight, Font, Background,
  HeaderBlock, CellBlock, HeaderChannel, CellChannel, StyleClass,
  FUNC_SUM,
  CROSS_TABLE, ROW_TABLE, COLUM_TABLE, 
  interCell, BlockType,
  SelectorType
} from "./types";
import { deepAssign, genBid } from "./utils";
import { read, writeFileXLSX, utils } from "xlsx";
// const util = require('util');

// init style selector
const style_selector_fill =  (bId, loc, styles: StyleClass, idDict) => {
  if(!bId) bId = "@__undefined"
  let res = {}
  for(let sel in styles) {
    if(sel === SelectorType.TABLE) {
      res = deepAssign(res, styles[sel])

    } else if(sel === SelectorType.HEADER) {
      if(idDict.rowDict[bId] || idDict.colDict[bId]) res = deepAssign(res, styles[sel])
      else if(bId==="@__undefined" && loc.x===1 && loc.y===1) res = deepAssign(res, styles[sel])

    } else if(sel === SelectorType.ROW_HEADER) {
      if(idDict.rowDict[bId]) res = deepAssign(res, styles[sel])
      else if(bId==="@__undefined" && loc.x===1 && loc.y===1) res = deepAssign(res, styles[sel])

    } else if(sel === SelectorType.COL_HEADER) {
      if(idDict.colDict[bId]) res = deepAssign(res, styles[sel])
      else if(bId==="@__undefined" && loc.x===1 && loc.y===1) res = deepAssign(res, styles[sel])

    } else if(sel === SelectorType.CELL) {
      if(idDict.cellDict[bId]) res = deepAssign(res, styles[sel])

    } else if(sel === SelectorType.TITLE) {
      if(bId==="@__undefined" && loc.x===1 && loc.y===1) res = deepAssign(res, styles[sel])

    } else if(sel.startsWith(SelectorType.ROW_H_LEVEL)) {
      let depth = parseInt(sel.slice(3)) - 1
      if(idDict.rowDict[bId] && idDict.rowDict[bId].depth===depth) res = deepAssign(res, styles[sel])

    } else if(sel.startsWith(SelectorType.COL_H_LEVEL)) {
      let depth = parseInt(sel.slice(3)) - 1
      if(idDict.colDict[bId] && idDict.colDict[bId].depth===depth) res = deepAssign(res, styles[sel])

    } else if(sel === SelectorType.SUM_TITLE) {
      if(idDict.rowDict[bId] && idDict.rowDict[bId].function === FUNC_SUM) 
        res = deepAssign(res, styles[sel])
      else if(idDict.colDict[bId] && idDict.colDict[bId].function === FUNC_SUM)
        res = deepAssign(res, styles[sel])

    } else if(sel === SelectorType.SUM_CELL) {
      if(idDict.cellDict[bId]) {
        let rowPId = idDict.cellDict[bId].rowPId, colPId = idDict.cellDict[bId].colPId
        let isSet = false
        if(rowPId && idDict.rowDict[rowPId] && idDict.rowDict[rowPId].function===FUNC_SUM) isSet = true 
        else if(colPId && idDict.colDict[colPId] && idDict.colDict[colPId].function===FUNC_SUM) isSet = true 
        if(isSet) res = deepAssign(res, styles[sel])
      }
      
    } else if(sel === SelectorType.ROW_ODD) {
      if(loc.x%2!==0) res = deepAssign(res, styles[sel])

    } else if(sel === SelectorType.COL_ODD) {
      if(loc.y%2!==0) res = deepAssign(res, styles[sel])

    } else if(sel === SelectorType.ROW_EVEN) {
      if(loc.x%2===0) res = deepAssign(res, styles[sel])

    } else if(sel === SelectorType.COL_EVEN) {
      if(loc.y%2===0) res = deepAssign(res, styles[sel])

    } else if(sel.startsWith(SelectorType.ROW_LEVEL)) {
      let level = parseInt(sel.slice(2))
      if(loc.x===level) res = deepAssign(res, styles[sel])

    } else if(sel.startsWith(SelectorType.COL_LEVEL)) {
      let level = parseInt(sel.slice(2))
      if(loc.y===level) res = deepAssign(res, styles[sel])

    }
  }
  return res 
}


// init header info
const header_fill = (attrInfo: AttrInfo, styles: StyleClass, header?: HeaderChannel): void => {
  if(header !== undefined) {
    for(let hb of header) {
      hb.entityMerge = hb.entityMerge ?? false
      hb.gridMerge = hb.gridMerge ?? GridMerge.Merged
      hb.facet = hb.facet ?? 1
      hb.facetMerge = hb.facetMerge ?? true 
      hb.facetEnd = hb.facetEnd ?? false
      hb.blankLine = hb.blankLine ?? false 
      if(hb.title === "") hb.title = hb.attrName
      if(hb.key && Object.keys(hb.key).length === 0) hb.key = undefined
      let headerStyle = hb.className ? deepAssign({}, styles[hb.className]) : {}
      if(!hb.style || Object.keys(hb.style).length===0) hb.style = {}
      hb.style = deepAssign(headerStyle, hb.style)
      if(hb.function !== undefined) {
        if(hb.function === FUNC_SUM) hb.values = [FUNC_SUM]
        else hb.values = ["Function(Unknown)"]
        continue
      }
      let attr = attrInfo.find((obj) => {
        return obj.name === hb.attrName
      })
      if(attr !== undefined) hb.values = hb.values ?? attr.values
      // if(hb.children && hb.children.length===0) hb.children = undefined
      header_fill(attrInfo, styles, hb.children)
    }
  }
}

// init spec default value
const spec_init = (task: Spec): void => {
  let { data, spec } = task;
  if(spec.rowHeader === undefined) spec.rowHeader = new Array()
  if(spec.columnHeader === undefined) spec.columnHeader = new Array()
  if(spec.cell === undefined) spec.cell = new Array()
  let { rowHeader, columnHeader, cell, styles, attrInfo } = spec
  // make sure the header can not be both undefined
  if((rowHeader===undefined || rowHeader.length===0) && 
            (columnHeader===undefined || columnHeader.length===0)) {
    throw new Error("RowHeader and ColumnHeader can not be both undefined!")
  } else {
    if(!styles || Object.keys(styles).length===0) spec.styles = {}
    for(let header of [rowHeader, columnHeader]) {
      header_fill(attrInfo, styles, header)
    }
    for(let c of cell) {
      let cellStyle = c.className ? deepAssign({}, styles[c.className]) : {}
      if(!c.style || Object.keys(c.style).length===0) c.style = {}
      c.style = deepAssign(cellStyle, c.style)
    }
  }
}

// process style to css format
const style_process = (style: StyleClass) => {
  let output = {}
  let { border, font, background, indent} = style
  // Border
  if(border) {
    let positionKey = "", bdFormat = new Array()
    let bdWidth = border.width, bdStyle = border.style, bdColor = border.color
    switch (border.position) {
      case BorderPosition.TOP:
        positionKey = "border-top"
        break;
      case BorderPosition.BOTTOM:
        positionKey = "border-bottom"
        break;
      case BorderPosition.LEFT:
        positionKey = "border-left"
        break;
      case BorderPosition.RIGHT:
        positionKey = "border-right"
        break;  
      default:
        positionKey = "border"
        break;
    }
    if(bdWidth) bdFormat.push(bdWidth + "px")
    if(bdStyle) {
      if(bdStyle===BorderStyle.DOUBLE || bdStyle===BorderStyle.SINGLE || 
        bdStyle===BorderStyle.NONE) bdFormat.push(bdStyle)
    }
    if(bdColor) bdFormat.push(bdColor)
    output[positionKey] = bdFormat.join(" ")
  }
  // Font
  if(font) {
    if(font.color) output['color'] = font.color
    if(font.size) output['font-size'] = font.size + "px"
    if(font.weight) {
      if(font.weight === FontWeight.REGULAR) output['font-family'] = "Inter-Regular-9"
      else if(font.weight === FontWeight.BOLD) output['font-family'] = "Inter-Bold-4"
      else if(font.weight === FontWeight.SEMIBOLD) output['font-family'] = "Inter-Medium-8"
    }
    if(font.underscore === FontUnderscore.Single) output['text-decoration'] = "underline"
    else if(font.underscore === FontUnderscore.Double) output['text-decoration'] = "underline double"
  }
  // Background
  if(background) {
    if(background.color) output['background-color'] = background.color
  }
  // Indent
  if(indent) output['padding-left'] = indent + "px"

  return output
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
      let s = (hb.children && hb.children.length>0) ? calc_head_size(hb.children) : 1
      size += s * (hb.values!.length)
    } 
  }
  return size
}

// compute valid value counts(size) of rowHeader/columnHeader
const calc_head_size2 = (channel?: HeaderChannel, data = {}, preVal = {}): number => {
  if (!channel || channel.length == 0) return 0
  let size = 0
  for(let hb of channel) {
    for(let v of hb.values!) {
      if(hb.attrName) preVal[hb.attrName] = v
      let isValid = get_cell_head_is_valid(preVal, data)
      if(isValid) {
        if(hb.entityMerge) size += calc_head_size2(hb.children, data, preVal) + 1
        else {
          let s = calc_head_size2(hb.children, data, preVal)
          size += s===0 ? 1 : s
        }
      }
      // console.log('calc_size', preVal, size); 
      if(hb.attrName) delete preVal[hb.attrName]
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

// Do not use again
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

// find whether header has facet structure
const get_header_is_facet = (channel?: HeaderChannel) => {
  if (!channel || channel.length == 0) return false
  for(let hb of channel) {
    if(hb.facet! > 1) return true
    let res = get_header_is_facet(hb.children)
    if(res) return true
  }
  return false
}

// get all header dict info
const get_header_id_dict = (channel?: HeaderChannel, title?, depth = 0, preFEnd = false) => {
  if (!channel || channel.length == 0) return {}
  let res = {}
  for(let hb of channel) {
    let facetEnd = preFEnd ? true : hb.facetEnd
    let info = get_header_id_dict(hb.children, title, depth+1, facetEnd)
    info[hb.blockId] = {
      attrName: hb.attrName,
      function: hb.function,
      hasBlank: hb.blankLine, 
      gridMerge: hb.gridMerge,
      locList: new Array(),
      depth,
      facetMerge: hb.facetMerge,
      facetEnd,
      key: hb.key,
    } 
    if(title[depth] === undefined) title[depth] = new Array()
    if(hb.title !== undefined) title[depth].push(hb.title)
    res = deepAssign(res, info)
  }
  return res
}

// get all cell dict info
const get_cell_id_dict = (channel?: CellChannel) => {
  if (!channel || channel.length == 0) return {}
  let res = {}
  for(let c of channel) {
    res[c.blockId] = {
      rowPId: c.rowParentId,
      colPId: c.colParentId,
    }
  }
  return res
}

const get_cell_head_is_valid = (preVal, data) => {
  for(let d of data) {
    let flag = true
    for(let k in preVal) {
      if(d[k] !== preVal[k]) {
        flag = false
        break
      }
    }
    if(flag) return true
  }
  return false
}

const get_cell_val = (preVal, data, key) => {
  let res = new Array()
  for(let d of data) {
    let flag = true
    for(let k in preVal) {
      if(d[k] !== preVal[k]) {
        flag = false
        break
      }
    }
    // if(flag) return d[key]
    if(flag) res.push(d[key])
  }
  if(res.length === 0) return undefined
  else return res.join(',')
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
  if(rowHeader === undefined || rowHeader.length === 0) return 1
  let innerX = 0
  let leftBias = 0, rightBias = 0
  let [lb, rb] = extra.layersBias[depth]
  leftBias = lb, rightBias = rb
  let currentKeyLayer = leftBias + rightBias
  for(let rh of rowHeader) {
    let isLeaf = (rh.children && rh.children.length) ? false : true
    let sourceBlockId = rh.blockId, source = rh.attrName ?? rh.function
    let headerDepth = depth + keyBias + leftBias, keyDepth = headerDepth
    // let headerStyle = style_process(rh.style)
    let headerStyle = rh.style
    let headType = rh.function ? BlockType.FUNCTION : BlockType.ROW
    let isKeyEmbedded = false
    if(rh.key && rh.key.position === Position.LEFT) keyDepth = headerDepth - 1
    if(rh.key && rh.key.position === Position.RIGHT) keyDepth = headerDepth + 1
    if(rh.key && rh.key.position === Position.EMBEDDED) isKeyEmbedded = true
    let pos = 0
    for(let i=0; i<rh.values.length; i++) {
      let iterCount: number, key = rh.key ? get_key(rh.key, pos, preKey) : ''
      let headValue = isKeyEmbedded ? key+ ' ' + rh.values[i] : rh.values[i]
      let span = extra.headSpan[depth]
      let keyData = {
        value: key, 
        source: '@__KEY',
        sourceBlockId,
        rowSpan: 1, colSpan: 1,
        isUsed: false,
        isLeaf,
        isKey: true,
        type: BlockType.KEY,
        style: headerStyle,
      }
      if(source) extra.preVal[source] = rh.values[i]
      if(!get_cell_head_is_valid(extra.preVal, extra.data) && rh.attrName) {
        delete extra.preVal[source]
        continue
      }
      if(rh.entityMerge) {
        iterCount = gen_inter_row_table(interRowTable, rh.children, extra, width, depth, 
          outerX+innerX+1, bias, rh.entityMerge, key, keyBias)
      } else {
        iterCount = gen_inter_row_table(interRowTable, rh.children, extra, width, depth+1, 
          outerX+innerX, bias, rh.entityMerge, key, currentKeyLayer+keyBias)
      }
      if(innerX+outerX+iterCount > width) {
        console.log('Error', innerX, outerX, iterCount, width);
        throw new Error("Over rowHeader width!")
      }
      // process entities merged
      if(rh.entityMerge) {
        interRowTable[innerX+outerX+bias][keyDepth] = keyData
        interRowTable[innerX+outerX+bias][headerDepth] = {
          value: headValue,
          source,
          sourceBlockId,
          rowSpan: 1, colSpan: span,
          isUsed: false, 
          isLeaf,
          isKey: false,
          type: headType,
          style: headerStyle
        }
      // process as cells merged 
      } else {
        let rs = iterCount
        keyData.rowSpan = rs
        for(let j=0; j<iterCount; j++) {
          interRowTable[innerX+outerX+j+bias][keyDepth] = {...keyData}
          interRowTable[innerX+outerX+j+bias][headerDepth] = {
            value: headValue,
            source,
            sourceBlockId,
            rowSpan: rs, colSpan: span,
            isUsed: false,
            isLeaf,
            isKey: false,
            type: headType,
            style: headerStyle
          }
        }
      }
      // process cell unit
      if(!extra.notSearchCell && isLeaf) {
        for(let c of extra.cell) {
          if(c.rowParentId === rh.blockId) {
            // let cellStyle = style_process(c.style)
            let cellStyle = c.style
            // process function cell
            if(rh.function) {
              if(!agg_type_check(extra.attrInfo, c.attrName)) throw new Error("Function can only be used to numerical>")
              delete extra.preVal[source]
              extra.cellTable[innerX+outerX+bias].push({
                value: aggregate_use(extra.preVal, extra.data, c.attrName, FUNC_SUM),
                source: c.attrName,
                sourceBlockId: c.blockId,
                type: BlockType.CELL,
                style: cellStyle
              }) 
            // Process attr cell
            } else {
              extra.cellTable[innerX+outerX+bias].push({
                value: get_cell_val(extra.preVal, extra.data, c.attrName),
                source: c.attrName,
                sourceBlockId: c.blockId,
                type: BlockType.CELL,
                style: cellStyle
              }) 
            }
          }
        }
      }
      if(extra.notSearchCell && isLeaf) {
        if(rh.function) delete extra.preVal[source]
        extra.valIdx.push({
            idx: innerX+outerX+bias,
            preVal: Object.assign({}, extra.preVal),
            blockId: rh.blockId,
            isAgg: rh.function ? true : false
          })
      }
      innerX += iterCount
      delete extra.preVal[source]
      pos++
    }
  }
  return innerX + (isPreMerge ? 1 : 0) 
}

// generate intermediate column table
const gen_inter_column_table = (interColumnTable, columnHeader, extra, width: number, depth: number, 
  outerY: number, bias = 0, isPreMerge = false, preKey = '', keyBias = 0): number => {
  if(columnHeader === undefined || columnHeader.length === 0) return 1
  let innerY = 0
  let topBias = 0, bottomBias = 0
  let [tb, bb] = extra.layersBias[depth]
  topBias = tb, bottomBias = bb
  let currentKeyLayer = topBias + bottomBias
  for(let ch of columnHeader) {
    let isLeaf = (ch.children && ch.children.length) ? false : true
    let sourceBlockId = ch.blockId, source = ch.attrName ?? ch.function
    let headerDepth = depth + keyBias + topBias, keyDepth = headerDepth
    // let headerStyle = style_process(ch.style)
    let headerStyle = ch.style
    let headType = ch.function ? BlockType.FUNCTION : BlockType.COLUMN
    let isKeyEmbedded = false
    if(ch.key && ch.key.position === Position.TOP) keyDepth = headerDepth - 1
    if(ch.key && ch.key.position === Position.BOTTOM) keyDepth = headerDepth + 1
    if(ch.key && ch.key.position === Position.EMBEDDED) isKeyEmbedded = true
    let pos = 0
    for(let i=0; i<ch.values.length; i++) {
      let iterCount: number, key = ch.key ? get_key(ch.key, pos, preKey) : ''
      let headValue = isKeyEmbedded ? key+ ' ' + ch.values[i] : ch.values[i]
      let span = extra.headSpan[depth]
      let keyData = {
        value: key, 
        source: '@__KEY',
        sourceBlockId,
        rowSpan: 1, colSpan: 1,
        isUsed: false,
        isLeaf,
        isKey: true,
        type: BlockType.KEY,
        style: headerStyle
      }
      if(source) extra.preVal[source] = ch.values[i]
      if(!get_cell_head_is_valid(extra.preVal, extra.data) && ch.attrName) {
        delete extra.preVal[source]
        continue
      }
      if(ch.entityMerge) {
        iterCount = gen_inter_column_table(interColumnTable, ch.children, extra, width, depth, 
          outerY+innerY+1, bias, ch.entityMerge, key, keyBias)
      } else {
        iterCount = gen_inter_column_table(interColumnTable, ch.children, extra, width, depth+1, 
          outerY+innerY, bias, ch.entityMerge, key, currentKeyLayer+keyBias)
      }
      if(innerY+outerY+iterCount > width) {
        console.log('Error', innerY, outerY, iterCount, width);
        throw new Error("Over columnHeader width!")
      }
      // process entities merged
      if(ch.entityMerge) {
        interColumnTable[keyDepth][innerY+outerY+bias] = keyData
        interColumnTable[headerDepth][innerY+outerY+bias] = {
          value: headValue,
          source,
          sourceBlockId,
          rowSpan: span, colSpan: 1,
          isUsed: false, 
          isLeaf,
          isKey: false,
          type: headType,
          style: headerStyle
        }
      // process as cells merged 
      } else {
        let cs = iterCount
        keyData.colSpan = cs
        for(let j:number=0; j<iterCount; j++) {
          interColumnTable[keyDepth][innerY+outerY+j+bias] = {...keyData}
          interColumnTable[headerDepth][innerY+outerY+j+bias] = {
            value: headValue,
            source,
            sourceBlockId,
            rowSpan: span, colSpan: cs,
            isUsed: false,
            isLeaf,
            isKey: false,
            type: headType,
            style: headerStyle
          }
        }
      }
      // process cell unit
      if(!extra.notSearchCell && isLeaf) {
        for(let c of extra.cell) {
          if(c.colParentId === ch.blockId) {
            // let cellStyle = style_process(c.style)
            let cellStyle = c.style
            // process function cell
            if(ch.function) {
              if(!agg_type_check(extra.attrInfo, c.attrName)) throw new Error("Function can only be used to numerical>")
              delete extra.preVal[source]
              extra.cellTable[innerY+outerY+bias].push({
                value: aggregate_use(extra.preVal, extra.data, c.attrName, FUNC_SUM),
                source: c.attrName,
                sourceBlockId: c.blockId,
                type: BlockType.CELL,
                style: cellStyle
              }) 
            // Process attr cell
            } else {
              extra.cellTable[innerY+outerY+bias].push({
                value: get_cell_val(extra.preVal, extra.data, c.attrName),
                source: c.attrName,
                sourceBlockId: c.blockId,
                type: BlockType.CELL,
                style: cellStyle
              }) 
            }
          }
        }
      }
      if(extra.notSearchCell && isLeaf) {
        if(ch.function) delete extra.preVal[source]
        extra.valIdx.push({
            idx: innerY+outerY+bias,
            preVal: Object.assign({}, extra.preVal),
            blockId: ch.blockId,
            isAgg: ch.function ? true : false
          })
      }
      innerY += iterCount
      delete extra.preVal[source]
      pos++
    }
  }
  return innerY + (isPreMerge ? 1 : 0) 
}

// generate intermediate cross table
const gen_inter_cross_table = (interCrossTable, rowExtra, colExtra, cell) => {
  let rowValIdx = rowExtra.valIdx, colValIdx = colExtra.valIdx
  for(let i=0; i<rowValIdx.length; i++) {
    for(let j=0; j<colValIdx.length; j++) {
      for(let c of cell) {
        if(c.rowParentId === rowValIdx[i].blockId && c.colParentId === colValIdx[j].blockId) {
          // let cellStyle = style_process(c.style)
          let cellStyle = c.style
          let x = rowValIdx[i].idx, y = colValIdx[j].idx
          if(rowValIdx[i].isAgg || colValIdx[j].isAgg) {
            if(!agg_type_check(rowExtra.attrInfo, c.attrName)) throw new Error("Function can only be used to numerical>")
            interCrossTable[x][y] = {
              value: aggregate_use({...rowValIdx[i].preVal, ...colValIdx[j].preVal}, rowExtra.data, 
                c.attrName, FUNC_SUM),
              // source: c.attrName,
              sourceBlockId: c.blockId,
              rowSpan: 1, colSpan: 1,
              type: BlockType.CELL,
              style: cellStyle
            }
          } else {
            interCrossTable[x][y] = {
              value: get_cell_val({...rowValIdx[i].preVal, ...colValIdx[j].preVal}, rowExtra.data, c.attrName),
              // source: c.attrName,
              sourceBlockId: c.blockId,
              rowSpan: 1, colSpan: 1,
              type: BlockType.CELL,
              style: cellStyle
            }
          }
        }
      }
    }
  }
}

// generate facet and blankLine structure table
const gen_blank_facet_table = (rawTable, header, info, depth, outerX, 
  bias = 0, isPreMerge = false, keyBias = 0) => {
  if(header === undefined || header.length === 0) return [1, info.cellLength, 1, 0]
  let innerX = 0, maxLen = info.cellLength, facetSpan = 0, blankLine = 0
  let [beforeBias, afterBias] = info.layersBias[depth]
  let keyLayer = beforeBias+afterBias
  for(let hb of header) {
    let start = innerX + outerX + bias, subFacetSpan = 0
    let nowBeforeBias = 0, nowAfterBias = 0
    let source = hb.attrName ?? hb.function, pos = 0
    let eachIterCount = new Array()
    if(hb.key) {
      if(info.tbClass === ROW_TABLE) {
        if(hb.key.position === Position.LEFT) nowBeforeBias = 1
        if(hb.key.position === Position.RIGHT) nowAfterBias = 1
      } else if(info.tbClass === COLUM_TABLE) {
        if(hb.key.position === Position.TOP) nowBeforeBias = 1
        if(hb.key.position === Position.BOTTOM) nowAfterBias = 1
      }
    }
    for(let i=0; i<hb.values.length; i++) {
      let iterCount = 1, len = info.cellLength, tmpFacetSpan = 1, blank = 0
      let x = innerX + outerX + bias, y = depth + keyBias
      if(source) info.preVal[source] = hb.values[i]
      if(!get_cell_head_is_valid(info.preVal, info.data) && hb.attrName) {
        delete info.preVal[source]
        continue
      }
      if(hb.entityMerge) {
        [iterCount, len, tmpFacetSpan, blank] = gen_blank_facet_table(rawTable, hb.children, info, depth, 
          outerX+innerX+1, bias, hb.entityMerge, keyBias)
      } else {
        [iterCount, len, tmpFacetSpan, blank] = gen_blank_facet_table(rawTable, hb.children, info, depth+1, 
          outerX+innerX, bias, hb.entityMerge, keyBias+keyLayer)
      }
      eachIterCount.push(iterCount)
      
      for(let j=0; j<iterCount; j++) {
        // console.log('xxxxxx',  info.oldTable[x+j][y+beforeBias].value, x+j, y+beforeBias);
        if(rawTable[x+j][y+beforeBias] !== undefined && !hb.entityMerge) {
          if(info.tbClass === ROW_TABLE) {
            // if(beforeBias > 0) rawTable[x+j][y].rowSpan = tmpFacetSpan + blank
            if(nowBeforeBias > 0) rawTable[x+j][y].rowSpan = tmpFacetSpan + blank
            rawTable[x+j][y+beforeBias].rowSpan = tmpFacetSpan + blank
            // if(afterBias > 0) rawTable[x+j][y+beforeBias+afterBias].rowSpan = tmpFacetSpan + blank
            if(nowAfterBias > 0) rawTable[x+j][y+beforeBias+afterBias].rowSpan = tmpFacetSpan + blank
          }
          else if(info.tbClass === COLUM_TABLE) {
            // if(beforeBias > 0) rawTable[x+j][y].colSpan = tmpFacetSpan + blank
            if(nowBeforeBias > 0) rawTable[x+j][y].colSpan = tmpFacetSpan + blank
            rawTable[x+j][y+beforeBias].colSpan = tmpFacetSpan + blank
            // if(afterBias > 0) rawTable[x+j][y+beforeBias+afterBias].colSpan = tmpFacetSpan + blank
            if(nowAfterBias > 0) rawTable[x+j][y+beforeBias+afterBias].colSpan = tmpFacetSpan + blank
          }          
        }
        if(rawTable[x+j][y+beforeBias] !== undefined && j===0 && hb.blankLine) {
          // if(beforeBias > 0) rawTable[x+j][y].hasBlank = true
          // rawTable[x+j][y+beforeBias].hasBlank = true
          // if(afterBias > 0) rawTable[x+j][y+beforeBias+afterBias].hasBlank = true
          if(beforeBias > 0) {
            rawTable[x+j][y].hasBlank = true
            rawTable[x+j][y].blankLen = len - y
            delete rawTable[x+j][y+beforeBias].hasBlank
          } else {
            rawTable[x+j][y+beforeBias].hasBlank = true
            rawTable[x+j][y+beforeBias].blankLen = len - y
          }
        }
      }
      if(hb.facet > 1) {
        let copyLen = len - y
        let group = pos % hb.facet
        let preX = 0
        for(let j=0; j<Math.floor(pos/hb.facet); j++) preX += eachIterCount[j]
        for(let j=0; j<iterCount; j++) {
          for(let k=0; k<copyLen; k++) {
            let tarX = start + preX + j, tarY = y + k + group*copyLen
            rawTable[tarX][tarY] = rawTable[x+j][y+k]
            if(rawTable[x+j][y+k] !== undefined && (tarX !== x+j || tarY !== y+k)) 
              rawTable[x+j][y+k] = {isDelete: true}
          }
        }
        if(info.alignHeader) {
          for(let i=0; i<info.alignHeader.length; i++) {
            for(let j=0; j<copyLen; j++) {
              let tarY = y + j + group*copyLen
              info.alignHeader[i][tarY] = info.alignHeader[i][y+j]
            }
          }
        }
        let delta = (hb.facet-1) * copyLen
        len += delta
      }

      innerX += iterCount
      delete info.preVal[source]
      pos++
      if(maxLen < len) maxLen = len
      subFacetSpan += tmpFacetSpan
    }
    if(hb.facet>1) subFacetSpan = Math.ceil(subFacetSpan / hb.facet)
    facetSpan += subFacetSpan
    if(hb.blankLine) blankLine += Math.ceil(pos / hb.facet)
  }
  let delta1 = isPreMerge ? 1 : 0
  return [innerX+delta1, maxLen, facetSpan+delta1, blankLine]
}

const gen_final_table = (table, tableClass) => {
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
  console.log('bf table', deepAssign({}, table));
  let finalTable = Array.from({length:table.length}, () => new Array())
  let locMap = new Array(maxLength).fill(0)
  for(let i=0; i<table.length; i++) {
    let t = table[i], isBlank = false
    for(let j=0; j<table[i].length; j++) {
      if(table[i][j] === undefined) {
        if(i+1 >= table.length) throw new Error("Final Table: Over Boundary")
        // if(isBlank) {
        //   if(finalTable[locMap[j]] === undefined) finalTable[locMap[j]] = new Array()
        //   if(tableClass === ROW_TABLE) 
        //     finalTable[locMap[j]].push({ rowSpan: 1, colSpan: table[i+1][j].colSpan})
        //   else if(tableClass === COLUM_TABLE) 
        //     finalTable[locMap[j]].push({ rowSpan: table[i+1][j].rowSpan, colSpan: 1})
        //   locMap[j]++
        // }
        if(finalTable[locMap[j]] === undefined) finalTable[locMap[j]] = new Array()
        if(tableClass === ROW_TABLE) 
          finalTable[locMap[j]].push({ rowSpan: 1, colSpan: table[i+1][j].colSpan})
        else if(tableClass === COLUM_TABLE) 
          finalTable[locMap[j]].push({ rowSpan: table[i+1][j].rowSpan, colSpan: 1})
        locMap[j]++
      } else if(!table[i][j].isDelete){
        if(table[i][j].hasBlank) {
          let blankLen = table[i][j].blankLen
          delete table[i][j].hasBlank
          delete table[i][j].blankLen
          if(tableClass === ROW_TABLE) {
            for(let k=j; k<j+blankLen; k++) {
              if(finalTable[locMap[k]] === undefined) finalTable[locMap[k]] = new Array()
              finalTable[locMap[k]].push({ rowSpan: 1, colSpan: table[i][k].colSpan})
              locMap[k]++
            }
          } else if(tableClass === COLUM_TABLE) {
            for(let k=j; k<j+blankLen; k++) {
              if(finalTable[locMap[k]] === undefined) finalTable[locMap[k]] = new Array()
              finalTable[locMap[k]].push({ rowSpan: table[i][k].rowSpan, colSpan: 1})
              locMap[k]++
            }
          }
          // isBlank = true
        }
        // if(isBlank) {
        //   if(finalTable[locMap[j]] === undefined) finalTable[locMap[j]] = new Array()
        //   if(tableClass === ROW_TABLE) 
        //     finalTable[locMap[j]].push({ rowSpan: 1, colSpan: table[i][j].colSpan})
        //   else if(tableClass === COLUM_TABLE) 
        //     finalTable[locMap[j]].push({ rowSpan: table[i][j].rowSpan, colSpan: 1})
        //   locMap[j]++
        // }
        if(finalTable[locMap[j]] === undefined) finalTable[locMap[j]] = new Array()
        finalTable[locMap[j]].push(table[i][j])
        if(tableClass === ROW_TABLE)
          locMap[j] += table[i][j].rowSpan
        else if(tableClass === COLUM_TABLE)
          locMap[j] += table[i][j].colSpan
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

// generate matched value table(Do not use)
const gen_valid_value_table = (table, tableClass, data, idDict) => {
  let rowLen = 0
  for(let t of table[0]) rowLen += t.colSpan
  let vvTable = Array.from({length: table.length}, () => new Array(rowLen)
                .fill(null).map(_ => ({rowSpan: 1, colSpan: 1}))) as any
  let useRecord = Array.from({length: table.length}, () => new Array(rowLen).fill(false))

  for(let i=0; i<table.length; i++) {
    for(let j=0; j<table[i].length; j++) {
      let tmp = table[i][j], loc = new Array(), id = tmp.sourceBlockId, fixJ = j
      while(useRecord[i][fixJ]) fixJ++
      if(id) {
        if(idDict.rowDict[id]) idDict.rowDict[id].locList.push(i)
        else if(idDict.colDict[id]) idDict.colDict[id].locList.push(fixJ)
      }
      for(let p=0; p<tmp.rowSpan; p++) {
        for(let q=0; q<tmp.colSpan; q++) {
          loc.push({x: i+p, y: fixJ+q})
          vvTable[i+p][fixJ+q] = {
            ...tmp,
            loc,
            isSkip: false,
          }
          useRecord[i+p][fixJ+q] = true
        }
      } 
    }
  }
  if(tableClass===ROW_TABLE || tableClass===CROSS_TABLE) {
    for(let i=0; i<vvTable.length; i++) {
      let hasHeader = false, hasCell = false, hasCellVal = false, hasBlank = false
      let lastBlank = -1,  lastBId = ""
      let headSet = {}, keyList = new Array(), isHeadValid = false
      for(let j=0; j<rowLen; j++) {
        let tmp = vvTable[i][j], id = tmp.sourceBlockId
        if(id && idDict.rowDict[id]) {
          hasHeader = true
          if(idDict.rowDict[id].attrName) {
            if(headSet[idDict.rowDict[id].attrName]) {
              if(get_cell_head_is_valid(headSet, data)) isHeadValid = true
              let tmpKey = keyList.pop()
              while(tmpKey !== idDict.rowDict[id].attrName) {
                delete headSet[tmpKey]
                tmpKey = keyList.pop()
              }
            }
            let value = tmp.value
            if(idDict.rowDict[id].key && idDict.rowDict[id].key.position===Position.EMBEDDED)
              value = tmp.value.split(" ").pop()
            headSet[idDict.rowDict[id].attrName] = value
            keyList.push(idDict.rowDict[id].attrName)
          }
          if(idDict.rowDict[id].hasBlank) {
            hasBlank = true
            lastBlank = j
            lastBId = id
          }
        } 
        if(id && idDict.cellDict[id]) {
          hasCell = true 
          if(tmp.value) hasCellVal = true
        }
      }
      if(get_cell_head_is_valid(headSet, data)) isHeadValid = true
      if((hasHeader && !hasCell && !isHeadValid) || (hasHeader && hasCell && !hasCellVal)) {
        let dealBlank = false 
        if(hasBlank) {
          let res = idDict.rowDict[lastBId].locList.find(e => e===i)
          if(res && vvTable[i][lastBlank].rowSpan<=1) dealBlank = true
        }
        for(let j=0; j<rowLen; j++) {
          let tmp = vvTable[i][j], delta = 1
          tmp.isSkip = true 
          if(dealBlank) {
            vvTable[i-1][j].isSkip = true
            delta++
          }
          for(let {x, y} of tmp.loc) vvTable[x][y].rowSpan -= j<lastBlank ? delta : 1
        }
      }
    }
  }
  if(tableClass===COLUM_TABLE || tableClass===CROSS_TABLE) {
    for(let j=0; j<rowLen; j++){
      let hasHeader = false, hasCell = false, hasCellVal = false, hasBlank = false
      let lastBlank = -1,  lastBId = ""
      let headSet = {}, keyList = new Array(), isHeadValid = false
      for(let i=0; i<vvTable.length; i++) {
        let tmp = vvTable[i][j], id = tmp.sourceBlockId
        if(id && idDict.colDict[id]) {
          hasHeader = true 
          if(idDict.colDict[id].attrName) {
            if(headSet[idDict.colDict[id].attrName]) {
              if(get_cell_head_is_valid(headSet, data)) isHeadValid = true
              let tmpKey = keyList.pop()
              while(tmpKey !== idDict.colDict[id].attrName) {
                delete headSet[tmpKey]
                tmpKey = keyList.pop()
              }
            }
            let value = tmp.value
            if(idDict.colDict[id].key && idDict.colDict[id].key.position===Position.EMBEDDED)
              value = tmp.value.split(" ").pop()
            headSet[idDict.colDict[id].attrName] = value
            keyList.push(idDict.colDict[id].attrName)
          }
          if(idDict.colDict[id].hasBlank) {
            hasBlank = true
            lastBlank = i
            lastBId = id
          }
        }
        if(id && idDict.cellDict[id]) {
          hasCell = true 
          if(tmp.value) hasCellVal = true
        }
      }
      if(get_cell_head_is_valid(headSet, data)) isHeadValid = true
      if((hasHeader && !hasCell && !isHeadValid) || (hasHeader && hasCell && !hasCellVal)) {
        let dealBlank = false 
        if(hasBlank) {
          let res = idDict.rowDict[lastBId].locList.find(e => e===j)
          if(res && vvTable[lastBlank][j].colSpan<=1) dealBlank = true
        }
        for(let i=0; i<vvTable.length; i++) {
          let tmp = vvTable[i][j], delta = 1
          tmp.isSkip = true 
          if(dealBlank) {
            vvTable[i][j-1].isSkip = true
            delta++
          }
          for(let {x, y} of tmp.loc) vvTable[x][y].colSpan -= i<lastBlank ? delta : 1
        }
      }
    }
  }
  // console.log('vv Table', util.inspect(vvTable, {showHidden: false, depth: null, colors: true}));
  console.log('vv Table', vvTable);
  let retTable = new Array(), pos = 0 
  for(let i=0; i<vvTable.length; i++) {
    if(!retTable[pos]) retTable[pos] = new Array()
    for(let j=0; j<rowLen; j++) {
      let tmp = vvTable[i][j], id = tmp.sourceBlockId
      let mergeType = GridMerge.Merged
      let isRowHeader = (id && idDict.rowDict[id]) ? true : false
      let isColHeader = (id && idDict.colDict[id]) ? true : false
      if(isRowHeader) mergeType = idDict.rowDict[id].gridMerge
      else if(isColHeader) mergeType = idDict.colDict[id].gridMerge
      let rs = (isRowHeader && mergeType!==GridMerge.Merged) ? 1 : tmp.rowSpan
      let cs = (isColHeader && mergeType!==GridMerge.Merged) ? 1 : tmp.colSpan
      if(tmp.isSkip) continue
      retTable[pos].push({
        value: tmp.value, 
        sourceBlockId: tmp.sourceBlockId,
        rowSpan: rs, 
        colSpan: cs,
        type: tmp.type,
        style: tmp.style
      })
      if(mergeType !== GridMerge.UnmergedAll) {
        for(let {x, y} of tmp.loc) {
          if(mergeType === GridMerge.Merged) vvTable[x][y].isSkip = true
          else if(mergeType === GridMerge.UnmergedFirst) vvTable[x][y].value = undefined
        }
      }
    }
    if(retTable[pos].length > 0) pos++
  }
  if(retTable[retTable.length-1].length === 0) retTable.pop()
  // console.log('ret Table', util.inspect(retTable, {showHidden: false, depth: null, colors: true}));
  // console.log('ret Table', retTable);

  return retTable
}

// generate grid merged table
const gen_grid_merged_table = (table, idDict) => {
  let rowLen = 0
  for(let t of table[0]) rowLen += t.colSpan
  let vvTable = Array.from({length: table.length}, () => new Array(rowLen)
                .fill(null).map(_ => ({rowSpan: 1, colSpan: 1}))) as any
  let useRecord = Array.from({length: table.length}, () => new Array(rowLen).fill(false))

  for(let i=0; i<table.length; i++) {
    for(let j=0; j<table[i].length; j++) {
      let tmp = table[i][j], loc = new Array(), id = tmp.sourceBlockId, fixJ = j
      while(useRecord[i][fixJ]) fixJ++
      if(id) {
        if(idDict.rowDict[id]) idDict.rowDict[id].locList.push(i)
        else if(idDict.colDict[id]) idDict.colDict[id].locList.push(fixJ)
      }
      for(let p=0; p<tmp.rowSpan; p++) {
        for(let q=0; q<tmp.colSpan; q++) {
          loc.push({x: i+p, y: fixJ+q})
          vvTable[i+p][fixJ+q] = {
            ...tmp,
            loc,
            isSkip: false,
          }
          useRecord[i+p][fixJ+q] = true
        }
      } 
    }
  }

  console.log('gm Table', vvTable);
  let retTable = new Array(), pos = 0 
  for(let i=0; i<vvTable.length; i++) {
    if(!retTable[pos]) retTable[pos] = new Array()
    for(let j=0; j<rowLen; j++) {
      let tmp = vvTable[i][j], id = tmp.sourceBlockId
      let mergeType = GridMerge.Merged
      let isRowHeader = (id && idDict.rowDict[id]) ? true : false
      let isColHeader = (id && idDict.colDict[id]) ? true : false
      if(isRowHeader) mergeType = idDict.rowDict[id].gridMerge
      else if(isColHeader) mergeType = idDict.colDict[id].gridMerge
      let rs = (isRowHeader && mergeType!==GridMerge.Merged) ? 1 : tmp.rowSpan
      let cs = (isColHeader && mergeType!==GridMerge.Merged) ? 1 : tmp.colSpan
      if(tmp.isSkip) continue
      retTable[pos].push({
        value: tmp.value, 
        sourceBlockId: tmp.sourceBlockId,
        rowSpan: rs, 
        colSpan: cs,
        type: tmp.type,
        style: tmp.style
      })
      if(mergeType !== GridMerge.UnmergedAll) {
        for(let {x, y} of tmp.loc) {
          if(mergeType === GridMerge.Merged) vvTable[x][y].isSkip = true
          else if(mergeType === GridMerge.UnmergedFirst) vvTable[x][y].value = undefined
        }
      }
    }
    if(retTable[pos].length > 0) pos++
  }
  if(retTable[retTable.length-1].length === 0) retTable.pop()
  // console.log('ret Table', retTable);

  return retTable
}

const gen_facet_ME_table = (table, tbClass, idDict) => {
  if(tbClass === CROSS_TABLE) return table
  let rowLen = 0
  for(let t of table[0]) rowLen += t.colSpan
  let formatTable = Array.from({length: table.length}, () => new Array(rowLen)
                    .fill(null).map(_ => ({rowSpan: 1, colSpan: 1}))) as any
  let useRecord = Array.from({length: table.length}, () => new Array(rowLen).fill(false))

  for(let i=0; i<table.length; i++) {
    for(let j=0; j<table[i].length; j++) {
      let tmp = table[i][j], fixJ = j
      while(useRecord[i][fixJ]) fixJ++
      for(let p=0; p<tmp.rowSpan; p++) {
        for(let q=0; q<tmp.colSpan; q++) {
          formatTable[i+p][fixJ+q] = {
            ...tmp,
            isSkip: (p===0 && q===0) ? false : true,
          }
          useRecord[i+p][fixJ+q] = true
        }
      }
    }
  }

  for(let i=0; i<formatTable.length; i++) {
    for(let j=0; j<formatTable[i].length; j++) {
      let tmp = formatTable[i][j]
      let value = tmp.value, id = tmp.sourceBlockId
      if(tbClass === ROW_TABLE) {
        let bias = tmp.rowSpan
        if(!tmp.skip && id) {
          let rInfo = idDict.rowDict[id]
          if(rInfo && rInfo.facetMerge) {
            while(i+bias<formatTable.length && value===formatTable[i+bias][j].value && 
              id===formatTable[i+bias][j].sourceBlockId) {
              tmp.rowSpan += formatTable[i+bias][j].rowSpan
              for(let k=0; k<formatTable[i+bias][j].rowSpan; k++)
                formatTable[i+bias+k][j].isSkip = true
              bias += formatTable[i+bias][j].rowSpan
            }
          }
          let ceInfo = idDict.cellDict[id]
          if((rInfo && rInfo.facetEnd) || (ceInfo && idDict.rowDict[ceInfo.rowPId].facetEnd)) {
            while(i+bias<formatTable.length && !formatTable[i+bias][j].value) {
              tmp.rowSpan += formatTable[i+bias][j].rowSpan
              for(let k=0; k<formatTable[i+bias][j].rowSpan; k++)
                formatTable[i+bias+k][j].isSkip = true
              bias += formatTable[i+bias][j].rowSpan
            }
          }
        }
      } else if(tbClass === COLUM_TABLE) {
        let bias = tmp.colSpan
        if(!tmp.skip && id) {
          let cInfo = idDict.colDict[id]
          if(cInfo && cInfo.facetMerge) {
            while(j+bias<formatTable[i].length && value===formatTable[i][j+bias].value && 
              id===formatTable[i][j+bias].sourceBlockId) {
              tmp.colSpan += formatTable[i][j+bias].colSpan
              for(let k=0; k<formatTable[i][j+bias].colSpan; k++)
                formatTable[i][j+bias+k].isSkip = true
              bias += formatTable[i][j+bias].colSpan
            }
          }
          let ceInfo = idDict.cellDict[id]
          if((cInfo && cInfo.facetEnd) || (ceInfo && idDict.colDict[ceInfo.colPId].facetEnd)) {
            while(j+bias<formatTable[i].length && !formatTable[i][j+bias].value) {
              tmp.colSpan += formatTable[i][j+bias].colSpan
              for(let k=0; k<formatTable[i][j+bias].colSpan; k++)
                formatTable[i][j+bias+k].isSkip = true
              bias += formatTable[i][j+bias].colSpan
            }
          }
        }
      }
    }
  }

  let retTable = new Array()
  for(let i=0; i<formatTable.length; i++) {
    retTable[i] = new Array()
    for(let j=0; j<formatTable[i].length; j++) {
      let tmp = {...formatTable[i][j]}
      if(!tmp.isSkip) {
        delete tmp.isSkip
        retTable[i].push(tmp)
      }
    }
  }

  console.log('meTable', retTable);
  return retTable
}

const gen_styled_table = (table, styles, idDict) => {
  let rowLen = 0, retTable = new Array()
  for(let t of table[0]) rowLen += t.colSpan 
  let useRecord = Array.from({length: table.length}, () => new Array(rowLen).fill(false))
  
  for(let i=0; i<table.length; i++) {
    retTable[i] = new Array()
    for(let j=0; j<table[i].length; j++) {
      let tmp = {...table[i][j]}, id = tmp.sourceBlockId, fixJ = j
      while(useRecord[i][fixJ]) fixJ++
      let loc = {x: i+1, y: fixJ+1}
      if(i===0 && fixJ===0 && tmp.value===undefined 
        && idDict.titleInfo.title!=="") tmp.value = idDict.titleInfo.title
      tmp.style = style_process(deepAssign(style_selector_fill(id, loc, styles, idDict), tmp.style))
      retTable[i].push(tmp)
      for(let p=0; p<tmp.rowSpan; p++) {
        for(let q=0; q<tmp.colSpan; q++) useRecord[i+p][fixJ+q] = true
      } 
    }
  }
  // console.log('styled Table', util.inspect(retTable, {showHidden: false, depth: null, colors: true}));
  console.log('styled Table', retTable);

  return retTable
}

const table_process = (tbClass:string, data, {rowHeader, columnHeader, cell, attrInfo, styles}) => {
  let interTable, processTable = new Array()
  let finalTable: interCell[][] = []
  // pre info
  let titleInfo = {
    row: new Array(),
    col: new Array(),
    tList: new Array(),
    title: "",
  }
  let idDict = {
    rowDict: get_header_id_dict(rowHeader, titleInfo.row),
    colDict: get_header_id_dict(columnHeader, titleInfo.col),
    cellDict: get_cell_id_dict(cell),
    titleInfo,
  }
  let rTitle = new Array(), cTitle = new Array()
  for(let rt of idDict.titleInfo.row) if(rt.length>0) rTitle.push(rt.join("|"))
  for(let ct of idDict.titleInfo.col) if(ct.length>0) cTitle.push(ct.join("|"))
  if(rTitle.length>0) titleInfo.tList.push(rTitle.join("-"))
  if(cTitle.length>0) titleInfo.tList.push(cTitle.join("-"))
  titleInfo.title = titleInfo.tList.join("/")

  let rowDepth = calc_head_depth(rowHeader);
  let colDepth = calc_head_depth(columnHeader);
  // let rowSize = calc_head_size(rowHeader);
  // let colSize = calc_head_size(columnHeader);
  let rowSize = calc_head_size2(rowHeader, data.values);
  let colSize = calc_head_size2(columnHeader, data.values);

  if(tbClass == ROW_TABLE) {
    let headTmpSpan = Array.from({length: rowDepth}, () => ({}))
    let headSpan = new Array(rowDepth).fill(1)
    calc_head_span(rowHeader, headTmpSpan)
    console.log('head tmp span', headTmpSpan);
    // for(let i=0; i<headTmpSpan.length; i++) {
    //   let hts = headTmpSpan[i]
    //   for(let k in hts) if(hts[k] > headSpan[i]) headSpan[i] = hts[k]
    // }
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
    // // when cell is empty, fill one row/col(default)
    // for(let ct of extra.cellTable) {
    //   if(ct.length === 0) ct.push({rowSpan: 1, colSpan: 1})
    // }
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
            // source: tmp.source,
            sourceBlockId: tmp.sourceBlockId,
            rowSpan: tmp.rowSpan, 
            colSpan: tmp.colSpan,
            type: tmp.type,
            style: tmp.style
          })
        } else {
          processTable[i].push({
            value: tmp.value, 
            // source: tmp.source,
            sourceBlockId: tmp.sourceBlockId,
            rowSpan: 1, 
            colSpan: headKeySpan[j],
            type: tmp.type,
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
          // source: c.source,
          sourceBlockId: c.sourceBlockId,
          rowSpan: 1,
          colSpan: 1,
          type: c.type,
          style: c.style
        })
      }
      maxLength = maxLength>tmpLength[i] ? maxLength : tmpLength[i]
    }
    // fill empty unit
    for(let i=0; i<processTable.length; i++) {
      let resLength = maxLength - tmpLength[i]
      for(let j=0; j<resLength; j++) processTable[i].push({
          value: undefined,
          // source: undefined,
          sourceBlockId: undefined,
          rowSpan: 1,
          colSpan: 1,
          type: undefined,
          style: undefined
      })
    }
    // process blankLine and facet structure
    let info = {
      layersBias,
      cellLength: maxLength + rowDepth,
      tbClass,
      data: data.values,
      preVal: {},
      // oldTable: JSON.parse(JSON.stringify(processTable))
    }
    gen_blank_facet_table(processTable, rowHeader, info, 0, 0)
    console.log('new', processTable);
    finalTable =  gen_final_table(processTable, tbClass)
    console.log('final row', finalTable);

  } else if(tbClass == COLUM_TABLE) {
    let headTmpSpan = Array.from({length: colDepth}, () => ({}))
    let headSpan = new Array(colDepth).fill(1)
    calc_head_span(columnHeader, headTmpSpan)
    console.log('head tmp span', headTmpSpan);
    // for(let i=0; i<headTmpSpan.length; i++) {
    //   let hts = headTmpSpan[i]
    //   for(let k in hts) if(hts[k] > headSpan[i]) headSpan[i] = hts[k]
    // }
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
    // console.log('@@', interTable);
    let maxLength = 0, tmpLength: number[] = []
    // // when cell is empty, fill one row/col(default)
    // for(let ct of extra.cellTable) {
    //   if(ct.length === 0) ct.push({rowSpan: 1, colSpan: 1})
    // }
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
            // source: tmp.source,
            sourceBlockId: tmp.sourceBlockId,
            rowSpan: tmp.rowSpan, 
            colSpan: tmp.colSpan,
            type: tmp.type,
            style: tmp.style
          })
        } else {
          processTable[j].push({
            value: tmp.value, 
            // source: tmp.source,
            sourceBlockId: tmp.sourceBlockId,
            rowSpan: headKeySpan[i], 
            colSpan: 1,
            type: tmp.type,
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
          // source: c.source,
          sourceBlockId: c.sourceBlockId,
          rowSpan: 1,
          colSpan: 1,
          type: c.type,
          style: c.style
        })
      }
      maxLength = maxLength>tmpLength[j] ? maxLength : tmpLength[j]
    }
    // fill empty unit
    for(let i=0; i<processTable.length; i++) {
      let resLength = maxLength - tmpLength[i]
      for(let j=0; j<resLength; j++) processTable[i].push({
          value: undefined,
          // source: undefined,
          sourceBlockId: undefined,
          rowSpan: 1,
          colSpan: 1,
          type: undefined,
          style: undefined
      })
    }
    // process blankLine and facet structure
    let info = {
      layersBias,
      cellLength: maxLength + colDepth,
      tbClass,
      data: data.values,
      preVal: {},
      // oldTable: JSON.parse(JSON.stringify(processTable))
    }
    gen_blank_facet_table(processTable, columnHeader, info, 0, 0)
    // console.log('new', processTable);
    finalTable =  gen_final_table(processTable, tbClass)
    console.log('final column', finalTable);

  } else {
    // Row Header Process
    let headRowTmpSpan = Array.from({length: rowDepth}, () => ({}))
    let headRowSpan = new Array(rowDepth).fill(1)
    calc_head_span(rowHeader, headRowTmpSpan)
    console.log('head row tmp span', headRowTmpSpan);
    // for(let i=0; i<headRowTmpSpan.length; i++) {
    //   let hts = headRowTmpSpan[i]
    //   for(let k in hts) if(hts[k] > headRowSpan[i]) headRowSpan[i] = hts[k]
    // }
    console.log('head row span', headRowSpan);
    let layersRowBias = [], totalRowLayer = 0
    calc_each_key_layer(rowHeader, layersRowBias, 0, ROW_TABLE)
    for(let lb of layersRowBias) totalRowLayer += lb[0] + lb[1]
    rowDepth += totalRowLayer
    console.log('layers row bias', layersRowBias);
    console.log('total row layer', totalRowLayer);
    let headKeyRowSpan = new Array()
    for(let i=0; i<headRowSpan.length; i++) {
      if(layersRowBias[i][0] > 0) headKeyRowSpan.push(1)
      headKeyRowSpan.push(headRowSpan[i])
      if(layersRowBias[i][1] > 0) headKeyRowSpan.push(1)
    }
    console.log("head key row span", headKeyRowSpan);
    let rowExtra = {
      preVal: {},
      data: data.values,
      cell, 
      cellTable: Array.from({length: rowSize}, () => new Array()),
      attrInfo,
      layersBias: layersRowBias,
      headSpan: headRowSpan,
      notSearchCell: true,
      valIdx: new Array(),
    }

    // Column Header Process
    let headColTmpSpan = Array.from({length: colDepth}, () => ({}))
    let headColSpan = new Array(colDepth).fill(1)
    calc_head_span(columnHeader, headColTmpSpan)
    console.log('head col tmp span', headColTmpSpan);
    // for(let i=0; i<headColTmpSpan.length; i++) {
    //   let hts = headColTmpSpan[i]
    //   for(let k in hts) if(hts[k] > headColSpan[i]) headColSpan[i] = hts[k]
    // }
    console.log('head col span', headColSpan);
    let layersColBias = [], totalColLayer = 0
    calc_each_key_layer(columnHeader, layersColBias, 0, COLUM_TABLE)
    for(let lb of layersColBias) totalColLayer += lb[0] + lb[1]
    colDepth += totalColLayer
    console.log('layers col bias', layersColBias);
    console.log('total col layer', totalColLayer);
    let headKeyColSpan = new Array()
    for(let i=0; i<headColSpan.length; i++) {
      if(layersColBias[i][0] > 0) headKeyColSpan.push(1)
      headKeyColSpan.push(headColSpan[i])
      if(layersColBias[i][1] > 0) headKeyColSpan.push(1)
    }
    console.log("head key col span", headKeyColSpan);
    let colExtra = {
      preVal: {},
      data: data.values,
      cell, 
      cellTable: Array.from({length: rowSize}, () => new Array()),
      attrInfo,
      layersBias: layersColBias,
      headSpan: headColSpan,
      notSearchCell: true,
      valIdx: new Array(),
    }

    // process interTable
    let crossSize = rowSize + colDepth, crossDepth = rowDepth+colSize
    interTable = Array.from({length: crossSize}, () => new Array(crossDepth)
                  .fill(null).map(_ => ({rowSpan: 1, colSpan: 1})))
    gen_inter_row_table(interTable, rowHeader, rowExtra, rowSize, 0, 0, colDepth)
    gen_inter_column_table(interTable, columnHeader, colExtra, colSize, 0, 0, rowDepth)

    // console.log('row valIdx', rowExtra.valIdx)
    // console.log('col valIdx', colExtra.valIdx);
    gen_inter_cross_table(interTable, rowExtra, colExtra, cell)
    // console.log('@', interTable)

    let rowPart = new Array(), colPart = new Array()
    if(get_header_is_facet(columnHeader)) {
      // columnHeader with cell
      let rowProcess = new Array(), rowProcTrans = new Array()
      for(let i=0; i<rowSize; i++) {
        rowProcess[i] = new Array()
        for(let j=0; j<crossDepth; j++) {
          rowProcess[i].push({...interTable[i+colDepth][j]})
        }
      }
      for(let i=0; i<colDepth; i++) {
        colPart[i] = new Array()
        for(let j=0; j<colSize; j++) {
          colPart[i].push({...interTable[i][j+rowDepth]})
        }
      }

      // process row part
      for(let i=0; i<rowSize; i++) {
        rowProcTrans[i] = new Array()
        for(let j=0; j<rowDepth; j++) {
          let tmp = rowProcess[i][j]
          if(tmp.isUsed) {
            rowProcess[i][j] ={isDelete: true}
            rowProcTrans[i].push(rowProcess[i][j])
            continue
          }
          if(tmp.value) {
            rowProcess[i][j] = {
              value: tmp.value, 
              // source: tmp.source,
              sourceBlockId: tmp.sourceBlockId,
              rowSpan: tmp.rowSpan, 
              colSpan: tmp.colSpan,
              type: tmp.type,
              style: tmp.style
            }
          } else {
            rowProcess[i][j] = {
              value: tmp.value, 
              // source: tmp.source,
              sourceBlockId: tmp.sourceBlockId,
              rowSpan: 1, 
              colSpan: headKeyRowSpan[j],
              type: tmp.type,
              style: tmp.style
            }
          }
          rowProcTrans[i].push({...rowProcess[i][j]})
          for(let k=0; k<tmp.rowSpan; k++) {
            rowProcess[i+k][j].isUsed = true
          }
        }
        for(let j=rowDepth; j<crossDepth; j++) rowProcTrans[i].push(rowProcess[i][j])
      }
      let rowInfo = {
        layersBias: layersRowBias,
        cellLength: crossDepth,
        tbClass: ROW_TABLE,
        data: data.values,
        preVal: {},
      }
      gen_blank_facet_table(rowProcTrans, rowHeader, rowInfo, 0, 0)
      // console.log('transfer', rowProcTrans);
      rowProcess =  gen_final_table(rowProcTrans, ROW_TABLE)
      // console.log('row process', rowProcess);
      for(let j=0;  j<rowDepth; j++) {
        rowPart[j] = new Array()
        for(let i=0; i<rowProcess.length; i++) {
          rowPart[j].push(rowProcess[i][j])
          for(let k=1; k<rowProcess[i][j].rowSpan; k++) {
            // rowPart[j].push({isDelete: true})
            rowProcess[i+k].splice(j, 0, {isDelete: true})
          }
        }
        for(let i=0; i<colDepth; i++) {
          rowPart[j].unshift({
            rowSpan: headKeyColSpan[i], 
            colSpan: headKeyRowSpan[j]
          })
        }
      }
      // console.log('row part', rowPart);

      // process column part
      let maxLength = 0
      for(let i=0; i<rowProcess.length; i++) {
        colPart[i+colDepth] = rowProcess[i].slice(rowDepth)
      }
      maxLength = colPart.length
      // console.log('col part', colPart, maxLength);
      let colProcess = new Array()
      for(let j=0; j<colSize; j++) {
        colProcess[j] = new Array()
        for(let i=0; i<colDepth; i++) {
          let tmp = colPart[i][j] 
          if(tmp.isUsed) {
            colProcess[j].push({isDelete: true})
            continue
          }
          if(tmp.value) {
            colProcess[j].push({
              value: tmp.value, 
              // source: tmp.source,
              sourceBlockId: tmp.sourceBlockId,
              rowSpan: tmp.rowSpan, 
              colSpan: tmp.colSpan,
              type: tmp.type,
              style: tmp.style
            })
          } else {
            colProcess[j].push({
              value: tmp.value, 
              // source: tmp.source,
              sourceBlockId: tmp.sourceBlockId,
              rowSpan: headKeyColSpan[i], 
              colSpan: 1,
              type: tmp.type,
              style: tmp.style
            })
          }
          for(let k=0; k<tmp.colSpan; k++) {
            colPart[i][j+k].isUsed = true
          }
        }
        for(let i=colDepth; i<colPart.length; i++) {
          colProcess[j].push(colPart[i][j])
        }
      }
      let colInfo = {
        layersBias: layersColBias,
        cellLength: maxLength,
        tbClass: COLUM_TABLE,
        data: data.values,
        preVal: {},
        alignHeader: rowPart,
      }
      gen_blank_facet_table(colProcess, columnHeader, colInfo, 0, 0)
      // console.log('new', colProcess, maxLength);
      colPart =  gen_final_table(colProcess, COLUM_TABLE)
      // console.log('final', colPart);
      for(let j=0; j<rowPart.length; j++) {
        for(let i=colDepth; i<rowPart[j].length; i++) {
          if(!finalTable[i]) finalTable[i] = new Array()
          if(!rowPart[j][i].isDelete) finalTable[i].push(rowPart[j][i])
        }
      }
      for(let i=0; i<colPart.length; i++) {
        if(!finalTable[i]) finalTable[i] = new Array()
        for(let j=0; j<colPart[i].length; j++) {
          finalTable[i].push(colPart[i][j])
        }
      }
      let rs = 0, cs = 0
      for(let i=0; i<colDepth; i++) rs += headKeyColSpan[i]
      for(let i=0; i<rowDepth; i++) cs += headKeyRowSpan[i]
      finalTable[0].unshift({
        value: undefined as any, 
        sourceBlockId: undefined as any,
        rowSpan: rs, colSpan: cs,
        type: BlockType.TITLE,
        style: undefined as any
      })
      console.log('final cross', finalTable);
    } else {
      // rowHeader with cell
      let colProcess = new Array(), colProcTrans = new Array()
      for(let i=0; i<crossSize; i++) {
        colProcess[i] = new Array()
        for(let j=rowDepth; j<crossDepth; j++) {
          colProcess[i].push({...interTable[i][j]})
        }
      }
      for(let i=0; i<rowSize; i++) {
        rowPart[i] = new Array()
        for(let j=0; j<rowDepth; j++) {
          rowPart[i].push({...interTable[i+colDepth][j]})
        }
      }

      // process column part
      for(let j=0; j<colSize; j++) {
        colProcTrans[j] = new Array()
        for(let i=0; i<colDepth; i++) {
          let tmp = colProcess[i][j]
          if(tmp.isUsed) {
            colProcess[i][j] ={isDelete: true}
            colProcTrans[j].push(colProcess[i][j])
            continue
          }
          if(tmp.value) {
            colProcess[i][j] = {
              value: tmp.value, 
              // source: tmp.source,
              sourceBlockId: tmp.sourceBlockId,
              rowSpan: tmp.rowSpan, 
              colSpan: tmp.colSpan,
              type: tmp.type,
              style: tmp.style
            }
          } else {
            colProcess[i][j] = {
              value: tmp.value, 
              // source: tmp.source,
              sourceBlockId: tmp.sourceBlockId,
              rowSpan: headKeyColSpan[i], 
              colSpan: 1,
              type: tmp.type,
              style: tmp.style
            }
          }
          colProcTrans[j].push({...colProcess[i][j]})
          for(let k=0; k<tmp.colSpan; k++) {
            colProcess[i][j+k].isUsed = true
          }
        }
        for(let i=colDepth; i<crossSize; i++) colProcTrans[j].push(colProcess[i][j])
      }
      let colInfo = {
        layersBias: layersColBias,
        cellLength: crossSize,
        tbClass: COLUM_TABLE,
        data: data.values,
        preVal: {},
      }
      gen_blank_facet_table(colProcTrans, columnHeader, colInfo, 0, 0)
      // console.log('transpose', colProcTrans);
      colProcess =  gen_final_table(colProcTrans, COLUM_TABLE)
      // console.log('col process', colProcess);
      for(let i=0; i<colDepth; i++) {
        // colPart[i] = colProcess[i]
        colPart[i] = new Array()
        for(let j=0; j<colProcess[i].length; j++) {
          colPart[i].push(colProcess[i][j])
          for(let k=1; k<colProcess[i][j].colSpan; k++) {
            colPart[i].push({isDelete: true})
          }
        }
        for(let j=0; j<rowDepth; j++) {
          colPart[i].unshift({
            rowSpan: headKeyColSpan[i], 
            colSpan: headKeyRowSpan[j]
          })
        }
      }
      // console.log('col part', colPart);

      // process raw part
      let maxLength = 0
      for(let i=0; i<rowSize; i++) {
        rowPart[i] = rowPart[i].concat(colProcess[i+colDepth])
        if(maxLength < rowPart[i].length) maxLength = rowPart[i].length
      }
      // console.log('row part', rowPart, maxLength);
      let rowProcess = new Array()
      for(let i=0; i<rowSize; i++) {
        rowProcess[i] = new Array()
        for(let j=0; j<rowDepth; j++) {
          let tmp = rowPart[i][j] 
          if(tmp.isUsed) {
            rowProcess[i].push({isDelete: true})
            continue
          }
          if(tmp.value) {
            rowProcess[i].push({
              value: tmp.value, 
              // source: tmp.source,
              sourceBlockId: tmp.sourceBlockId,
              rowSpan: tmp.rowSpan, 
              colSpan: tmp.colSpan,
              type: tmp.type,
              style: tmp.style
            })
          } else {
            rowProcess[i].push({
              value: tmp.value, 
              // source: tmp.source,
              sourceBlockId: tmp.sourceBlockId,
              rowSpan: 1, 
              colSpan: headKeyRowSpan[j],
              type: tmp.type,
              style: tmp.style
            })
          }
          for(let k=0; k<tmp.rowSpan; k++) {
            rowPart[i+k][j].isUsed = true
          }
        }
        for(let j=rowDepth; j<rowPart[i].length; j++) {
          rowProcess[i].push(rowPart[i][j])
        }
      }
      let rowInfo = {
        layersBias: layersRowBias,
        cellLength: maxLength,
        tbClass: ROW_TABLE,
        data: data.values,
        preVal: {},
        alignHeader: colPart,
      }
      gen_blank_facet_table(rowProcess, rowHeader, rowInfo, 0, 0)
      // console.log('new', rowProcess);
      rowPart =  gen_final_table(rowProcess, ROW_TABLE)
      // console.log('final', rowPart);
      for(let i=0; i<colPart.length; i++) {
        let tmp = colPart[i].slice(rowDepth)
        finalTable[i] = new Array()
        for(let j=0; j<tmp.length; j++) {
          if(!tmp[j].isDelete) finalTable[i].push(tmp[j])
        }
      }
      for(let i=0; i<rowPart.length; i++) {
        finalTable[i+colPart.length] = rowPart[i]
      }
      let rs = 0, cs = 0
      for(let i=0; i<colDepth; i++) rs += headKeyColSpan[i]
      for(let i=0; i<rowDepth; i++) cs += headKeyRowSpan[i]
      finalTable[0].unshift({
        value: undefined as any, 
        sourceBlockId: undefined as any,
        rowSpan: rs, colSpan: cs,
        type: BlockType.TITLE,
        style: undefined as any
      })
      console.log('final cross', finalTable);
    }
  }

  // finalTable = gen_valid_value_table(finalTable, tbClass, data.values, idDict)
  finalTable = gen_grid_merged_table(finalTable, idDict)
  let actTBClass = tbClass
  if(tbClass === CROSS_TABLE) {
    if(get_header_is_facet(rowHeader)) actTBClass = ROW_TABLE
    else if(get_header_is_facet(columnHeader)) actTBClass = COLUM_TABLE
  }
  finalTable = gen_facet_ME_table(finalTable, actTBClass, idDict)
  finalTable = gen_styled_table(finalTable, styles, idDict)
  console.log(rowDepth, colDepth, rowSize, colSize);
  console.log(idDict);

  return finalTable
}

const transform = (task: Spec) => {
  let { data, spec } = task;
  try {
    spec_init({data, spec})
  }
  catch(err) {
    console.log('Warning:', err.message);
    return new Array()
  }
  let { rowHeader, columnHeader, cell, styles, attrInfo } = spec
  
  // check table class
  let tableClass = ""
  if(rowHeader !== undefined && rowHeader.length > 0) {
    if(columnHeader !== undefined  && columnHeader.length > 0) tableClass = CROSS_TABLE
    else tableClass = ROW_TABLE
  } else {
    tableClass = COLUM_TABLE
  }

  return table_process(tableClass, data, {rowHeader, columnHeader, cell, attrInfo, styles})
}

const table2excel = ({table, url}) => {
  let rowLen = 0
  for(let t of table[0]) rowLen += t.colSpan
  let formatTable = Array.from({length: table.length}, () => new Array(rowLen))
  let useRecord = Array.from({length: table.length}, () => new Array(rowLen).fill(false))
  let wb = utils.book_new(), merges = new Array()

  for(let i=0; i<table.length; i++) {
    for(let j=0; j<table[i].length; j++) {
      let tmp = table[i][j], fixJ = j
      while(useRecord[i][fixJ]) fixJ++
      formatTable[i][fixJ] = tmp.value
      for(let p=0; p<tmp.rowSpan; p++) {
        for(let q=0; q<tmp.colSpan; q++) {
          // formatTable[i+p][fixJ+q] = tmp.value
          useRecord[i+p][fixJ+q] = true
        }
      }
      if(tmp.rowSpan>1 || tmp.colSpan>1) {
        merges.push({
          s: { r: i, c: fixJ },
          e: { r: i+tmp.rowSpan-1, c: fixJ+tmp.colSpan-1 }
        });
      } 
    }
  }
  let sheet = utils.aoa_to_sheet(formatTable)
  sheet['!merges'] = merges
  utils.book_append_sheet(wb, sheet, 'TableShop Output')
  writeFileXLSX(wb, url+'.xlsx')
}

const fill_header_spec = (val, extra, name="entity", depth=0) => {
  if(val[depth]===undefined) return undefined
  let spec = {
    attrName: `${name}${depth+1}`,
    blockId: genBid(),
    values: new Array(),
    children: new Array()
  }
  extra.pId = spec.blockId
  for(let v in val[depth]) spec.values.push(v)
  let cSpec = fill_header_spec(val, extra, name, depth+1)
  if(cSpec !== undefined) spec.children.push(cSpec)
  return spec
}

const parseTable = async (file: ArrayBuffer, mode: string) => {
  // let file = await (await fetch(url)).arrayBuffer()
  let wb = read(file), ws = wb.Sheets[wb.SheetNames[0]]
  console.log("workBook", wb)
  console.log("workSheet", ws)
  let data = utils.sheet_to_json(ws, {header: 1}) as any
  console.log("Raw Data", data);
  if(data.length === 0) return {}
  let spec = {
    rowHeader: new Array(),
    columnHeader: new Array(),
    cell: new Array(),
    data: new Array(),
  } 
  if(ws["!merges"]) {
    for(let {s, e} of ws["!merges"]) {
      if(data[s.r][s.c]) {
        let tmp = data[s.r][s.c]
        for(let i=s.r; i<=e.r; i++) {
          for(let j=s.c; j<=e.c; j++) data[i][j] = tmp
        }
      }
    }
  }
  if(mode === "crosstab") {
    let rowDepth = 1, colDepth = 0
    let cLen = 0, rLen = data.length
    for(let d of data) if(cLen < d.length) cLen = d.length
    if(data[0][0] === undefined) {
      let tmpR = 0, tmpC = 0
      for(let i=0; i<rLen; i++) {
        if(data[0][i] !== undefined) break
        tmpR++
      }
      for(let i=0; i<cLen; i++) {
        if(data[i][0] !== undefined) break
        tmpC++
      }
      rowDepth = tmpR, colDepth = tmpC
    } else {
      if(ws["!merges"]) {
        for(let {s, e} of ws["!merges"]) {
          if(s.r===0 && s.c===0) {
            rowDepth = e.c 
            colDepth = e.r
            break
          }
        }
      }
    }
    let rowVal = new Array(), colVal = new Array()
    for(let j=0; j<rowDepth; j++) {
      rowVal[j] = {}
      for(let i=colDepth; i<rLen; i++) {
        if(data[i][j]) rowVal[j][data[i][j]] = data[i][j]
      }
    }
    for(let i=0; i<colDepth; i++) {
      colVal[i] = {}
      for(let j=rowDepth; j<rLen; j++) {
        if(data[i][j]) colVal[i][data[i][j]] = data[i][j]
      }
    }
    console.log('object', rowVal, colVal);
    let extraR = {pId: undefined}, extraC = {pId: undefined}
    let rh = fill_header_spec(rowVal, extraR, "rowEntity"), ch = fill_header_spec(colVal, extraC, "colEntity")
    if(rh !== undefined) spec.rowHeader.push(rh)
    if(ch !== undefined) spec.columnHeader.push(ch)
    let c = {
      attrName: "cell1",
      blockId: genBid(),
      rowParentId: extraR.pId,
      colParentId: extraC.pId,
      dataType: DataType.CATEGORICAL,
      values: new Array()
    }
    for(let i=colDepth; i<rLen; i++) {
      for(let j=rowDepth; j<cLen; j++) {
        let tmp = {} as any
        if(!isNaN(Number(data[i][j]))) {
          c.dataType = DataType.NUMERICAL
          c.values.push(Number(data[i][j]))
          for(let k=0; k<rowDepth; k++) tmp[`rowEntity${k+1}`] = data[i][k]
          for(let k=0; k<colDepth; k++) tmp[`colEntity${k+1}`] = data[k][j]
          tmp[c.attrName] = Number(data[i][j])
          spec.data.push(tmp)
        } else {
          if(data[i][j]) {
            c.values.push(data[i][j])
            for(let k=0; k<rowDepth; k++) tmp[`rowEntity${k+1}`] = data[i][k]
            for(let k=0; k<colDepth; k++) tmp[`colEntity${k+1}`] = data[k][j]
            tmp[c.attrName] = data[i][j]
            spec.data.push(tmp)
          }
        }
      }
    }
    if(extraR.pId!==undefined || extraC.pId!==undefined) spec.cell.push(c)
  } else if(mode === "relational") {
    let rowDepth = 0, colDepth = 1
    let cLen = 0, rLen = data.length
    for(let d of data) if(cLen < d.length) cLen = d.length
    if(ws["!merges"]) {
      for(let {s, e} of ws["!merges"]) {
        if(s.r===0 && s.c===0) {
          colDepth = e.r
          break
        }
      }
    }
    if(data[0][0] === undefined) {
      let tmpR = 0
      for(let i=0; i<rLen; i++) {
        if(data[0][i] !== undefined) break
        tmpR++
      } 
      rowDepth = tmpR
    } else {
      rowDepth = cLen
      for(let j=0; j<cLen; j++) {
        let tmpDict = {} as any, flag = true
        for(let i=colDepth; i<rLen; i++) {
          if(tmpDict[data[i][j]]) {
            flag = false
            break
          }
          tmpDict[data[i][j]] = data[i][j]
        }
        if(flag) {
          rowDepth = j
          break
        }
      }
    }
    let rowVal = new Array(), colVal = new Array()
    for(let j=0; j<rowDepth; j++) {
      rowVal[j] = {}
      for(let i=colDepth; i<rLen; i++) {
        if(data[i][j]) rowVal[j][data[i][j]] = data[i][j]
      }
    }
    for(let i=0; i<colDepth; i++) {
      colVal[i] = {}
      for(let j=rowDepth; j<rLen; j++) {
        if(data[i][j]) colVal[i][data[i][j]] = data[i][j]
      }
    }
    console.log('object', rowVal, colVal);
    let extraR = {pId: undefined}, extraC = {pId: undefined}
    let rh = fill_header_spec(rowVal, extraR, "rowEntity"), ch = fill_header_spec(colVal, extraC, "colEntity")
    if(rh !== undefined) spec.rowHeader.push(rh)
    if(ch !== undefined) spec.columnHeader.push(ch)
    
    for(let j=rowDepth; j<cLen; j++) {
      let c = {
        attrName: `cell${j+1-rowDepth}`,
        blockId: genBid(),
        rowParentId: extraR.pId,
        colParentId: extraC.pId,
        dataType: DataType.CATEGORICAL,
        values: new Array()
      }
      for(let i=colDepth; i<rLen; i++) {
        let tmp = {} as any
        if(!isNaN(Number(data[i][j]))) {
          c.dataType = DataType.NUMERICAL
          c.values.push(Number(data[i][j]))
          for(let k=0; k<rowDepth; k++) tmp[`rowEntity${k+1}`] = data[i][k]
          for(let k=0; k<colDepth; k++) tmp[`colEntity${k+1}`] = data[k][j]
          tmp[c.attrName] = Number(data[i][j])
          spec.data.push(tmp)
        } else {
          if(data[i][j]) {
            c.values.push(data[i][j])
            for(let k=0; k<rowDepth; k++) tmp[`rowEntity${k+1}`] = data[i][k]
            for(let k=0; k<colDepth; k++) tmp[`colEntity${k+1}`] = data[k][j]
            tmp[c.attrName] = data[i][j]
            spec.data.push(tmp)
          }
        }
      }
      if(extraR.pId!==undefined || extraC.pId!==undefined) spec.cell.push(c)
    }
  }
  console.log('hd', spec);
  return spec
}

export {spec_init, transform, table2excel, parseTable}