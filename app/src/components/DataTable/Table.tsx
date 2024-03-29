import * as React from 'react';
import { range } from '../../helpers/range';
import classes from './Table.module.css';
import { ArrowUpDown, ArrowUpAZ, ArrowDownAZ } from 'lucide-react';
import { TableColumn as TableColumnProps } from './TableProps';
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import Tag from '../Tag';


function Table({
  columnsInfo,
  rows,
  size,
  currentPage,
  handleSortRows,
  sortParams,
  rowIdName,
  onRowClick
}) {

  return (
    <table className={classes.table}>
      <thead>
        <tr>
          {columnsInfo.map(headerInfo => headerInfo.visible && (
            <th key={headerInfo.key}>
              <TableHeader headerInfo={headerInfo}
                sortParams={sortParams}
                sortRows={handleSortRows} />
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        <TableRow
          currentPage={currentPage}
          size={size}
          rows={rows}
          columns={columnsInfo}
          rowIdName={rowIdName}
          onRowClick={onRowClick}
        />
      </tbody>
    </table>
  )
}

interface TableHeaderProps {
  headerInfo: TableColumnProps
  sortRows?: (sort, sortby) => void
  sortParams: { sort: string, sortBy: string }
}

function TableHeader({ headerInfo, sortRows, sortParams }: TableHeaderProps) {
  const { sortable, headerLabel, field } = headerInfo
  const sort = sortParams.sortBy === field ? sortParams.sort : null

  const onSort = () => {

    let newSort = null

    if (sort === "asc") {
      newSort = "desc";
    } else if (sort === "desc") {
      newSort = null;
    } else {
      newSort = "asc";
    }
    // console.log({ sortParams, sort, newSort })

    if (field)
      sortRows(field, newSort)
  }

  if (sortable) {
    return <React.Fragment>
      {sortable && <button className={classes.sortBtn} onClick={onSort}>
        {!sort && <ArrowUpDown size={15} />}
        {sort === 'asc' && <ArrowUpAZ size={15} />}
        {sort === 'desc' && <ArrowDownAZ size={15} />}
        <VisuallyHidden.Root>
          Toggle sorting{' '}
          {sort || 'off'}
        </VisuallyHidden.Root>
        {headerLabel}
      </button>}
    </React.Fragment>
  }

  return (<React.Fragment>{headerLabel}</React.Fragment>)
}

function TableRow({ currentPage, size, rows, columns, rowIdName, onRowClick }) {
  const start = currentPage * size;
  const end = size * (currentPage + 1);

  return (
    <React.Fragment>
      {range(start, end).map((rowIndex) => {
        const row = rows[rowIndex];
        return rowIndex < rows.length && (
          <tr
            className={row.selected ? classes.rowSelected : ``}
            key={row[rowIdName]}
            onClick={() => onRowClick(row)}>

            <TableColumns rows={rows} rowIndex={rowIndex} columns={columns} />
          </tr>
        )
      })}
    </React.Fragment>
  )

}

function TableColumns({ columns, rowIndex, rows }: {
  columns: TableColumnProps[], rowIndex: number, rows: Array<any>
}) {
  const row = rows[rowIndex]

  return <React.Fragment>
    {columns.map((columnInfo, index) => columnInfo.visible && (
      <td key={`${columnInfo.key}${index}`}>
        <TableColumn row={row} columnInfo={columnInfo} />
      </td>
    ))}
  </React.Fragment>
}

function TableColumn({ row, columnInfo }: {
  row: any, columnInfo: TableColumnProps
}) {
  const { field, formatElement, format, tag, tagList } = columnInfo

  if (tag && tagList) {
    if (field && !format) return (<Tag value={row[field]} tagInfo={tagList} />)
    if (format) return (<Tag value={format(row)} tagInfo={tagList} />)
  }

  if (format) return <React.Fragment>{format(row)}</React.Fragment>

  if (formatElement) {
    return (<React.Fragment>
      {formatElement(row)}
    </React.Fragment>)
  }

  if (field) {
    const colValue = row[field] ? row[field] : '-'
    if (Array.isArray(colValue)) {
      if (colValue.length === 0) return (<React.Fragment>-</React.Fragment>);

      const values = colValue.map((col, index) => {
        const last = colValue.length - 1 > index
        const only = colValue.length - 1 === index
        return (
          <p key={index} className={only ? "mb-0" : ""}>{col}{last && ','}</p>
        )
      })
      return <React.Fragment>{values}</React.Fragment>
    }
    return <React.Fragment>{colValue}</React.Fragment>
  }

  return <React.Fragment>-</React.Fragment>
}



export default Table;