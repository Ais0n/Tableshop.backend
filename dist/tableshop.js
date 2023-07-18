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
    var _a, _b, _c, _d, _e, _f;
    if (header !== undefined) {
        var _loop_1 = function (hb) {
            hb.entityMerge = (_a = hb.entityMerge) !== null && _a !== void 0 ? _a : false;
            hb.gridMerge = (_b = hb.gridMerge) !== null && _b !== void 0 ? _b : true;
            hb.expand = (_c = hb.expand) !== null && _c !== void 0 ? _c : false;
            hb.facet = (_d = hb.facet) !== null && _d !== void 0 ? _d : 1;
            hb.blankLine = (_e = hb.blankLine) !== null && _e !== void 0 ? _e : false;
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
            hb.values = (_f = hb.values) !== null && _f !== void 0 ? _f : attr.values;
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
            var d = calc_head_depth(hb.children);
            depth = (d + 1 > depth) ? d + 1 : depth;
        }
    }
    return depth;
};
// compute value counts(size) of rowHeader/columnHeader
var calc_head_size = function (channel, entityFlag) {
    if (entityFlag === void 0) { entityFlag = false; }
    if (!channel || channel.length == 0)
        return 0;
    var size = 0;
    for (var _i = 0, channel_2 = channel; _i < channel_2.length; _i++) {
        var hb = channel_2[_i];
        if (entityFlag) {
            size += hb.values.length;
            for (var _a = 0, _b = hb.values; _a < _b.length; _a++) {
                _b[_a];
                size += calc_head_size(hb.children, entityFlag);
            }
        }
        else {
            var s = hb.children ? calc_head_size(hb.children) : 1;
            size += s * (hb.values.length);
        }
    }
    return size;
};
// TODO: fix structure judge
var get_structure_type = function (channel) {
    if (!channel || channel.length == 0)
        throw new Error("Header can not be undefined");
    var hb0 = channel[0], facetList = Array.from({ length: 2 }, function () { return new Array(); });
    var blankList = new Array();
    for (var _i = 0, channel_3 = channel; _i < channel_3.length; _i++) {
        var hb = channel_3[_i];
        if (hb.values.length % hb.facet !== 0)
            throw new Error("Facet can not be divided exactly");
        facetList[0].push(hb.facet);
        facetList[1].push(hb.values.length / hb.facet);
        blankList.push(hb.blankLine);
    }
    return {
        entityMerge: hb0.entityMerge,
        gridMerge: hb0.gridMerge,
        expand: hb0.expand,
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
var gen_inter_row_table = function (interRowTable, rowHeader, extra, width, depth, outerX, bias, isRoot) {
    var _a;
    if (bias === void 0) { bias = 0; }
    if (isRoot === void 0) { isRoot = true; }
    if (rowHeader === undefined)
        return 1;
    var innerX = 0, rhId = -1;
    for (var _i = 0, rowHeader_1 = rowHeader; _i < rowHeader_1.length; _i++) {
        var rh = rowHeader_1[_i];
        var isLeaf = rh.children ? false : true;
        var source = (_a = rh.attrName) !== null && _a !== void 0 ? _a : rh.function;
        rhId++;
        for (var i = 0; i < rh.values.length; i++) {
            var iterCount = void 0;
            extra.preVal[source] = rh.values[i];
            if (extra.entityMerge) {
                iterCount = gen_inter_row_table(interRowTable, rh.children, extra, width, depth, outerX + innerX + 1, bias, false);
            }
            else {
                iterCount = gen_inter_row_table(interRowTable, rh.children, extra, width, depth + 1, outerX + innerX, bias, false);
            }
            if (isRoot) {
                extra.rootSpan[rhId].push(iterCount);
                extra.rootIdList[rhId].push(innerX);
            }
            if (innerX + outerX + iterCount > width) {
                console.log(innerX, outerX, iterCount);
                throw new Error("Over rowHeader width!");
            }
            // process entities merged
            if (extra.entityMerge) {
                var flag = !isLeaf && extra.expand, delta = flag ? 1 : 0;
                interRowTable[innerX + outerX + bias][depth + delta] = {
                    value: rh.values[i],
                    source: source,
                    rowSpan: 1, colSpan: flag ? 1 : extra.Depth,
                    isUsed: false,
                    isLeaf: isLeaf,
                    style: rh.style
                };
                // process cells unmerged
            }
            else if (!extra.gridMerge) {
                interRowTable[innerX + outerX + bias][depth] = {
                    value: rh.values[i],
                    source: source,
                    rowSpan: 1, colSpan: 1,
                    isUsed: false,
                    isLeaf: isLeaf,
                    style: rh.style
                };
                // process cells merged
            }
            else {
                for (var j = 0; j < iterCount; j++) {
                    interRowTable[innerX + outerX + j + bias][depth] = {
                        value: rh.values[i],
                        source: source,
                        rowSpan: iterCount, colSpan: 1,
                        isUsed: false,
                        isLeaf: isLeaf,
                        style: rh.style
                    };
                }
            }
            // process cell unit
            if (isLeaf) {
                for (var _b = 0, _c = extra.cell; _b < _c.length; _b++) {
                    var c = _c[_b];
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
    return innerX + (extra.entityMerge ? 1 : 0);
};
// generate intermediate column table
var gen_inter_column_table = function (interColumnTable, columnHeader, width, depth, outerY, bias) {
    var _a;
    if (bias === void 0) { bias = 0; }
    if (columnHeader === undefined)
        return 1;
    var innerY = 0;
    for (var _i = 0, columnHeader_1 = columnHeader; _i < columnHeader_1.length; _i++) {
        var ch = columnHeader_1[_i];
        for (var i = 0; i < ch.values.length; i++) {
            var iterCount = gen_inter_column_table(interColumnTable, ch.children, width, depth + 1, outerY + innerY, bias);
            if (innerY + outerY + iterCount > width) {
                console.log('Error', innerY, outerY, iterCount);
                throw new Error("Over columnHeader width!");
            }
            for (var j = 0; j < iterCount; j++) {
                interColumnTable[depth][innerY + outerY + j + bias] = {
                    value: ch.values[i],
                    source: (_a = ch.attrName) !== null && _a !== void 0 ? _a : ch.function,
                    rowSpan: 1, colSpan: iterCount,
                    isUsed: false,
                    style: ch.style
                };
            }
            innerY += iterCount;
        }
    }
    return innerY;
};
// generate intermediate cross table
var gen_inter_cross_table = function (interCrossTable, rowHeader, columnHeader, rowWidth, rowDepth, colWidth, colDepth) {
    gen_inter_row_table(interCrossTable, rowHeader, rowWidth, 0, 0, colDepth);
    gen_inter_column_table(interCrossTable, columnHeader, colWidth, 0, 0, rowDepth);
};
var table_process = function (tbClass, data, _a) {
    var rowHeader = _a.rowHeader, columnHeader = _a.columnHeader, cell = _a.cell, attrInfo = _a.attrInfo;
    var interTable, processTable = [];
    var rowDepth = calc_head_depth(rowHeader);
    var colDepth = calc_head_depth(columnHeader);
    var rowSize = calc_head_size(rowHeader);
    var colSize = calc_head_size(columnHeader);
    if (tbClass == ROW_TABLE) {
        var flag = get_structure_type(rowHeader);
        if (flag.entityMerge) {
            rowSize = calc_head_size(rowHeader, true);
            rowDepth = flag.expand ? 2 : 1;
        }
        var extra = __assign(__assign({}, flag), { preVal: {}, data: data.values, cell: cell, cellTable: Array.from({ length: rowSize }, function () { return new Array(); }), attrInfo: attrInfo, rootSpan: Array.from({ length: rowHeader.length }, function () { return new Array(); }), rootIdList: Array.from({ length: rowHeader.length }, function () { return new Array(); }), Depth: calc_head_depth(rowHeader) });
        interTable = Array.from({ length: rowSize }, function () { return new Array(rowDepth).fill({}); });
        gen_inter_row_table(interTable, rowHeader, extra, rowSize, 0, 0);
        var cell_length = 0;
        if (flag.expand) {
            for (var _i = 0, _b = extra.cellTable; _i < _b.length; _i++) {
                var ct = _b[_i];
                cell_length = (cell_length > ct.length) ? cell_length : ct.length;
            }
        }
        console.log('@@@', interTable);
        // console.log('hhh', extra.cellTable);
        for (var i = 0; i < rowSize; i++) {
            processTable[i] = [];
            for (var j = 0; j < rowDepth; j++) {
                var tmp = interTable[i][j];
                // if(tmp.isUsed || tmp.value===undefined) continue 
                if (tmp.isUsed)
                    continue;
                if (flag.expand && processTable[i].length > 0 && tmp.value === undefined)
                    continue;
                if (flag.expand && !tmp.isLeaf)
                    tmp.colSpan = cell_length;
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
                        colSpan: rowDepth,
                        style: tmp.style
                    });
                }
                for (var k = 0; k < tmp.rowSpan; k++) {
                    interTable[i + k][j].isUsed = true;
                }
            }
            for (var _c = 0, _d = extra.cellTable[i]; _c < _d.length; _c++) {
                var c = _d[_c];
                processTable[i].push({
                    value: c.value,
                    source: c.source,
                    rowSpan: 1,
                    colSpan: 1,
                    style: c.style
                });
            }
        }
        // fill empty unit
        var maxLength = 0;
        for (var _e = 0, processTable_1 = processTable; _e < processTable_1.length; _e++) {
            var pt = processTable_1[_e];
            var tmpLength = 0;
            for (var _f = 0, pt_1 = pt; _f < pt_1.length; _f++) {
                var unit = pt_1[_f];
                tmpLength += unit.colSpan;
            }
            maxLength = maxLength > tmpLength ? maxLength : tmpLength;
        }
        for (var _g = 0, processTable_2 = processTable; _g < processTable_2.length; _g++) {
            var pt = processTable_2[_g];
            var resLength = maxLength;
            for (var _h = 0, pt_2 = pt; _h < pt_2.length; _h++) {
                var unit = pt_2[_h];
                resLength -= unit.colSpan;
            }
            for (var i = 0; i < resLength; i++)
                pt.push({
                    value: undefined,
                    source: undefined,
                    rowSpan: 1,
                    colSpan: 1,
                    style: undefined
                });
        }
        // process blank line
        var blankBias = 0;
        for (var i = 0; i < rowHeader.length; i++) {
            if (flag.blankLine[i]) {
                var rootIdList = extra.rootIdList[i];
                for (var j = 0; j < rootIdList.length; j++) {
                    processTable.splice(rootIdList[j] + blankBias, 0, []);
                    extra.rootSpan[i][j]++;
                    blankBias++;
                }
            }
        }
        // console.log(blankBias);
        // console.log('flag', flag.blankLine);
        // console.log('Blank', extra.rootIdList);
        // console.log('Span', extra.rootSpan);
        // process facet structure
        var finalTable = [], rootSpan = extra.rootSpan;
        var preH = 0, processH = 0;
        var _loop_2 = function (i) {
            var facetLen = flag.facet[1][i];
            rootSpan[i] = rootSpan[i].reduce(function (newSpan, _, idx, arr) {
                if (idx % facetLen === 0) {
                    var sum = 0;
                    for (var i_1 = 0; i_1 < facetLen; i_1++)
                        sum += arr[idx + i_1];
                    newSpan.push(sum);
                }
                return newSpan;
            }, []);
            for (var j = 0; j < rootSpan[i].length; j++) {
                for (var k = 0; k < rootSpan[i][j]; k++) {
                    if (!finalTable[preH + k])
                        finalTable[preH + k] = [];
                    finalTable[preH + k] = finalTable[preH + k].concat(processTable[processH + k]);
                }
                processH += rootSpan[i][j];
            }
            preH += rootSpan[i][0];
        };
        for (var i = 0; i < rowHeader.length; i++) {
            _loop_2(i);
        }
        console.log('XXX', processTable);
        console.log('YYY', finalTable);
    }
    else if (tbClass == COLUM_TABLE) {
        interTable = Array.from({ length: colDepth }, function () { return new Array(colSize).fill({}); });
        gen_inter_column_table(interTable, columnHeader, colSize, 0, 0);
        console.log('@@', interTable);
    }
    else {
        interTable = Array.from({ length: rowSize + colDepth }, function () { return new Array(rowDepth + colSize).fill({}); });
        gen_inter_cross_table(interTable, rowHeader, columnHeader, rowSize, rowDepth, colSize, colDepth);
        console.log('@', interTable);
    }
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
