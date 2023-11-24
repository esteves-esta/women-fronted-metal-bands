import { Table } from 'lucide-react';
import * as React from 'react';
import { range } from '../../helpers/range';
import Tag, { TagInfo } from '../Tag';
import Pagination from './Pagination';
import * as classes from './Table.module.css';
import { ArrowUpDown, ArrowDownAz, ArrowUpAZ } from 'lucide-react';

interface Props {
  rows: Array<any>
  initialPage?: number
  pageSize: number
  columns: TableColumn[]
}

export interface TableColumn {
  field?: string,
  headerLabel: string,
  align?: 'left' | 'right' | 'center',
  format?: (val) => string,
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
  ...delegated
}: Props) {
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [size, setSize] = React.useState(pageSize);

  const [data, setData] = React.useState([...rows]);
  const [columnsInfo, setColumnsInfo] = React.useState(columns);

  const [lastPage, setLastPage] = React.useState(() => Math.ceil(data.length / size));

  function handleChangePage(value: number | string) {
    if (value) setCurrentPage(Number(value))
  }

  function sortRows(headerInfo: TableColumn, index: number) {
    const { field, format, handleSort } = headerInfo;


    let sort: 'desc' | 'asc' | undefined;
    if (columnsInfo[index].sort === 'asc') {
      sort = 'desc';
    } else if (columnsInfo[index].sort === 'desc') {
      sort = undefined
    } else { sort = 'asc'; }

    const newColumns = [...columnsInfo]
    newColumns[index].sort = sort
    setColumnsInfo(newColumns);

    if (!sort) {
      setData([...rows]);
      return
    };

    const newData = [...data]
    if (!field) {
      if (format) {
        newData.sort((a, b) => {
          const fa = Number(format(a));
          const fb = Number(format(b));

          if (fa < fb) {
            return sort === 'asc' ? -1 : 1;
          }
          if (fa > fb) {
            return sort === 'asc' ? 1 : -1;
          }
          return 0;
        });
        setData(newData)
      }
      return
    }
    if (handleSort) {
      newData.sort((a, b) => handleSort(a[field], b[field], sort));

      setData(newData)
      return;
    }
    newData.sort((a, b) => {
      const fa = a[field].toString().toLowerCase();
      const fb = b[field].toString().toLowerCase();

      if (fa < fb) {
        return sort === 'asc' ? -1 : 1;
      }
      if (fa > fb) {
        return sort === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setData(newData)
  }

  return (
    <React.Fragment>
      <table className={classes.table}>
        <thead>
          <tr>
            {columnsInfo.map((headerInfo, index) => (
              <th key={`${headerInfo.headerLabel}${index}`}>
                <TableHeader headerInfo={headerInfo} sortRows={() => sortRows(headerInfo, index)} />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>

          <TableRow
            currentPage={currentPage}
            pageSize={size}
            rows={data}
            columns={columnsInfo}
          />
        </tbody>
      </table>

      <div>
        <p>
          Exibindo {currentPage * pageSize} - {(currentPage + 1) * pageSize} de {data.length}
        </p>

        <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
          onChange={handleChangePage}
        />
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
      <td key={`${columnInfo.field}${index}`}>
        <TableColumn column={column} columnInfo={columnInfo} />
      </td>
    ))}
  </React.Fragment>
}

function TableColumn({ column, columnInfo }: {
  column: any, columnInfo: TableColumn
}) {
  const { field, type, align, format, sortable, tagList } = columnInfo

  if (format) return <React.Fragment>{format(column)}</React.Fragment>

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
        {sort === 'desc' && <ArrowDownAz size={15} />}
        {headerLabel}
      </button>}
    </React.Fragment>
  }


  return (<React.Fragment> {headerLabel}</React.Fragment>)
}

export default DataTable;
