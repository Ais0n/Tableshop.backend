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
  // name: string;
  // format?: SourceTableFormat;
  // values?: CSVArray | JSONArray;
  metaData?: CSVArray | JSONArray;
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
  ROMAN = "roman-numeral",
  NUMERICAL = "number",
  ALPHABETIC = "letter"
}

export enum GridMerge {
  Merged = "merged",
  UnmergedFirst = "first-value",
  UnmergedAll = "all-values"
}

export enum BorderPosition {
  ALL = "All",
  TOP = "Top",
  BOTTOM = "Bottom",
  LEFT = "Left",
  RIGHT = "Right"
}

export enum BorderStyle {
  DOUBLE = "double",
  SINGLE = "solid",
  NONE = "none",
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
  // isInherited: boolean;
  nesting: boolean;
}

export interface Border {
  color: Color;
  width: number,
  position: BorderPosition,
  style: BorderStyle,
}

export interface Background {
  color: Color
}

export interface Font {
  fontSize: number;
  fontWeight: FontWeight;
  fontColor: Color;
  underscore?: FontUnderscore;
}

export interface Hierarchy {
  groupBy?: boolean;
  cellMerge?: GridMerge;
}

export interface Facet {
  division?: number;
  facetMerge?: boolean;
  facetEnd?: boolean;
}

export interface Marginalia {
  spacing?: boolean;
  key?: Key;
}

export interface Structure {
  hierarchy?: Hierarchy;
  facet?: Facet;
  marginalia?: Marginalia;
}

export interface PuzzleStyle {
  className?: string;
  style?: StyleClass;
}

export interface HeaderBlock {
  entityName: string | undefined; // link to AttrInfoUnit name
  function: string | undefined; // can not exist with entityName
  puzzleId: string;
  className?: string;
  structure?: Structure;
  puzzleStyle?: PuzzleStyle;
  key?: Key;
  entityMerge?: boolean;
  gridMerge?: GridMerge;
  // expand?: boolean;
  division?: number;
  facetMerge?: boolean;
  facetEnd?: boolean;
  blankLine?: boolean;
  title?: string;
  style?: StyleClass;
  values?: string[] | number[];
  children?: HeaderBlock[];
}

export interface CellBlock {
  entityName: string;
  puzzleId: string;
  rowParentId?: string;
  colParentId?: string;
  className?: string;
  puzzleStyle?: PuzzleStyle;
  style?: StyleClass; 
}

export type HeaderChannel = HeaderBlock[]
export type CellChannel = CellBlock[]

export interface StyleClass {
  border?: Border;
  // background?: Background;
  backgroundColor?: Color;
  indent?: number;
  font?: Font;
}

export interface SingleTable {
  rowHeader?: HeaderChannel;
  columnHeader?: HeaderChannel;
  cell: CellChannel;
  globalStyle: {
    [key: string]: StyleClass
  };
  attrInfo: AttrInfo; 
}

// function
export const FUNC_SUM = "sum"