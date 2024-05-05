export const CROSS_TABLE = "cross table"
export const ROW_TABLE = "row table"
export const COLUM_TABLE = "column table"

export interface interCell {
  value: string;
  sourcePuzzleId: string;
  rowSpan: number;
  colSpan: number;
  type: string;
  style: string;
}

export enum BlockType {
  ROW = "row",
  COLUMN = "column",
  CELL = "cell",
  KEY = "key",
  FUNCTION = "function",
  TITLE = "title",
}

