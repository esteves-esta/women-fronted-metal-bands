import { Table } from 'lucide-react';
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
  isFiltered: boolean
}

export interface TableColumn {
  field?: string,
  headerLabel: string,
  align?: 'left' | 'right' | 'center',
  format?: (val) => string,
  formatElement?: (val) => React.ReactNode,
  sortable?: boolean
  handleSort?: (valA, valB, sort) => number,
  type?: 'tag' | 'link'
  tagList?: TagInfo[]
  sort?: 'desc' | 'asc'
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

  const [columnsInfo, setColumnsInfo] = React.useState(columns);

  const [lastPage, setLastPage] = React.useState(() => Math.ceil(rows.length / size));

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

  function sortRows(headerInfo: TableColumn, index: number, sort: 'asc' | 'desc' | undefined) {
    const { field, format, handleSort } = headerInfo;

    const newColumns = [...columnsInfo]
    newColumns[index].sort = sort
    setColumnsInfo(newColumns);
    if (!sort) {
      handleRowChange([...initialRow]);
      return
    };

    const newData = [...rows]

    if (handleSort && field) {
      newData.sort((a, b) => handleSort(a[field], b[field], sort));

      handleRowChange(newData)
      return;
    }
    newData.sort((a, b) => {
      let fa;
      let fb;
      if (field) {
        fa = a[field];
        fb = b[field];
      }
      if (format) {
        fa = format(a);
        fb = format(b);
      }

      if (typeof fa === 'number' && typeof fb === 'number') {
        fa = Number(fa)
        fb = Number(fb)
      } else {
        fa = fa.toString().toLowerCase()
        fb = fb.toString().toLowerCase()
      }

      if (fa < fb) {
        return sort === 'asc' ? -1 : 1;
      }
      if (fa > fb) {
        return sort === 'asc' ? 1 : -1;
      }
      return 0;
    });
    handleRowChange(newData)
  }

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
  }, [isFiltered])

  const handleFilter = React.useCallback((value: string, col: string) => {
    let newRows = [...rows];
    if (value) {

      const filtered = newRows.filter(
        row => {
          if (col) {
            return row[col].toLowerCase().includes(value.toLowerCase())
          }
          const valuesNotBoolean = Object.values(row).filter(item => typeof item !== 'boolean')
          return valuesNotBoolean.join(' ').toLowerCase().includes(value.toLowerCase())
          // return Object.values(row).join(' ').toLowerCase().includes(value.toLowerCase())
        }
      )

      newRows = [...filtered]
    } else {
      newRows = [...initialRow];
    }
    setCurrentPage(0);
    handleRowChange(newRows);
    setLastPage(Math.ceil(newRows.length / size))
  }, [])

  return (
    <React.Fragment>
      <div className='flex items-center gap-5 flex-row mt-5 mb-5'>
        <div className='flex-col grow'>
          <TableFilter onChange={handleFilter} columns={columns} />
        </div>
        <div className='flex-col'>
          <p className='mb-0 mt-4'>
            {rows.length} items
          </p>
        </div>
      </div>
      <table className={classes.table}>
        <thead>
          <tr>
            {columnsInfo.map((headerInfo, index) => (
              <th key={`${headerInfo.headerLabel}${index}`}>
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

function TableFilter({ onChange, columns }) {
  const [search, setSearch] = React.useState('');
  const [searchType, setSearchType] = React.useState('');
  const id = React.useId();

  const searchId = `${id}-search`;
  const searchTypeId = `${id}-seachType`;

  const handleOnChange = (search, searchType) => {

    const intervalId = window.setTimeout(() => {
      onChange(search, searchType);
    }, 1000);
    return () => window.clearTimeout(intervalId)
  };

  return (
    <div className='flex flex-row'>
      <div className='flex flex-col'>
        <label className={classes.label} htmlFor={searchTypeId}>Search</label>
        <select className={classes.search} id={searchTypeId} value={searchType} placeholder="Filter by column"
          onChange={event => {
            setSearchType(event.target.value)
            handleOnChange(search, event.target.value)
          }}>
          <option value=''>All</option>
          {columns.map(col => (
            <option key={col.headerLabel.replace(/\s/g, '')} value={col.field}>{col.headerLabel}</option>
          ))}
        </select>
      </div>

      <div className='flex flex-col grow'>
        <label className={classes.label} htmlFor={searchId}>Search</label>
        <input className={classes.search} id={searchId} type="text" placeholder="Search for.."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            handleOnChange(event.target.value, searchType)
          }}
        />
      </div>
    </div >
  )
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
      <td key={`${columnInfo.field}${index}`}>
        <TableColumn column={column} columnInfo={columnInfo} />
      </td>
    ))}
  </React.Fragment>
}

function TableColumn({ column, columnInfo }: {
  column: any, columnInfo: TableColumn
}) {
  const { field, type, formatElement, format, sortable, tagList } = columnInfo

  if (format) return <React.Fragment>{format(column)}</React.Fragment>

  if (formatElement) {
    return (<React.Fragment>
      {formatElement(column)}
    </React.Fragment>)
  }

  if (field) {
    if (type && type === 'link' && column[field]) return (<a href={column[field]} target="_blank">link</a>)
    if (type && type === 'tag' && tagList) return (<Tag value={column[field]} tagInfo={tagList} />)

    return <React.Fragment>{column[field]}</React.Fragment>
  }


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
