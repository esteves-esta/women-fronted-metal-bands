import * as React from 'react';
import DataTable, { TableColumn } from '../DataTable'
import list from '../../../list-of-metal-bands/list.json'
import { TagInfo } from '../Tag';

const booleanTagList: TagInfo[] = [{ value: true, text: 'sim', type: 'success' }, { value: false, text: 'não', type: 'danger' }];

const columns: TableColumn[] = [
  { field: 'Band', headerLabel: 'Band', },
  // { field: 'Feat', headerLabel: 'Feat', type: 'tag', tagList: booleanTagList  },
  // { field: 'Cover', headerLabel: 'Cover', type: 'tag', tagList: booleanTagList },
  { field: 'LGBTQ', headerLabel: 'LGBTQ', type: 'tag', tagList: booleanTagList },
  { field: 'Black Women', headerLabel: 'Black Women', type: 'tag', tagList: booleanTagList },
  { field: 'All women band', headerLabel: 'All women', type: 'tag', tagList: booleanTagList },
  { field: 'Vocalists', headerLabel: 'Vocalists', },
  { field: 'Country', headerLabel: 'Country', },
  { format: formatYearsActive, headerLabel: 'Years', },
  { format: (column) => {
   const end =  column.YearEnded ? column.YearEnded : 'now'
    return `${column.YearStarted} - ${end}`
  }, 
  headerLabel: 'Years active', },
  { field: 'Recomendation', headerLabel: 'Recomendation', },
  { field: 'Links', headerLabel: 'Official site', type: 'link' },
]

function formatYearsActive(column: any) {
  const { YearStarted, YearEnded } = column;

  const thisYear = new Date().getFullYear()
  let activeYears = thisYear - YearStarted
  if (YearEnded) activeYears = YearEnded - YearStarted

  return activeYears.toString();
}

function Home() {
  return <div>
    <DataTable rows={list} columns={columns} pageSize={10} />
  </div>;
}

export default Home;
