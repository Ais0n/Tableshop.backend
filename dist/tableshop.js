'use strict';

// 计算rowheader/columnheader的维数（深度）
var calc_depth = function (channel) {
    if (!channel || channel.length == 0)
        return 0;
    var depth = 1;
    for (var i = 0; i < channel.length; i++) {
        var attr_i = channel[i];
        if (attr_i.children) {
            var d = calc_depth(attr_i.children);
            depth = (d + 1 > depth) ? d + 1 : depth;
        }
    }
    return depth;
};
// 计算rowheader/columnheader的值个数（宽度）
var calc_size = function (channel) {
    if (!channel || channel.length == 0)
        return 0;
    var size = 0;
    for (var i = 0; i < channel.length; i++) {
        var attr_i = channel[i];
        var s = attr_i.children ? calc_size(attr_i.children) : 1;
        size += s * attr_i.attr.values.length;
    }
    return size;
};
var transform = function (task) {
    task.data; var spec = task.spec;
    calc_depth(spec.rowHeader);
    calc_depth(spec.columnHeader);
    calc_size(spec.rowHeader);
    calc_size(spec.columnHeader);
    // console.log(calc_size(spec.rowHeader))
    // console.log(calc_size(spec.columnHeader))
};
var index = { transform: transform };

module.exports = index;
