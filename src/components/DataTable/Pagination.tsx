import { Table } from 'lucide-react';
import * as React from 'react';
import { range } from '../../helpers/range';
import classes from './Table.module.css';
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from 'lucide-react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';

function Pagination({ currentPage, lastPage, onChange }) {
  const RangeStart = React.useMemo(() => {
    const start = currentPage - 2
    if (start < 1) return 0
    if (start >= lastPage - 5) return lastPage - 5
    return start
  }, [currentPage, lastPage])

  const RangeEnd = React.useMemo(() => {
    const end = RangeStart + 5
    if (end >= lastPage) return lastPage
    return end
  }, [currentPage, lastPage, RangeStart])

  return (
    <ToggleGroup.Root className={classes.pagination} type="single" defaultValue={currentPage.toString()} onValueChange={onChange}>
      <ToggleGroup.Item
        disabled={currentPage === 0}
        value="0"
        aria-label="First page">
        <ChevronsLeft size={16} />
      </ToggleGroup.Item>

      <ToggleGroup.Item
        disabled={currentPage - 1 < 0}
        value={(currentPage - 1).toString()}
        aria-label="First page">
        <ChevronLeft size={16} />
      </ToggleGroup.Item>

      {range(RangeStart, RangeEnd).map((rowIndex) => (
        <ToggleGroup.Item
          className={rowIndex === currentPage ? classes.paginationItemActive : ''}
          key={rowIndex}
          value={rowIndex.toString()}

          aria-label={rowIndex.toString()}>
          {rowIndex + 1}
        </ToggleGroup.Item>
      ))}

      <ToggleGroup.Item
        disabled={currentPage === lastPage - 1}
        value={(currentPage + 1).toString()}
        aria-label="Last page">
        <ChevronRight size={16} />
      </ToggleGroup.Item>

      <ToggleGroup.Item
        disabled={currentPage === lastPage - 1}
        value={(lastPage - 1).toString()}
        aria-label="Last page">
        <ChevronsRight size={16} />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  )
}

export default Pagination

