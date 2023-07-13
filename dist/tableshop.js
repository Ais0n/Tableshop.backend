'use strict';

var CROSS_TABLE = "cross table";
var ROW_TABLE = "row table";
var COLUM_TABLE = "column table";

var header_fill = function (attrInfo, header) {
    var _a, _b, _c, _d, _e;
    if (header !== undefined) {
        var _loop_1 = function (hb) {
            hb.entityMerge = (_a = hb.entityMerge) !== null && _a !== void 0 ? _a : false;
            hb.gridMerge = (_b = hb.gridMerge) !== null && _b !== void 0 ? _b : true;
            hb.expand = (_c = hb.expand) !== null && _c !== void 0 ? _c : false;
            hb.facet = (_d = hb.facet) !== null && _d !== void 0 ? _d : 1;
            hb.blankLine = false;
            hb.style = "TODO";
            if (hb.function !== undefined) {
                hb.values = ["Function(Sum)"];
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
var calc_depth = function (channel) {
    if (!channel || channel.length == 0)
        return 0;
    var depth = 1;
    for (var _i = 0, channel_1 = channel; _i < channel_1.length; _i++) {
        var hb = channel_1[_i];
        if (hb.children) {
            var d = calc_depth(hb.children);
            depth = (d + 1 > depth) ? d + 1 : depth;
        }
    }
    return depth;
};
// compute value counts(size) of rowHeader/columnHeader
var calc_size = function (channel, entityFlag) {
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
                size += calc_size(hb.children, entityFlag);
            }
        }
        else {
            var s = hb.children ? calc_size(hb.children) : 1;
            size += s * (hb.values.length);
        }
    }
    return size;
};
// TODO: fix structure judge
var get_structure_type = function (channel) {
    if (!channel || channel.length == 0)
        throw new Error("Header can not be undefined");
    var hb = channel[0];
    return {
        entityMerge: hb.entityMerge,
        gridMerge: hb.gridMerge,
        expand: hb.expand,
        facet: hb.facet
    };
};
// generate intermediate row table
var gen_inter_row_table = function (interRowTable, rowHeader, width, depth, outerX, bias) {
    var _a, _b, _c;
    if (bias === void 0) { bias = 0; }
    if (rowHeader === undefined)
        return 1;
    var innerX = 0;
    var flag = get_structure_type(rowHeader);
    for (var _i = 0, rowHeader_1 = rowHeader; _i < rowHeader_1.length; _i++) {
        var rh = rowHeader_1[_i];
        for (var i = 0; i < rh.values.length; i++) {
            var iterCount = void 0;
            if (flag.entityMerge) {
                iterCount = gen_inter_row_table(interRowTable, rh.children, width, depth, outerX + innerX + 1, bias);
            }
            else {
                iterCount = gen_inter_row_table(interRowTable, rh.children, width, depth + 1, outerX + innerX, bias);
            }
            if (innerX + outerX + iterCount > width) {
                console.log(innerX, outerX, iterCount);
                throw new Error("Over rowHeader width!");
            }
            if (flag.entityMerge) {
                interRowTable[innerX + outerX + bias][depth] = {
                    value: rh.values[i],
                    source: (_a = rh.attrName) !== null && _a !== void 0 ? _a : rh.function,
                    rowSpan: 1, colSpan: 1,
                    isUsed: false,
                    style: rh.style
                };
            }
            else if (!flag.gridMerge) {
                interRowTable[innerX + outerX + bias][depth] = {
                    value: rh.values[i],
                    source: (_b = rh.attrName) !== null && _b !== void 0 ? _b : rh.function,
                    rowSpan: 1, colSpan: 1,
                    isUsed: false,
                    style: rh.style
                };
            }
            else {
                for (var j = 0; j < iterCount; j++) {
                    interRowTable[innerX + outerX + j + bias][depth] = {
                        value: rh.values[i],
                        source: (_c = rh.attrName) !== null && _c !== void 0 ? _c : rh.function,
                        rowSpan: iterCount, colSpan: 1,
                        isUsed: false,
                        style: rh.style
                    };
                }
            }
            innerX += iterCount;
        }
    }
    return innerX + (flag.entityMerge ? 1 : 0);
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
var gen_inter_cross_table = function (interCrossTable, rowHeader, columnHeader, rowWidth, rowDepth, colWidth, colDepth) {
    gen_inter_row_table(interCrossTable, rowHeader, rowWidth, 0, 0, colDepth);
    gen_inter_column_table(interCrossTable, columnHeader, colWidth, 0, 0, rowDepth);
};
var table_process = function (tbClass, _a) {
    var rowHeader = _a.rowHeader, columnHeader = _a.columnHeader; _a.cell;
    var interTable, processTable = [];
    var rowDepth = calc_depth(rowHeader);
    var colDepth = calc_depth(columnHeader);
    var rowSize = calc_size(rowHeader);
    var colSize = calc_size(columnHeader);
    if (tbClass == ROW_TABLE) {
        var flag = get_structure_type(rowHeader);
        if (flag.entityMerge) {
            rowSize = calc_size(rowHeader, true);
            rowDepth = 1;
            // interTable = Array.from({length: rowSize}, () => new Array(rowDepth).fill({}))
            // gen_inter_row_table_entityMerge(interTable, rowHeader, rowSize, 0)
            // gen_inter_row_table(interTable, rowHeader, rowSize, 0, 0)
        }
        interTable = Array.from({ length: rowSize }, function () { return new Array(rowDepth).fill({}); });
        gen_inter_row_table(interTable, rowHeader, rowSize, 0, 0);
        console.log('@@@', interTable);
        for (var i = 0; i < rowSize; i++) {
            processTable[i] = [];
            for (var j = 0; j < rowDepth; j++) {
                var tmp = interTable[i][j];
                if (tmp.isUsed || tmp.value === undefined)
                    continue;
                processTable[i].push({
                    value: tmp.value, source: tmp.source,
                    rowSpan: tmp.rowSpan, colSpan: tmp.colSpan,
                    style: tmp.style
                });
                for (var k = 0; k < tmp.rowSpan; k++) {
                    interTable[i + k][j].isUsed = true;
                }
            }
        }
        console.log('XXX', processTable);
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
    var rowHeader = spec.rowHeader, columnHeader = spec.columnHeader, cell = spec.cell; spec.styles; spec.attrInfo;
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
    table_process(tableClass, { rowHeader: rowHeader, columnHeader: columnHeader, cell: cell });
};

var utils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    spec_init: spec_init,
    transform: transform
});

var index = { utils: utils };

module.exports = index;
