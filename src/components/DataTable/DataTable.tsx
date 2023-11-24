import { Table } from 'lucide-react';
import * as React from 'react';
import { range } from '../../helpers/range';
import Tag, { TagInfo } from '../Tag';
import Pagination from './Pagination';
import * as classes from './Table.module.css';



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
  type?: 'tag' | 'link'
  tagList?: TagInfo[]
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
  const [lastPage, setLastPage] = React.useState(() => Math.ceil(rows.length / size));

  function handleChangePage(value: number | string) {
    if (value) setCurrentPage(Number(value))
  }

  return (
    <React.Fragment>
      <table className={classes.table}>
        <thead>
          <tr>
            {columns.map(({ headerLabel }, index) => (
              <th key={`${headerLabel}${index}`}>
                {headerLabel}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>

          <TableRow
            currentPage={currentPage}
            pageSize={size}
            rows={rows}
            columns={columns}
          />
        </tbody>
      </table>

      <div>
        <p>
          Exibindo {currentPage * pageSize} - {(currentPage + 1) * pageSize} de {rows.length}
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
    if (type && type === 'link') return (<a href={column[field]} target="_blank">link</a>)
    if (type && type === 'tag' && tagList) return (<Tag value={column[field]} tagInfo={tagList} />)

    return <React.Fragment>{column[field]}</React.Fragment>
  }


  return <React.Fragment></React.Fragment>
}

export default DataTable;
