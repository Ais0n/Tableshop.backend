enum SourceTableFormat {
  JSON = "json",
  CSV = "csv"
}

export enum DataType {
  CATEGORICAL = "categorical",
  NUMERICAL = "numerical"
}

type CSVArray = any[][];
type JSONArray = object[];

// Source Table
export interface SourceTable {
  name: string;
  format?: SourceTableFormat;
  values?: CSVArray | JSONArray;
}

// Specification

// attr
export interface AttrInfoUnit {
  name: string;
  dataType: DataType;
  values: string[] | number[];
}

export type AttrInfo = AttrInfoUnit[]

// Block
export const KEY_ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']
export const KEY_NUMERICAL = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
export const KEY_ALPHABETIC = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

export enum Position {
  EMBEDDED = "embedded",
  LEFT = "left",
  RIGHT = "right",
  TOP = "top",
  BOTTOM = "bottom"
}

export enum Pattern {
  ROMAN = "I",
  NUMERICAL = "1",
  ALPHABETIC = "A"
}

type Color = string

export interface Key {
  position: Position;
  pattern: Pattern;
  isInherited: boolean;
}

export interface BorderStyle {
  color: Color;
  isDouble: boolean;
}

export interface FontStyle {
  fontSize: string;
  fontWeight: string;
}

export interface Border {
  border_top: null | BorderStyle;
  border_bottom: null | BorderStyle;
  border_left: null | BorderStyle;
  border_right: null | BorderStyle;
}

export interface HeaderBlock {
  attrName: string | undefined; // link to AttrInfoUnit name
  function: string | undefined; // can not exist with attrName
  blockId: string;
  className?: string;
  key?: Key;
  entityMerge?: boolean;
  gridMerge?: boolean;
  // expand?: boolean;
  facet?: number;
  blankLine?: boolean;
  style?: string;
  values?: string[] | number[];
  children?: HeaderBlock[];
}

export interface CellBlock {
  attrName: string;
  rowParentId?: string;
  columnParentId?: string;
  style?: string; 
}

export type HeaderChannel = HeaderBlock[]
export type CellChannel = CellBlock[]

export interface StyleClass {
  border: Border;
  bgColor: Color;
  indent: string;
  font: FontStyle;
  textAlign: string;
}

export interface SingleTable {
  rowHeader?: HeaderChannel;
  columnHeader?: HeaderChannel;
  cell: CellChannel;
  styles: StyleClass[];
  attrInfo: AttrInfo; 
}

// function
export const FUNC_SUM = "sum"