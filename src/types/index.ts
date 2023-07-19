import {
  SourceTable, SingleTable,  
  AttrInfoUnit, AttrInfo, DataType,
  Key, KEY_ALPHABETIC, KEY_ROMAN, KEY_NUMERICAL, Pattern, Position,
  BorderStyle, FontStyle, Border,
  HeaderBlock, CellBlock, HeaderChannel, CellChannel, StyleClass,
  FUNC_SUM
} from "./data_source"
import { CROSS_TABLE, ROW_TABLE, COLUM_TABLE, interCell } from "./data_intermediate";

interface Spec {
  data: SourceTable;
  spec: SingleTable;
}

export {
  Spec, SourceTable, SingleTable,
  AttrInfoUnit, AttrInfo, DataType,
  Key, KEY_ALPHABETIC, KEY_ROMAN, KEY_NUMERICAL, Pattern, Position, 
  BorderStyle, FontStyle, Border,
  HeaderBlock, CellBlock, HeaderChannel, CellChannel, StyleClass,
  FUNC_SUM,
  CROSS_TABLE, ROW_TABLE, COLUM_TABLE, 
  interCell
}
