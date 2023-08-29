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

export enum GridMerge {
  Merged = "merged",
  UnmergedFirst = "unmerged-first",
  UnmergedAll = "unmerged-all"
}

export enum BorderPosition {
  ALL = "All",
  TOP = "Top",
  BOTTOM = "Bottom",
  LEFT = "Left",
  RIGHT = "Right"
}

export enum FontUnderscore {
  None = 0,
  Single = 1,
  Double = 2
}

export enum FontWeight {
  REGULAR = "Regular",
  BOLD = "Bold",
  SEMIBOLD = "Semi Bold"
}

type Color = string

export interface Key {
  position: Position;
  pattern: Pattern;
  isInherited: boolean;
}

export interface Border {
  color: Color;
  width: number,
  position: BorderPosition
}

export interface Background {
  color: Color
}

export interface Font {
  size: number;
  weight: FontWeight;
  color: Color;
  underscore?: FontUnderscore;
}

export interface HeaderBlock {
  attrName: string | undefined; // link to AttrInfoUnit name
  function: string | undefined; // can not exist with attrName
  blockId: string;
  className?: string;
  key?: Key;
  entityMerge?: boolean;
  gridMerge?: GridMerge;
  // expand?: boolean;
  facet?: number;
  facetMerge?: boolean,
  facetEnd?: boolean,
  title?: string,
  blankLine?: boolean;
  style?: StyleClass;
  values?: string[] | number[];
  children?: HeaderBlock[];
}

export interface CellBlock {
  attrName: string;
  blockId: string;
  rowParentId?: string;
  colParentId?: string;
  className?: string;
  style?: StyleClass; 
}

export type HeaderChannel = HeaderBlock[]
export type CellChannel = CellBlock[]

export interface StyleClass {
  border?: Border;
  background?: Background;
  indent?: number;
  font?: Font;
}

export interface SingleTable {
  rowHeader?: HeaderChannel;
  columnHeader?: HeaderChannel;
  cell: CellChannel;
  styles: {
    [key: string]: StyleClass
  };
  attrInfo: AttrInfo; 
}

// function
export const FUNC_SUM = "sum"