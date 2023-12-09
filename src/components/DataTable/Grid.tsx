import * as React from 'react';
import { range } from '../../helpers/range';
import classes from './Table.module.css';
import Tag from '../Tag';
import { TableColumn } from './TableProps';

function Grid({ columns, rows, size, currentPage, rowIdName, onRowClick, gridImage }) {
  const start = currentPage * size;
  const end = size * (currentPage + 1);
  return (
    <div className={classes.grid}>
      {range(start, end).map((rowIndex) => {
        const row = rows[rowIndex]
        const imageSrc = gridImage(row)
        return rowIndex < rows.length && (
          <div key={row[rowIdName]} className={row.selected ? `${classes.cardSelected} ${classes.card}` : classes.card} onClick={() => onRowClick(row)}>

            {imageSrc.src && <img src={imageSrc.src} alt={imageSrc.alt} />}
            {!imageSrc.src && <div className={classes.cardImgPlaceholder} />}

            <div className={classes.cardBody}>
              <ul>
                <GridList
                  rows={rows}
                  rowIndex={rowIndex}
                  columns={columns}
                />
              </ul>
            </div>

          </div>)
      }
      )}
    </div>
  )
}

function GridList({ columns, rowIndex, rows }: {
  columns: TableColumn[], rowIndex: number, rows: Array<any>
}) {
  const row = rows[rowIndex]
  const List = columns.map((column, index) =>
    column.visible && (<li key={`${column.key}${index}`}>
      <label> {column.headerLabel}</label>
      <GridItem row={row} column={column} />
    </li>)
  )

  return <React.Fragment>{List}</React.Fragment>
}


function GridItem({ column, row }:
  { column: TableColumn, row: any }) {
  const { tag, field, tagList, formatElement, format } = column;

  if (tag && tagList) {
    if (field) return (<p><Tag value={row[field]} tagInfo={tagList} /></p>)
    if (format) return (<p><Tag value={format(row)} tagInfo={tagList} /></p>)
  }

  if (format) return (<p>{format(row)}</p>)

  if (formatElement) return (<p>{formatElement(row)}</p>)

  if (field) {
    const colValue = row[field]
    if (Array.isArray(colValue)) {
      return (<ul>
        {colValue.map((col, index) => (
          <p key={index}>{col}{colValue.length - 1 > index && ','}</p>
        ))}
      </ul>
      )
    }
    return (<p>{colValue}</p>)
  }
  return <React.Fragment>-</React.Fragment>
}


export default Grid;