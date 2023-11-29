import * as React from 'react';
import * as classes from './Table.module.css';

function TableFilter({ onChange, columns }) {
  const [search, setSearch] = React.useState('');
  const [searchType, setSearchType] = React.useState('all');
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
    <div className='flex flex-row my-5'>
      <div className='flex flex-col'>
        <label className={classes.label} htmlFor={searchTypeId}>Search by</label>
        <select className={classes.search} id={searchTypeId} value={searchType} placeholder="Search by"
          onChange={event => {
            setSearchType(event.target.value)
            handleOnChange(search, event.target.value)
          }}>
          <option value='all'>All columns</option>
          {columns.map(col => (
            <option key={col.key} value={col.key}> {col.headerLabel}</option>
          ))}
        </select>
      </div>

      <div className='flex flex-col grow'>
        <label className={classes.label} htmlFor={searchId}>Search</label>
        <input className={classes.search} id={searchId} type="text" placeholder="Search for..."
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

export default TableFilter