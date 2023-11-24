import * as React from 'react';
import DataTable, { TableColumn } from '../DataTable'
import list from '../../../list-of-metal-bands/list.json'
import { TagInfo } from '../Tag';

const booleanTagList: TagInfo[] = [{ value: true, text: 'sim', type: 'success' }, { value: false, text: 'não', type: 'danger' }];

const columns: TableColumn[] = [
  { field: 'Band', headerLabel: 'Band', sortable: true },
  // { field: 'Feat', headerLabel: 'Feat', type: 'tag', tagList: booleanTagList  },
  // { field: 'Cover', headerLabel: 'Cover', type: 'tag', tagList: booleanTagList },
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
  { field: 'Recomendation', headerLabel: 'Recomendation', },
  { field: 'Links', headerLabel: 'Official site', type: 'link' },
]

function handleSortBoolean(valA, valB, sort: 'asc' | 'desc') {
  if(sort === 'asc') return (valA === valB) ? 0 : valA ? -1 : 1;
  else return (valA === valB) ? 0 : valA ? 1 : -1;
}

function formatYearsActive(column: any) {
  const { YearStarted, YearEnded } = column;

  const thisYear = new Date().getFullYear()

  let activeYears = 0
  if (YearStarted !== null) {
    activeYears = thisYear - YearStarted
    if (YearEnded) activeYears = YearEnded - YearStarted
  }

  return activeYears.toString();
}

function Home() {
  return <div>
    <DataTable rows={list} columns={columns} pageSize={10} />
  </div>;
}

export default Home;
