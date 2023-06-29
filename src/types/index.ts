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
  TargetTable
} from "./data_source";


interface Spec {
  data: DataSource;
  spec: TargetTableSyntax;
}

export {
  Spec,
  DataType,
  DataSource,
  DataSourceFormatEnum,
  CSVArray,
  JSONArray,
  DataTableInterface,
  DataTableAttribute,
  DataTableTuple,
  TargetTableSyntax,
  TargetTableChannel,
  TargetTableChannelUnit,
  TargetTable
};
