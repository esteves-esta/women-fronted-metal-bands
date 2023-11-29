import * as React from 'react';
import DataTable, { TableColumn } from '../DataTable'
import { BandContext } from '../BandsProvider';
import { booleanTagList, growTagList } from '../../constants';
import ToogleGroupButton from '../ToogleGroupButton/ToogleGroupButton';
import { Filter, ExternalLink } from 'lucide-react';

function BandsTable() {
  const { bands, setBands } = React.useContext(BandContext)

  const handleSortBoolean = React.useCallback((valA, valB, sort: 'asc' | 'desc') => {
    if (sort === 'asc') return (valA === valB) ? 0 : valA ? -1 : 1;
    else return (valA === valB) ? 0 : valA ? 1 : -1;
  }, [])

  const formatYearsActive = React.useCallback((column: any) => {
    const { YearStarted, YearEnded } = column;

    const thisYear = new Date().getFullYear()

    let activeYears = 0
    if (YearStarted !== null) {
      activeYears = thisYear - YearStarted
      if (YearEnded) activeYears = YearEnded - YearStarted
    }

    return activeYears.toString();
  }, []);

  const columns: TableColumn[] = [
    {
      field: 'Band', formatElement: (column) => {
        if (!column.Links) return column.Band;
        return (
          <React.Fragment>
            <span className='flex items-center justify-center gap-3'>
              {column.Band}
              <a href={column.Links} target="_blank">
                <ExternalLink size={12} />
              </a>

            </span>
          </React.Fragment>
        )
      }, headerLabel: 'Band', sortable: true
    },
    { field: 'Growling', headerLabel: 'Growling', sortable: true, tagList: growTagList, type: 'tag', sort: 'desc' },
    { field: 'LGBTQ', headerLabel: 'LGBTQ', type: 'tag', tagList: booleanTagList, sortable: true, handleSort: handleSortBoolean },
    { field: 'Black Women', headerLabel: 'Black Women', type: 'tag', tagList: booleanTagList, sortable: true, handleSort: handleSortBoolean },
    { field: 'All women band', headerLabel: 'All women', type: 'tag', tagList: booleanTagList, sortable: true, handleSort: handleSortBoolean },
    { field: 'Vocalists', headerLabel: 'Vocalists', },
    { field: 'Country', headerLabel: 'Country', sortable: true },
    { format: formatYearsActive, headerLabel: 'Years', sortable: true },
    {
      format: (column) => {
        const end = column.YearEnded ? column.YearEnded : 'now'
        return `${column.YearStarted} - ${end}`
      },
      headerLabel: 'Years active',
    },
    // { field: 'Recomendation', headerLabel: 'Recomendation', },
    // { field: 'Links', headerLabel: 'Official site', type: 'link' },
  ]

  const growFilterOptions = [...growTagList, {
    value: 'viewAll', text: 'View All'
  }]
  const [growlFilter, setGrowlFilter] = React.useState('viewAll')
  const { filterByGrow } = React.useContext(BandContext)


  const handleGrowlFilter = React.useCallback((val) => {
    if (growFilterOptions.find(filter => filter.value.toString() === val)) {
      setGrowlFilter(val)
      filterByGrow(val)
    }
  }, []);

  return <div>
    <div className='flex flex-row items-center mb-5'>
      <Filter size={17} />
      <span className='mr-3'>

        Growling intensity
      </span>
      <ToogleGroupButton list={growFilterOptions} currentValue={growlFilter}
        onChange={handleGrowlFilter} />
    </div>

    <DataTable isFiltered={growlFilter !== 'viewAll'} rows={bands} columns={columns} pageSize={10} handleRowChange={setBands} />
  </div>;
}

export default BandsTable;
