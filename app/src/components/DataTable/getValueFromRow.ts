import { TableColumn } from "./TableProps";

export function getValueFromRow(columnInfo: TableColumn, row: any) {
  const { field, format, tag, tagList, sortWithRawValue } = columnInfo;
  let colValue;

  if (field) colValue = row[field];

  if (format) colValue = format(row);

  if (tag && tagList && !sortWithRawValue) {
    if (field) colValue = tagList.find(tag => tag.value === row[field])?.text;
    if (format) colValue = tagList.find(tag => tag.value === format(row))?.text;
  }
  // console.log({ colValue })
  if (typeof colValue === 'boolean') return colValue

  if (!!Number(colValue))
    return Number(colValue)
  else
    return colValue.toString().toLowerCase();
}