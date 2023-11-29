import * as React from 'react';
import { range } from '../../helpers/range';
import Tag, { TagInfo } from '../Tag';
import Pagination from './Pagination';
import * as classes from './Table.module.css';
import { ArrowUpDown, ArrowUpAZ, ArrowDownAZ } from 'lucide-react';

interface Props {
  rows: Array<any>
  initialPage?: number
  pageSize: number
  columns: TableColumn[]
  handleRowChange: (val) => void
  isFiltered: string | null,
}

export interface TableColumn {
  key?: string,
  headerLabel: string,

  field?: string,
  format?: (val) => string,
  formatElement?: (val) => React.ReactNode,

  sortable?: boolean
  sort?: 'desc' | 'asc'
  handleSort?: (valA, valB, sort) => number,
}

export function getColumnDataFromRow(columnInfo: TableColumn, row: any) {
  const { field, format } = columnInfo;
  let colValue;
  if (field) colValue = row[field];
  if (format) colValue = format(row);

  if (!!Number(colValue))
    return Number(colValue)
  else
    return colValue.toString().toLowerCase();
}

function DataTable({
  rows,
  initialPage = 0,
  pageSize,
  columns,
  handleRowChange,
  isFiltered,
  ...delegated
}: Props) {

  const [initialRow] = React.useState([...rows]);

  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [size, setSize] = React.useState(pageSize);

  const [columnsInfo, setColumnsInfo] = React.useState(() => {
    const newColumns = [...columns];
    return newColumns.map(col => {
      if (col.key == undefined) col.key = crypto.randomUUID();
      return col;
    })
  });

  const [lastPage, setLastPage] = React.useState(() => Math.ceil(rows.length / size));

  React.useEffect(() => {
    const colSort = columnsInfo.findIndex(col => col.sort != undefined)
    if (colSort >= 0) {
      sortRows(columnsInfo[colSort], colSort, columnsInfo[colSort].sort)
    }
  }, [])

  React.useEffect(() => {
    const colSort = columnsInfo.findIndex(col => col.sort != undefined)
    if (colSort >= 0 && isFiltered) {
      const newCols = [...columnsInfo]
      newCols[colSort].sort = undefined
      setColumnsInfo(newCols)
    }

    setCurrentPage(0);
    setLastPage(Math.ceil(rows.length / size))
  }, [isFiltered])


  function handleChangePage(value: number | string) {
    if (value) setCurrentPage(Number(value))
  }

  function handleSortRows(headerInfo: TableColumn, colIndex: number) {
    let sort: 'desc' | 'asc' | undefined;

    const resetCols = columnsInfo.map((col, index) => {
      if (index !== colIndex) {
        col.sort = undefined;
      }
      return col;
    })

    setColumnsInfo(resetCols)

    if (columnsInfo[colIndex].sort === 'asc') {
      sort = 'desc';
    } else if (columnsInfo[colIndex].sort === 'desc') {
      sort = undefined
    } else { sort = 'asc'; }

    sortRows(headerInfo, colIndex, sort);
  }

  function sortRows(columnInfo: TableColumn, index: number, sort: 'asc' | 'desc' | undefined) {
    const { field, handleSort } = columnInfo;

    const newColumns = [...columnsInfo]
    newColumns[index].sort = sort
    setColumnsInfo(newColumns);
    if (!sort) {
      handleRowChange([...initialRow]);
      return
    };

    const sortedData = [...rows]

    if (handleSort && field) {
      sortedData.sort((a, b) => handleSort(
        getColumnDataFromRow(columnInfo, a),
        getColumnDataFromRow(columnInfo, b), sort
      ));

      handleRowChange(sortedData)
      return;
    }

    sortedData.sort((a, b) => {
      // console.log({ field })
      let formattedA = getColumnDataFromRow(columnInfo, a);
      let formattedB = getColumnDataFromRow(columnInfo, b);

      if (formattedA < formattedB) {
        return sort === 'asc' ? -1 : 1;
      }
      if (formattedA > formattedB) {
        return sort === 'asc' ? 1 : -1;
      }
      return 0;
    });

    handleRowChange(sortedData)
  }


  return (
    <React.Fragment>
      <table className={classes.table}>
        <thead>
          <tr>
            {columnsInfo.map((headerInfo, index) => (
              <th key={headerInfo.key}>
                <TableHeader headerInfo={headerInfo} sortRows={() => handleSortRows(headerInfo, index)} />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <TableRow
            currentPage={currentPage}
            pageSize={size}
            rows={rows}
            columns={columnsInfo}
          />
        </tbody>
      </table>

      <div className='flex flex-row justify-between mt-5 mb-5'>
        <p className='flex-col'>
          Showing {currentPage * pageSize} - {(currentPage + 1) * pageSize} of {rows.length} items
        </p>

        <div className="flex-col">
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onChange={handleChangePage}
          />
        </div>
      </div>
    </React.Fragment>);
}



function TableRow({ currentPage, pageSize, rows, columns }) {
  return (
    <React.Fragment>
      {range(currentPage * pageSize, pageSize * (currentPage + 1)).map((rowIndex) =>
        rows.length > rowIndex && (
          <tr key={rowIndex}>
            <TableColumns rows={rows} rowIndex={rowIndex} columns={columns} />
          </tr>
        )
      )}
    </React.Fragment>
  )

}


function TableColumns({ columns, rowIndex, rows }: {
  columns: TableColumn[], rowIndex: number, rows: Array<any>
}) {
  const column = rows[rowIndex]
  return <React.Fragment>
    {columns.map((columnInfo, index) => (
      <td key={`${columnInfo.key}${index}`}>
        <TableColumn column={column} columnInfo={columnInfo} />
      </td>
    ))}
  </React.Fragment>
}

function TableColumn({ column, columnInfo }: {
  column: any, columnInfo: TableColumn
}) {
  const { field, formatElement, format, sortable } = columnInfo

  if (format) return <React.Fragment>{format(column)}</React.Fragment>

  if (formatElement) {
    return (<React.Fragment>
      {formatElement(column)}
    </React.Fragment>)
  }

  if (field) return <React.Fragment>{column[field]}</React.Fragment>

  return <React.Fragment></React.Fragment>
}

function TableHeader({ headerInfo, sortRows }: { headerInfo: TableColumn, sortRows: (string) => void }) {
  const { sortable, headerLabel, sort } = headerInfo

  if (sortable) {
    return <React.Fragment>
      {sortable && <button onClick={sortRows} className={classes.sortBtn}>
        {!sort && <ArrowUpDown size={15} />}
        {sort === 'asc' && <ArrowUpAZ size={15} />}
        {sort === 'desc' && <ArrowDownAZ size={15} />}
        {headerLabel}
      </button>}
    </React.Fragment>
  }

  return (<React.Fragment>{headerLabel}</React.Fragment>)
}

export default DataTable;
