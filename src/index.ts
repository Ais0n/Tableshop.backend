import {
  DataSource,
  DataType,
  DataSourceFormatEnum,
  CSVArray,
  JSONArray,
  DataTableInterface,
  DataTableAttribute,
  DataTableTuple,
  TargetTableSyntax,
  TargetTableChannel,
  TargetTableChannelUnit,
  TargetTable,
  Spec
} from "./types";


// 计算rowheader/columnheader的维数（深度）
const calc_depth = (channel?: TargetTableChannel): number => {
  if (!channel || channel.length == 0) return 0;
  let depth = 1;
  for (let i = 0; i < channel.length; i++) {
    let attr_i: TargetTableChannelUnit = channel[i];
    if (attr_i.children) {
      let d = calc_depth(attr_i.children);
      depth = (d + 1 > depth) ? d + 1 : depth;
    }
  }
  return depth;
}

// 计算rowheader/columnheader的值个数（宽度）
const calc_size = (channel?: TargetTableChannel): number => {
  if (!channel || channel.length == 0) return 0;
  let size = 0;
  for (let i = 0; i < channel.length; i++) {
    let attr_i: TargetTableChannelUnit = channel[i];
    let s = attr_i.children ? calc_size(attr_i.children) : 1;
    size += s * attr_i.attr.values.length;
  }
  return size;
}

const transform = (task: Spec) => {
  let { data, spec } = task;
  let rowDepth = calc_depth(spec.rowHeader);
  let colDepth = calc_depth(spec.columnHeader);
  let rowSize = calc_size(spec.rowHeader);
  let colSize = calc_size(spec.columnHeader);
  console.log(rowDepth, colDepth, rowSize, colSize);
}

export default { transform }