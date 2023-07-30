'use strict';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var SourceTableFormat;
(function (SourceTableFormat) {
    SourceTableFormat["JSON"] = "json";
    SourceTableFormat["CSV"] = "csv";
})(SourceTableFormat || (SourceTableFormat = {}));
var DataType;
(function (DataType) {
    DataType["CATEGORICAL"] = "categorical";
    DataType["NUMERICAL"] = "numerical";
})(DataType || (DataType = {}));
// Block
var KEY_ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
var KEY_NUMERICAL = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
var KEY_ALPHABETIC = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
var Position;
(function (Position) {
    Position["EMBEDDED"] = "embedded";
    Position["LEFT"] = "left";
    Position["RIGHT"] = "right";
    Position["TOP"] = "top";
    Position["BOTTOM"] = "bottom";
})(Position || (Position = {}));
var Pattern;
(function (Pattern) {
    Pattern["ROMAN"] = "I";
    Pattern["NUMERICAL"] = "1";
    Pattern["ALPHABETIC"] = "A";
})(Pattern || (Pattern = {}));
// function
var FUNC_SUM = "sum";

var CROSS_TABLE = "cross table";
var ROW_TABLE = "row table";
var COLUM_TABLE = "column table";

var header_fill = function (attrInfo, header) {
    var _a, _b, _c, _d, _e;
    if (header !== undefined) {
        var _loop_1 = function (hb) {
            hb.entityMerge = (_a = hb.entityMerge) !== null && _a !== void 0 ? _a : false;
            hb.gridMerge = (_b = hb.gridMerge) !== null && _b !== void 0 ? _b : true;
            hb.facet = (_c = hb.facet) !== null && _c !== void 0 ? _c : 1;
            hb.blankLine = (_d = hb.blankLine) !== null && _d !== void 0 ? _d : false;
            if (hb.key && Object.keys(hb.key).length === 0)
                hb.key = undefined;
            hb.style = "TODO";
            if (hb.function !== undefined) {
                if (hb.function === FUNC_SUM)
                    hb.values = [FUNC_SUM];
                else
                    hb.values = ["Function(Unknown)"];
                return "continue";
            }
            var attr = attrInfo.find(function (obj) {
                return obj.name == hb.attrName;
            });
            hb.values = (_e = hb.values) !== null && _e !== void 0 ? _e : attr.values;
            header_fill(attrInfo, hb.children);
        };
        for (var _i = 0, header_1 = header; _i < header_1.length; _i++) {
            var hb = header_1[_i];
            _loop_1(hb);
        }
    }
};
// init spec default value
var spec_init = function (task) {
    var _a = task.spec, rowHeader = _a.rowHeader, columnHeader = _a.columnHeader, cell = _a.cell, styles = _a.styles, attrInfo = _a.attrInfo;
    // make sure the header can not be both undefined
    if (rowHeader === undefined && columnHeader === undefined) {
        throw new Error("RowHeader and ColumnHeader can not be both undefined!");
    }
    else {
        for (var _i = 0, _b = [rowHeader, columnHeader]; _i < _b.length; _i++) {
            var header = _b[_i];
            header_fill(attrInfo, header);
        }
        for (var _c = 0, cell_1 = cell; _c < cell_1.length; _c++) {
            var c = cell_1[_c];
            c.style = "TODO2";
        }
        if (styles !== undefined) {
            for (var _d = 0, styles_1 = styles; _d < styles_1.length; _d++) {
                var s = styles_1[_d];
                s.indent = '\t';
            }
        }
    }
};
// compute dimension(depth) of rowHeader/columnHeader
var calc_head_depth = function (channel) {
    if (!channel || channel.length == 0)
        return 0;
    var depth = 1;
    for (var _i = 0, channel_1 = channel; _i < channel_1.length; _i++) {
        var hb = channel_1[_i];
        if (hb.children) {
            var selfDepth = hb.entityMerge ? 0 : 1;
            var d = calc_head_depth(hb.children);
            depth = (d + selfDepth > depth) ? d + selfDepth : depth;
        }
    }
    return depth;
};
// compute value counts(size) of rowHeader/columnHeader
var calc_head_size = function (channel) {
    if (!channel || channel.length == 0)
        return 0;
    var size = 0;
    for (var _i = 0, channel_2 = channel; _i < channel_2.length; _i++) {
        var hb = channel_2[_i];
        if (hb.entityMerge) {
            size += hb.values.length;
            for (var _a = 0, _b = hb.values; _a < _b.length; _a++) {
                _b[_a];
                size += calc_head_size(hb.children);
            }
        }
        else {
            var s = hb.children ? calc_head_size(hb.children) : 1;
            size += s * (hb.values.length);
        }
    }
    return size;
};
// compute each depth span length
var calc_head_span = function (channel, headSpan, depth, d, preLen) {
    if (headSpan === void 0) { headSpan = []; }
    if (depth === void 0) { depth = 0; }
    if (d === void 0) { d = 0; }
    if (preLen === void 0) { preLen = 1; }
    if (!channel || channel.length == 0)
        return 0;
    if (headSpan[depth][d])
        headSpan[depth][d] = headSpan[depth][d] < preLen ? preLen : headSpan[depth][d];
    else
        headSpan[depth][d] = preLen;
    for (var _i = 0, channel_3 = channel; _i < channel_3.length; _i++) {
        var hb = channel_3[_i];
        var delta = hb.entityMerge ? 0 : 1;
        var len = hb.entityMerge ? preLen + 1 : 1;
        calc_head_span(hb.children, headSpan, depth + delta, d + 1, len);
    }
};
var calc_current_key_layer = function (channel, tableClass) {
    var beforeLayer = 0, afterLayer = 0;
    if (tableClass === ROW_TABLE) {
        for (var _i = 0, channel_5 = channel; _i < channel_5.length; _i++) {
            var hb = channel_5[_i];
            if (hb.key && hb.key.position === Position.LEFT)
                beforeLayer = 1;
            if (hb.key && hb.key.position === Position.RIGHT)
                afterLayer = 1;
        }
    }
    else if (tableClass === COLUM_TABLE) {
        for (var _a = 0, channel_6 = channel; _a < channel_6.length; _a++) {
            var hb = channel_6[_a];
            if (hb.key && hb.key.position === Position.TOP)
                beforeLayer = 1;
            if (hb.key && hb.key.position === Position.BOTTOM)
                afterLayer = 1;
        }
    }
    var beforeBias = beforeLayer, afterBias = afterLayer;
    return [beforeLayer + afterLayer, beforeBias, afterBias];
};
var calc_each_key_layer = function (channel, layersBias, depth, tableClass) {
    if (layersBias === void 0) { layersBias = []; }
    if (depth === void 0) { depth = 0; }
    if (tableClass === void 0) { tableClass = ROW_TABLE; }
    if (!channel || channel.length == 0)
        return;
    var _a = calc_current_key_layer(channel, tableClass), leftBias = _a[1], rightBias = _a[2];
    if (layersBias[depth] === undefined)
        layersBias[depth] = [leftBias, rightBias];
    else {
        layersBias[depth][0] = layersBias[depth][0] < leftBias ? leftBias : layersBias[depth][0];
        layersBias[depth][1] = layersBias[depth][1] < rightBias ? rightBias : layersBias[depth][1];
    }
    for (var _i = 0, channel_7 = channel; _i < channel_7.length; _i++) {
        var hb = channel_7[_i];
        calc_each_key_layer(hb.children, layersBias, depth + (hb.entityMerge ? 0 : 1), tableClass);
    }
};
// TODO: fix structure judge
var get_structure_type = function (channel) {
    if (!channel || channel.length == 0)
        throw new Error("Header can not be undefined");
    var hb0 = channel[0], facetList = Array.from({ length: 2 }, function () { return new Array(); });
    var blankList = new Array();
    for (var _i = 0, channel_8 = channel; _i < channel_8.length; _i++) {
        var hb = channel_8[_i];
        facetList[0].push(hb.facet);
        facetList[1].push(hb.values.length / hb.facet);
        blankList.push(hb.blankLine);
    }
    return {
        entityMerge: hb0.entityMerge,
        gridMerge: hb0.gridMerge,
        facet: facetList,
        blankLine: blankList
    };
};
var get_cell_val = function (preVal, data, key) {
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var d = data_1[_i];
        var flag = true;
        for (var k in preVal) {
            if (d[k] !== preVal[k]) {
                flag = false;
                break;
            }
        }
        if (flag)
            return d[key];
    }
    return undefined;
};
var get_key = function (key, level, preKey) {
    if (!key)
        return '';
    var nowKey = '';
    if (key.pattern === Pattern.ROMAN) {
        nowKey = KEY_ROMAN[level];
    }
    else if (key.pattern === Pattern.NUMERICAL) {
        nowKey = KEY_NUMERICAL[level];
    }
    else if (key.pattern === Pattern.ALPHABETIC) {
        nowKey = KEY_ALPHABETIC[level];
    }
    return (key.isInherited && preKey !== '') ? [preKey, nowKey].join('.') : nowKey;
};
// Aggregate Function
// TODO: add more function
var aggregate_use = function (preVal, data, key, funcName) {
    if (funcName === void 0) { funcName = FUNC_SUM; }
    if (funcName === FUNC_SUM)
        return aggregate_sum(preVal, data, key);
};
var aggregate_sum = function (preVal, data, key) {
    var ans = 0, cnt = 0;
    for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
        var d = data_2[_i];
        var flag = true;
        for (var k in preVal) {
            if (d[k] !== preVal[k]) {
                flag = false;
                break;
            }
        }
        if (flag) {
            cnt++;
            ans += d[key];
        }
    }
    if (cnt === 0)
        return undefined;
    return ans;
};
// check cell type which used for agg function
var agg_type_check = function (attrInfo, attrName) {
    var attr = attrInfo.find(function (obj) {
        return obj.name == attrName;
    });
    if (attr && attr.dataType === DataType.NUMERICAL)
        return true;
    return false;
};
// generate intermediate row table
var gen_inter_row_table = function (interRowTable, rowHeader, extra, width, depth, outerX, bias, isPreMerge, isRoot, preKey, keyBias) {
    var _a;
    if (bias === void 0) { bias = 0; }
    if (isPreMerge === void 0) { isPreMerge = false; }
    if (isRoot === void 0) { isRoot = true; }
    if (preKey === void 0) { preKey = ''; }
    if (keyBias === void 0) { keyBias = 0; }
    if (rowHeader === undefined)
        return 1;
    var innerX = 0, rhId = -1;
    var leftBias = 0, rightBias = 0;
    var _b = extra.layersBias[depth], lb = _b[0], rb = _b[1];
    leftBias = lb, rightBias = rb;
    var currentKeyLayer = leftBias + rightBias;
    for (var _i = 0, rowHeader_1 = rowHeader; _i < rowHeader_1.length; _i++) {
        var rh = rowHeader_1[_i];
        var isLeaf = rh.children ? false : true;
        rh.blockId; var source = (_a = rh.attrName) !== null && _a !== void 0 ? _a : rh.function;
        var headerDepth = depth + keyBias + leftBias, keyDepth = headerDepth;
        var isKeyEmbedded = false;
        if (rh.key && rh.key.position === Position.LEFT)
            keyDepth = headerDepth - 1;
        if (rh.key && rh.key.position === Position.RIGHT)
            keyDepth = headerDepth + 1;
        if (rh.key && rh.key.position === Position.EMBEDDED)
            isKeyEmbedded = true;
        rhId++;
        for (var i = 0; i < rh.values.length; i++) {
            var iterCount = void 0, key = rh.key ? get_key(rh.key, i, preKey) : '';
            var headValue = isKeyEmbedded ? key + ' ' + rh.values[i] : rh.values[i];
            var span = extra.headSpan[depth];
            var keyData = {
                value: key,
                source: '@KEY',
                rowSpan: 1, colSpan: 1,
                isUsed: false,
                isLeaf: isLeaf,
                isKey: true,
                style: 'KEY STYLE'
            };
            extra.preVal[source] = rh.values[i];
            if (rh.entityMerge) {
                iterCount = gen_inter_row_table(interRowTable, rh.children, extra, width, depth, outerX + innerX + 1, bias, rh.entityMerge, false, key, keyBias);
            }
            else {
                iterCount = gen_inter_row_table(interRowTable, rh.children, extra, width, depth + 1, outerX + innerX, bias, rh.entityMerge, false, key, currentKeyLayer + keyBias);
            }
            if (innerX + outerX + iterCount > width) {
                console.log('Error', innerX, outerX, iterCount);
                throw new Error("Over rowHeader width!");
            }
            if (isRoot) {
                extra.rootSpan[rhId].push(iterCount);
                extra.rootIdList[rhId].push(innerX);
            }
            // process entities merged
            if (rh.entityMerge) {
                interRowTable[innerX + outerX + bias][keyDepth] = keyData;
                interRowTable[innerX + outerX + bias][headerDepth] = {
                    value: headValue,
                    source: source,
                    rowSpan: 1, colSpan: span,
                    isUsed: false,
                    isLeaf: isLeaf,
                    isKey: false,
                    style: rh.style
                };
                // process cells unmerged
            }
            else if (!rh.gridMerge) {
                interRowTable[innerX + outerX + bias][keyDepth] = keyData;
                interRowTable[innerX + outerX + bias][headerDepth] = {
                    value: headValue,
                    source: source,
                    rowSpan: 1, colSpan: span,
                    isUsed: false,
                    isLeaf: isLeaf,
                    isKey: false,
                    style: rh.style
                };
                // process cells merged
            }
            else {
                keyData.rowSpan = iterCount;
                for (var j = 0; j < iterCount; j++) {
                    interRowTable[innerX + outerX + j + bias][keyDepth] = keyData;
                    interRowTable[innerX + outerX + j + bias][headerDepth] = {
                        value: headValue,
                        source: source,
                        rowSpan: iterCount, colSpan: span,
                        isUsed: false,
                        isLeaf: isLeaf,
                        isKey: false,
                        style: rh.style
                    };
                }
            }
            // process cell unit
            if (isLeaf) {
                for (var _c = 0, _d = extra.cell; _c < _d.length; _c++) {
                    var c = _d[_c];
                    if (c.rowParentId == rh.blockId) {
                        // process function cell
                        if (rh.function) {
                            if (!agg_type_check(extra.attrInfo, c.attrName))
                                throw new Error("Function can only be used to numerical>");
                            delete extra.preVal[source];
                            extra.cellTable[innerX + outerX + bias].push({
                                value: aggregate_use(extra.preVal, extra.data, c.attrName, FUNC_SUM),
                                source: c.attrName,
                                style: c.style
                            });
                            // Process attr cell
                        }
                        else {
                            extra.cellTable[innerX + outerX + bias].push({
                                value: get_cell_val(extra.preVal, extra.data, c.attrName),
                                source: c.attrName,
                                style: c.style
                            });
                        }
                    }
                }
            }
            innerX += iterCount;
            delete extra.preVal[source];
        }
    }
    return innerX + (isPreMerge ? 1 : 0);
};
var gen_blank_facet_table = function (rawTable, header, info, depth, outerX, bias, isPreMerge, keyBias) {
    var _a, _b;
    if (bias === void 0) { bias = 0; }
    if (isPreMerge === void 0) { isPreMerge = false; }
    if (keyBias === void 0) { keyBias = 0; }
    if (header === undefined)
        return [1, info.cellLength, 1, 0];
    var innerX = 0, maxLen = info.cellLength, facetSpan = 0, blankLine = 0;
    var _c = info.layersBias[depth], beforeBias = _c[0], afterBias = _c[1];
    var keyLayer = beforeBias + afterBias;
    for (var _i = 0, header_2 = header; _i < header_2.length; _i++) {
        var hd = header_2[_i];
        var start = innerX + outerX + bias, subFacetSpan = 0;
        for (var i = 0; i < hd.values.length; i++) {
            var iterCount = 1, len = info.cellLength, tmpFacetSpan = 1, blank = 0;
            var x = innerX + outerX + bias, y = depth + keyBias;
            if (hd.entityMerge) {
                _a = gen_blank_facet_table(rawTable, hd.children, info, depth, outerX + innerX + 1, bias, hd.entityMerge, keyBias), iterCount = _a[0], len = _a[1], tmpFacetSpan = _a[2], blank = _a[3];
            }
            else {
                _b = gen_blank_facet_table(rawTable, hd.children, info, depth + 1, outerX + innerX, bias, hd.entityMerge, keyBias + keyLayer), iterCount = _b[0], len = _b[1], tmpFacetSpan = _b[2], blank = _b[3];
            }
            for (var j = 0; j < iterCount; j++) {
                // console.log('xxxxxx',  info.oldTable[x+j][y+beforeBias].value, x+j, y+beforeBias);
                if (rawTable[x + j][y + beforeBias] !== undefined && !hd.entityMerge && hd.gridMerge) {
                    if (info.tbClass === ROW_TABLE) {
                        if (beforeBias > 0)
                            rawTable[x + j][y].rowSpan = tmpFacetSpan + blank;
                        rawTable[x + j][y + beforeBias].rowSpan = tmpFacetSpan + blank;
                        if (afterBias > 0)
                            rawTable[x + j][y + beforeBias + afterBias].rowSpan = tmpFacetSpan + blank;
                    }
                    else if (info.tbClass === COLUM_TABLE) {
                        if (beforeBias > 0)
                            rawTable[x + j][y].colSpan = tmpFacetSpan + blank;
                        rawTable[x + j][y + beforeBias].colSpan = tmpFacetSpan + blank;
                        if (afterBias > 0)
                            rawTable[x + j][y + beforeBias + afterBias].colSpan = tmpFacetSpan + blank;
                    }
                }
                if (rawTable[x + j][y + beforeBias] !== undefined && j === 0 && hd.blankLine) {
                    if (beforeBias > 0)
                        rawTable[x + j][y].hasBlank = true;
                    rawTable[x + j][y + beforeBias].hasBlank = true;
                    if (afterBias > 0)
                        rawTable[x + j][y + beforeBias + afterBias].hasBlank = true;
                }
            }
            if (hd.facet > 1) {
                var copyLen = len - y;
                var group = i % hd.facet;
                // console.log('Bi', group, innerX, hd.facet);
                for (var j = 0; j < iterCount; j++) {
                    for (var k = 0; k < copyLen; k++) {
                        var tarX = start + Math.floor(i / hd.facet) * iterCount + j, tarY = y + k + group * copyLen;
                        rawTable[tarX][tarY] = rawTable[x + j][y + k];
                        if (rawTable[x + j][y + k] !== undefined && (tarX !== x + j || tarY !== y + k))
                            rawTable[x + j][y + k] = { isDelete: true };
                        // console.log('Ai', start+Math.floor(i/hd.facet)*iterCount+j, y+k+group*copyLen, x+j, y+k);
                    }
                }
                var delta = (hd.facet - 1) * copyLen;
                len += delta;
            }
            innerX += iterCount;
            if (maxLen < len)
                maxLen = len;
            subFacetSpan += tmpFacetSpan;
        }
        if (hd.facet > 1)
            subFacetSpan = Math.ceil(subFacetSpan / hd.facet);
        facetSpan += subFacetSpan;
        if (hd.blankLine)
            blankLine += Math.ceil(hd.values.length / hd.facet);
    }
    var delta1 = isPreMerge ? 1 : 0, delta2 = isPreMerge ? 0 : 1;
    return [innerX + delta1, maxLen + delta2, facetSpan + delta1, blankLine];
};
var gen_final_table = function (table, tableClass, entityFlag) {
    var finalTable = new Array(); new Array(); new Array();
    var maxLength = 0;
    // for(let i=0; i<table.length; i++) {
    //   if(maxLength < table[i].length) maxLength = table[i].length
    //   if(entityFlag) {
    //     let tmpSpan = 0
    //     if(tableClass === ROW_TABLE) for(let t of table[i]) tmpSpan += t.colSpan
    //     else if(tableClass === COLUM_TABLE) for(let t of table[i]) tmpSpan += t.rowSpan
    //     maxSpan = maxSpan > tmpSpan ? maxSpan : tmpSpan
    //   }
    //   lenList.push(table[i].length)
    //   usedRecord.push(0)
    // }
    var h = 0, oldLen = table.length;
    var spanList = new Array();
    for (var i = 0; i < oldLen; i++) {
        var isDelete = true;
        for (var j = 0; j < table[h].length; j++) {
            if (table[h][j] === undefined || table[h][j].isDelete)
                continue;
            if (tableClass === ROW_TABLE)
                spanList[j] = table[h][j].colSpan;
            else if (tableClass === COLUM_TABLE)
                spanList[j] = table[h][j].rowSpan;
            isDelete = false;
        }
        if (isDelete)
            table.splice(h, 1);
        else {
            if (table[h].length > maxLength)
                maxLength = table[h].length;
            h++;
        }
    }
    console.log('span list', spanList);
    // fill different length
    for (var _i = 0, table_1 = table; _i < table_1.length; _i++) {
        var t = table_1[_i];
        var resLen = maxLength - t.length, tmp = t.length;
        for (var i = 0; i < resLen; i++) {
            if (tableClass === ROW_TABLE)
                t.push({ rowSpan: 1, colSpan: spanList[i + tmp] });
            else if (tableClass === COLUM_TABLE)
                t.push({ rowSpan: spanList[i + tmp], colSpan: 1 });
        }
    }
    var locMap = new Array(maxLength).fill(0);
    for (var i = 0; i < table.length; i++) {
        var t = table[i], isBlank = false;
        if (finalTable[i] === undefined)
            finalTable[i] = new Array();
        for (var j = 0; j < table[i].length; j++) {
            if (table[i][j] === undefined) {
                if (i + 1 >= table.length)
                    throw new Error("Final Table: Over Boundary");
                if (isBlank) {
                    if (finalTable[locMap[j]] === undefined)
                        finalTable[locMap[j]] = new Array();
                    finalTable[locMap[j]].push({ rowSpan: 1, colSpan: table[i + 1][j].colSpan });
                    locMap[j]++;
                }
                finalTable[locMap[j]].push({ rowSpan: 1, colSpan: table[i + 1][j].colSpan });
                locMap[j]++;
            }
            else if (!table[i][j].isDelete) {
                if (table[i][j].hasBlank) {
                    delete table[i][j].hasBlank;
                    isBlank = true;
                }
                if (isBlank) {
                    if (finalTable[locMap[j]] === undefined)
                        finalTable[locMap[j]] = new Array();
                    finalTable[locMap[j]].push({ rowSpan: 1, colSpan: table[i][j].colSpan });
                    locMap[j]++;
                }
                if (finalTable[locMap[j]] === undefined)
                    finalTable[locMap[j]] = new Array();
                finalTable[locMap[j]].push(table[i][j]);
                locMap[j] += table[i][j].rowSpan;
            }
        }
    }
    // if(tableClass === ROW_TABLE) {
    //   for(let i=0; i<table.length; i++) {
    //     if(lenList[i] === 0) table[i].push({
    //       value: undefined as any,
    //       source: undefined as any,
    //       rowSpan: 1,
    //       colSpan: entityFlag ? maxSpan : maxLength,
    //       style: undefined as any
    //     })
    //   }
    //   finalTable = table
    // } else if(tableClass === COLUM_TABLE) {
    //   for(let i=0; i<maxLength; i++) {
    //     finalTable[i] = new Array()
    //     let addCnt = 0
    //     for(let j=0; j<table.length; j++) {
    //       if(lenList[j] === 0) {
    //         finalTable[i].push({
    //           value: undefined as any,
    //           source: undefined as any,
    //           rowSpan: entityFlag ? maxSpan : maxLength,
    //           colSpan: 1,
    //           style: undefined as any
    //         })
    //         lenList[j]--
    //         addCnt++
    //       }
    //       let tmp = usedRecord[j]
    //       if(lenList[j]>0 && tmp<lenList[j]) {
    //         // console.log('kkk', i, j, usedRecord);
    //         usedRecord[j]++
    //         if(table[j][tmp].isSkip) continue
    //         finalTable[i].push(table[j][tmp])
    //         addCnt++
    //         if(entityFlag && table[j][tmp].rowSpan>1) {
    //           for(let k=1; k<table[j][tmp].rowSpan; k++) {
    //             table[j].splice(tmp+1, 0, {isSkip: true})
    //             lenList[j]++
    //           }
    //         } 
    //         j += table[j][tmp].colSpan-1
    //       }
    //     }
    //     // console.log('cnt', addCnt);
    //     if(addCnt === 0) i--
    //   }
    // }
    return finalTable;
};
var table_process = function (tbClass, data, _a) {
    var rowHeader = _a.rowHeader, columnHeader = _a.columnHeader, cell = _a.cell, attrInfo = _a.attrInfo;
    var interTable, processTable = new Array();
    var finalTable = [];
    var rowDepth = calc_head_depth(rowHeader);
    var colDepth = calc_head_depth(columnHeader);
    var rowSize = calc_head_size(rowHeader);
    var colSize = calc_head_size(columnHeader);
    if (tbClass == ROW_TABLE) {
        var flag = get_structure_type(rowHeader);
        var headTmpSpan = Array.from({ length: rowDepth }, function () { return ({}); });
        var headSpan = new Array(rowDepth).fill(1);
        calc_head_span(rowHeader, headTmpSpan);
        console.log('head tmp span', headTmpSpan);
        for (var i = 0; i < headTmpSpan.length; i++) {
            var hts = headTmpSpan[i];
            for (var k in hts)
                if (hts[k] > headSpan[i])
                    headSpan[i] = hts[k];
        }
        console.log('head span', headSpan);
        var layersBias = [], totalLayer = 0;
        calc_each_key_layer(rowHeader, layersBias, 0, tbClass);
        for (var _i = 0, layersBias_1 = layersBias; _i < layersBias_1.length; _i++) {
            var lb = layersBias_1[_i];
            totalLayer += lb[0] + lb[1];
        }
        rowDepth += totalLayer;
        console.log('layers bias', layersBias);
        console.log('total layer', totalLayer);
        var headKeySpan = new Array();
        for (var i = 0; i < headSpan.length; i++) {
            if (layersBias[i][0] > 0)
                headKeySpan.push(1);
            headKeySpan.push(headSpan[i]);
            if (layersBias[i][1] > 0)
                headKeySpan.push(1);
        }
        console.log("head key span", headKeySpan);
        var extra = __assign(__assign({}, flag), { preVal: {}, data: data.values, cell: cell, cellTable: Array.from({ length: rowSize }, function () { return new Array(); }), attrInfo: attrInfo, rootSpan: Array.from({ length: rowHeader.length }, function () { return new Array(); }), rootIdList: Array.from({ length: rowHeader.length }, function () { return new Array(); }), layersBias: layersBias, headSpan: headSpan });
        interTable = Array.from({ length: rowSize }, function () { return new Array(rowDepth)
            .fill(null).map(function (_) { return ({ rowSpan: 1, colSpan: 1 }); }); });
        gen_inter_row_table(interTable, rowHeader, extra, rowSize, 0, 0);
        // console.log('@@@', interTable);
        var maxLength = 0, tmpLength = [];
        // console.log('cell', extra.cellTable);
        for (var i = 0; i < rowSize; i++) {
            processTable[i] = [], tmpLength[i] = 0;
            for (var j = 0; j < rowDepth; j++) {
                var tmp = interTable[i][j];
                if (tmp.isUsed) {
                    processTable[i].push({ isDelete: true });
                    continue;
                }
                if (tmp.value) {
                    processTable[i].push({
                        value: tmp.value,
                        source: tmp.source,
                        rowSpan: tmp.rowSpan,
                        colSpan: tmp.colSpan,
                        style: tmp.style
                    });
                }
                else {
                    processTable[i].push({
                        value: tmp.value,
                        source: tmp.source,
                        rowSpan: 1,
                        colSpan: headKeySpan[j],
                        style: tmp.style
                    });
                }
                for (var k = 0; k < tmp.rowSpan; k++) {
                    interTable[i + k][j].isUsed = true;
                }
            }
            for (var _b = 0, _c = extra.cellTable[i]; _b < _c.length; _b++) {
                var c = _c[_b];
                tmpLength[i]++;
                processTable[i].push({
                    value: c.value,
                    source: c.source,
                    rowSpan: 1,
                    colSpan: 1,
                    style: c.style
                });
            }
            maxLength = maxLength > tmpLength[i] ? maxLength : tmpLength[i];
        }
        // fill empty unit
        for (var i = 0; i < processTable.length; i++) {
            var resLength = maxLength - tmpLength[i];
            for (var j = 0; j < resLength; j++)
                processTable[i].push({
                    value: undefined,
                    source: undefined,
                    rowSpan: 1,
                    colSpan: 1,
                    style: undefined
                });
        }
        // process blankLine and facet structure
        var info = {
            layersBias: layersBias,
            cellLength: maxLength + rowDepth,
            tbClass: tbClass,
            // oldTable: JSON.parse(JSON.stringify(processTable))
        };
        // console.log('!!!', processTable);
        gen_blank_facet_table(processTable, rowHeader, info, 0, 0);
        console.log('new', processTable);
        finalTable = gen_final_table(processTable, tbClass);
        console.log('final', finalTable);
        // // console.log('XXX', processTable);
        // console.log('YYY', finalTable);
        // console.log('final', gen_final_table(finalTable, tbClass, flag.entityMerge));
    }
    // else if(tbClass == COLUM_TABLE) {
    //   let oldColDepth = colDepth
    //   let flag = get_structure_type(columnHeader)
    //   if(flag.entityMerge) { 
    //     colSize = calc_head_size(columnHeader, true)
    //     // colDepth = flag.expand ? 2 : 1
    //   } 
    //   // colDepth += calc_overall_key_layer(columnHeader, flag.entityMerge, tbClass)
    //   let layersBias = [], totalLayer = 0
    //   calc_each_key_layer(columnHeader, layersBias, 0, flag.entityMerge, tbClass)
    //   if(flag.entityMerge) {
    //     totalLayer = layersBias[0] + layersBias[1]
    //   } else {
    //     for(let lb of layersBias) totalLayer += lb[0] + lb[1]
    //   }
    //   colDepth += totalLayer
    //   console.log('layers bias', layersBias);
    //   console.log('total layer', totalLayer);
    //   let extra = {
    //     ...flag,
    //     preVal: {},
    //     data: data.values,
    //     cell, 
    //     cellTable: Array.from({length: colSize}, () => new Array()),
    //     attrInfo,
    //     rootSpan: Array.from({length: columnHeader.length}, () => new Array()),
    //     rootIdList: Array.from({length: columnHeader.length}, () => new Array()),
    //     depth: oldColDepth,
    //     layersBias
    //   }
    //   interTable = Array.from({length: colDepth}, () => new Array(colSize)
    //                 .fill(null).map(_ => ({rowSpan: 1, colSpan: 1})))
    //   gen_inter_column_table(interTable, columnHeader, extra, colSize, 0, 0)
    //   let cell_length = 0
    //   // if(flag.expand) {
    //   //   for(let ct of extra.cellTable) cell_length = (cell_length>ct.length) ? cell_length : ct.length
    //   // }
    //   console.log('@@', interTable);
    //   let maxLength = 0, tmpLength: number[] = []
    //   for(let j=0; j<colSize; j++) {
    //     processTable[j] = [], tmpLength[j] = 0
    //     for(let i=0; i<colDepth; i++) {
    //       let tmp = interTable[i][j]
    //       if(tmp.isUsed) continue
    //       // if(flag.entityMerge && flag.expand && tmp.isDelete) continue
    //       // if(flag.entityMerge && flag.expand && tmp.isLeaf===false &&
    //       //    tmp.isKey===false) tmp.rowSpan = cell_length
    //       if(tmp.value) {
    //         processTable[j].push({
    //           value: tmp.value, 
    //           source: tmp.source,
    //           rowSpan: tmp.rowSpan, 
    //           colSpan: tmp.colSpan,
    //           style: tmp.style
    //         })
    //       } else {
    //         processTable[j].push({
    //           value: tmp.value, 
    //           source: tmp.source,
    //           rowSpan: tmp.rowSpan, 
    //           colSpan: 1,
    //           style: tmp.style
    //         })
    //       }
    //       for(let k=0; k<tmp.colSpan; k++) {
    //         interTable[i][j+k].isUsed = true
    //       }
    //     }
    //     if(flag.entityMerge) for(let p of processTable[j]) tmpLength[j] += p.rowSpan
    //     else tmpLength[j] = colDepth
    //     for(let c of extra.cellTable[j]) {
    //       tmpLength[j]++
    //       processTable[j].push({
    //         value: c.value,
    //         source: c.source,
    //         rowSpan: 1,
    //         colSpan: 1,
    //         style: c.style
    //       })
    //     }
    //     // console.log('len', tmpLength[j], tmpLength[j]-extra.cellTable[j].length);
    //     maxLength = maxLength>tmpLength[j] ? maxLength : tmpLength[j]
    //   }
    //   // fill empty unit
    //   for(let i=0; i<processTable.length; i++) {
    //     let resLength = maxLength - tmpLength[i]
    //     for(let j=0; j<resLength; j++) processTable[i].push({
    //         value: undefined as any,
    //         source: undefined as any,
    //         rowSpan: 1,
    //         colSpan: 1,
    //         style: undefined as any
    //     })
    //   }
    //   // process blank line
    //   let blankBias = 0
    //   for(let i=0; i<columnHeader.length; i++) {
    //     if(flag.blankLine[i]) {
    //       let rootIdList = extra.rootIdList[i]
    //       for(let j=0; j<rootIdList.length; j++) {
    //         processTable.splice(rootIdList[j]+blankBias, 0, [])
    //         extra.rootSpan[i][j]++
    //         blankBias++
    //       }
    //     }
    //   }
    //   // process facet structure
    //   let rootSpan = extra.rootSpan
    //   let preH = 0, processH = 0
    //   for(let i=0; i<columnHeader.length; i++) {
    //     let facetLen = flag.facet[1][i]
    //     rootSpan[i] = rootSpan[i].reduce((newSpan, _, idx, arr) => {
    //       if(idx % facetLen === 0) {
    //         let sum = 0
    //         for(let i=0; i<facetLen; i++) sum += arr[idx+i]
    //         newSpan.push(sum)
    //       }
    //       return newSpan
    //     }, [])
    //     for(let j=0; j<rootSpan[i].length; j++) {
    //       for(let k=0; k<rootSpan[i][j]; k++) {
    //         if(!finalTable[preH+k]) finalTable[preH+k] = []
    //         finalTable[preH+k] = finalTable[preH+k].concat(processTable[processH+k])
    //       }
    //       processH += rootSpan[i][j]
    //     }
    //     preH += rootSpan[i][0]
    //   }
    //   // console.log('XX', processTable);
    //   console.log('YY', finalTable);
    //   console.log('final',gen_final_table(finalTable, tbClass, flag.entityMerge))
    // } else {
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
    // }
    console.log(rowDepth, colDepth, rowSize, colSize);
};
var transform = function (task) {
    var data = task.data, spec = task.spec;
    spec_init({ data: data, spec: spec });
    var rowHeader = spec.rowHeader, columnHeader = spec.columnHeader, cell = spec.cell; spec.styles; var attrInfo = spec.attrInfo;
    // check table class
    var tableClass = "";
    if (rowHeader !== undefined) {
        if (columnHeader !== undefined)
            tableClass = CROSS_TABLE;
        else
            tableClass = ROW_TABLE;
    }
    else {
        tableClass = COLUM_TABLE;
    }
    table_process(tableClass, data, { rowHeader: rowHeader, columnHeader: columnHeader, cell: cell, attrInfo: attrInfo });
};

var utils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    spec_init: spec_init,
    transform: transform
});

var index = { utils: utils };

module.exports = index;
