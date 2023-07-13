import {
  SourceTable, SingleTable,  
  AttrInfoUnit, AttrInfo,
  Key, BorderStyle, FontStyle, Border,
  HeaderBlock, CellBlock, HeaderChannel, CellChannel, StyleClass
} from "./data_source"
import { CROSS_TABLE, ROW_TABLE, COLUM_TABLE, interCell } from "./data_intermediate";

interface Spec {
  data: SourceTable;
  spec: SingleTable;
}

export {
  Spec, SourceTable, SingleTable,
  AttrInfoUnit, AttrInfo,
  Key, BorderStyle, FontStyle, Border,
  HeaderBlock, CellBlock, HeaderChannel, CellChannel, StyleClass,
  CROSS_TABLE, ROW_TABLE, COLUM_TABLE, 
  interCell
}
