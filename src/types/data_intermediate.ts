export const CROSS_TABLE = "cross table"
export const ROW_TABLE = "row table"
export const COLUM_TABLE = "column table"

export interface interCell {
  value: string;
  sourceBlockId: string;
  rowSpan: number;
  colSpan: number;
  style: string;
}


