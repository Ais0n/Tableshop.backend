export interface DataSource {
  name: string;
  format?: DataSourceFormatEnum;
  values?: CSVArray | JSONArray;
}

export enum DataSourceFormatEnum {
  JSON = "json",
  CSV = "csv",
}

export enum DataType {
  CATEGORICAL = "categorical",
  NUMERICAL = "numerical"
}

export type CSVArray = any[][];
export type JSONArray = object[];

export interface DataTableInterface {
  name: string;
  attributes: DataTableAttribute[];
  tuples: DataTableTuple[];
}

export interface DataTableAttribute {
  name: string;
  type: DataType;
  values: string[] | number[];
}


export type DataTableTuple = any;

export interface TargetTableSyntax {
  rowHeader?: TargetTableChannel;
  columnHeader?: TargetTableChannel;
  cell?: TargetTableChannel;
}

export type TargetTableChannel = TargetTableChannelUnit[];

export interface TargetTableChannelUnit {
  attr: DataTableAttribute;
  children?: TargetTableChannelUnit[];
}

export type TargetTable = any[][];

