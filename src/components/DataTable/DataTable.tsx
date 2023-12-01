import * as React from 'react';
import { range } from '../../helpers/range';
import Pagination from './Pagination';
import * as classes from './Table.module.css';
import { Columns, ChevronDown, Check, ArrowUpDown, ArrowUpAZ, ArrowDownAZ } from 'lucide-react';
import TableFilter from './TableFilter';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
interface Props {
  rows: Array<any>
  initialPage?: number
  pageSize: number
  columns: TableColumn[]
  handleRowChange: (val) => void
  isFiltered: boolean | null,
  gridMode: boolean | null,
  children?: any
}

export interface TableColumn {
  key?: string,
  headerLabel: string,
  img?: { source: string, alt: string }

  field?: string,
  format?: (val) => string | boolean,
  formatElement?: (val) => React.ReactNode,

  sortable?: boolean
  sort?: 'desc' | 'asc'
  handleSort?: (valA, valB, sort) => number,
  visible: boolean
}

function getColumnDataFromRow(columnInfo: TableColumn, row: any) {
  const { field, format, formatElement } = columnInfo;
  let colValue;
  if (field) colValue = row[field];
  if (format) colValue = format(row);
  if (formatElement) colValue = formatElement(row)?.props?.value;

  if (typeof colValue === 'boolean') return colValue

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
  children,
  gridMode = false,
  ...delegated
}: Props) {

  const [initialRow] = React.useState([...rows]);
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [size, setSize] = React.useState(pageSize);
  const [lastPage, setLastPage] = React.useState(() => Math.ceil(rows.length / pageSize));

  const [columnsInfo, setColumnsInfo] = React.useState(() => {
    const newColumns = [...columns];
    return newColumns.map(col => {
      if (col.key == undefined) col.key = crypto.randomUUID();
      return col;
    })
  });

  React.useEffect(() => {
    setLastPage(Math.ceil(rows.length / size))
  }, [size])

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

  const handleChangePage = React.useCallback((value: number | string) => {
    if (value) setCurrentPage(Number(value))
  }, []);

  const handleFilter = React.useCallback((searchValue: string, colKey: string) => {
    let newRows = [...rows];
    if (searchValue) {

      const filtered = newRows.filter(
        row => {
          if (colKey !== 'all') {
            const col = columns.find(col => col.key === colKey)
            if (col) {

              let colValue = getColumnDataFromRow(col, row)
              if (colValue !== NaN)
                return colValue == Number(searchValue)
              else
                return colValue.includes(searchValue.toLowerCase())
            }
          }
          const columnsVisible = Object.entries(row).filter(item => columns.find(col => col.field === item[0]))
          const formattedColumns = columns.filter(col => !!col.format);
          const formattedRow = formattedColumns.map(col => col.format && col.format(row))
          const valuesNotBoolean = columnsVisible.filter(item => typeof item[1] !== 'boolean').map(item => item[1])
          return valuesNotBoolean.concat(formattedRow).join(' ').toLowerCase().includes(searchValue.toLowerCase())
        }
      )

      newRows = [...filtered]
    } else {
      newRows = [...initialRow];
    }
    handleRowChange(newRows);
    setCurrentPage(0);
    setLastPage(Math.ceil(newRows.length / size))
  }, [])

  const handleToogleColumns = React.useCallback((checked: boolean, key: string) => {
    const newCols = [...columnsInfo]
    const toggled = newCols.find(col => col.key === key)
    if (toggled) toggled.visible = checked;
    setColumnsInfo([...newCols])
  }, [columnsInfo]);

  return (
    <React.Fragment>
      <div className='flex flex-row gap-5 my-8'>

        <TableFilter className="grow" onChange={handleFilter} columns={columns} />

        <div className='flex flex-col self-end'>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className={classes.dropdownBtn} aria-label="Customise options">
                <Columns size={15} />
                Toggle columns
                <ChevronDown size={15} />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content className={classes.dropdownMenuContent} sideOffset={5}>
                {
                  columnsInfo.map(({ key, headerLabel, visible }) => key && (
                    <DropdownMenu.CheckboxItem
                      key={key}
                      className={`${classes.dropdownCheckItem} ${visible ? classes.dropdownCheckItemActive : ''}`}
                      checked={visible}
                      onCheckedChange={(checked) => handleToogleColumns(checked, key)}>
                      <DropdownMenu.ItemIndicator>
                        <Check size={15} />
                      </DropdownMenu.ItemIndicator>
                      {headerLabel}
                    </DropdownMenu.CheckboxItem>
                  ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>


        </div>

      </div>
      {children}

      <div className='mt-5 mb-5'>

        {/* <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
          onChange={handleChangePage}
        /> */}

      </div>

      {!gridMode && (
        <Table
          columnsInfo={columnsInfo}
          size={size}
          rows={rows}
          currentPage={currentPage}
          handleRowChange={handleRowChange}
          setColumnsInfo={setColumnsInfo}
          initialRow={initialRow}
        />
      )}

      {gridMode && (
        <Grid
          columns={columnsInfo}
          size={size}
          rows={rows}
          currentPage={currentPage}
        />
      )}

      <div className='flex flex-row items-center justify-between mt-10 mb-10'>
        <div className='flex flex-row gap-5 items-center'>
          <div className='flex flex-row gap-3 items-center'>
            <label htmlFor="rowsPerPage" className='label'>Rows per page</label>
            <select className={classes.pageSize} value={size} onChange={event => {
              setSize(Number(event.target.value));
            }} id='rowsPerPage' placeholder="Select">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
            </select>
          </div>
          <p className='label mb-0'>
            Showing <span className='font-black'>{currentPage * size} - {(currentPage + 1) * size}</span> {' '}
            of {' '}
            <span className='font-black'>{rows.length}</span> items
          </p>
        </div>
        <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
          onChange={handleChangePage}
        />


      </div>
    </React.Fragment>);
}

function Table({
  columnsInfo,
  rows,
  size,
  currentPage,
  setColumnsInfo,
  handleRowChange,
  initialRow
}) {

  React.useEffect(() => {
    const colSort = columnsInfo.findIndex(col => col.sort != undefined)
    if (colSort >= 0) {
      sortRows(columnsInfo[colSort], colSort, columnsInfo[colSort].sort)
    }
  }, [])

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
      )
      );

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
    <table className={classes.table}>
      <thead>
        <tr>
          {columnsInfo.map((headerInfo, index) => headerInfo.visible && (
            <th key={headerInfo.key}>
              <TableHeader headerInfo={headerInfo} sortRows={() => handleSortRows(headerInfo, index)} />
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
        />
      </tbody>
    </table>
  )
}

function TableRow({ currentPage, size, rows, columns }) {
  const start = currentPage * size;
  const end = size * (currentPage + 1);

  return (
    <React.Fragment>
      {range(start, end).map((rowIndex) => rowIndex < rows.length && (
        <tr key={rowIndex}>
          <TableColumns rows={rows} rowIndex={rowIndex} columns={columns} />
        </tr>
      ))}
    </React.Fragment>
  )

}

function TableColumns({ columns, rowIndex, rows }: {
  columns: TableColumn[], rowIndex: number, rows: Array<any>
}) {
  const column = rows[rowIndex]
  return <React.Fragment>
    {columns.map((columnInfo, index) => columnInfo.visible && (
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

  if (field) {
    const colValue = column[field] ? column[field] : '-'
    if (Array.isArray(colValue)) {
      if (colValue.length === 0) return (<React.Fragment>-</React.Fragment>);

      const values = colValue.map((col, index) => (
        <p key={index}>{col}{colValue.length - 1 > index && ','}</p>
      ))
      return <React.Fragment>{values}</React.Fragment>
    }
    return <React.Fragment>{colValue}</React.Fragment>
  }

  return <React.Fragment>-</React.Fragment>
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


function Grid({ columns, rows, size, currentPage }) {
  const start = React.useMemo(() => currentPage * size, [size, currentPage]);
  const end = React.useMemo(() => size * (currentPage + 1), [size, currentPage]);
  return (
    <div className={classes.grid}>

      {range(start, end).map((rowIndex) =>
        rowIndex < rows.length && (
          <div key={rowIndex} className={classes.card}>
            {rows[rowIndex].img && <img src={rows[rowIndex].img.src} alt={rows[rowIndex].img.alt} />}
            {!rows[rowIndex].img && <div className={classes.cardImgPlaceholder} />}

            <div className={classes.cardBody}>
              {/* {rows[rowIndex].Band} */}
              <ul>
                <GridList
                  rows={rows}
                  rowIndex={rowIndex}
                  columns={columns}
                />
              </ul>
            </div>
          </div>
        )
      )}

    </div>
  )
}

function GridList({ columns, rowIndex, rows }: {
  columns: TableColumn[], rowIndex: number, rows: Array<any>
}) {
  const column = rows[rowIndex]
  const List = columns.map(({ key, field, headerLabel, formatElement, format }, index) => {
    /* todo - tooltip */
    if (format) return (<li key={`${key}${index}`}>
      <label> {headerLabel}</label>
      <p> {format(column)}</p>
    </li>)

    if (formatElement) return (<li key={`${key}${index}`}>
      <label> {headerLabel}</label>
      <p> {formatElement(column)}</p>
    </li>)

    /* todo - tooltip */
    if (field) {
      const colValue = column[field]
      if (Array.isArray(colValue)) {
        return (<li key={`${key}${index}`}>
          <label> {headerLabel}</label>
          {/* <p> {column[field]}.join()</p> */}
          <ul>
            {colValue.map((col, index) => (
              <p>{col}{colValue.length - 1 > index && ','}</p>
            ))}
          </ul>
        </li>)
      }
      return (<li key={`${key}${index}`}>
        <label> {headerLabel}</label>
        <p> {colValue}</p>
      </li>)
    }
  })

  return <React.Fragment>{List}</React.Fragment>

}


export default DataTable;
