import * as React from 'react';
import classes from './Table.module.css';
import { Search } from 'lucide-react';
import Dropdown from '../Drowdown'

function TableFilter({ onChange, columns }) {
  const [search, setSearch] = React.useState('');
  const [searchType, setSearchType] = React.useState('all');
  const id = React.useId();

  const searchId = `${id}-search`;
  const searchTypeId = `${id}-seachType`;

  const [timeoutid, setTimeoutid] = React.useState<number | null>(null);

  const handleOnChange = (search, searchType, delay) => {
    // console.log({
    //   search, searchType
    // })
    if (timeoutid) {
      clearTimeout(timeoutid)
      setTimeoutid(null);
    }

    const timeout = window.setTimeout(() => {
      onChange(search, searchType);
    }, delay)

    setTimeoutid(timeout);

    // return () => window.clearTimeout(timeoutId)
  };

  const options = columns.filter(col => col.filter && col)
  options.unshift({ key: 'all', headerLabel: 'All columns' })
  return (
    <div className={`${classes.filter}`} >
      <div className={classes.filterSearchCol}>
        <label className='label' htmlFor={searchTypeId}>Search by</label>
        <Dropdown
          radioOptions={options}
          handleChange={(selected) => {
            // console.log(selected)
            setSearchType(selected)
            handleOnChange(search, selected, 0)
          }}
          radioValue={searchType}
          labelName="headerLabel"
          keyName="key"
        >
          {options.find(opt => opt.key === searchType).headerLabel}
        </Dropdown>
      </div>

      <div className={classes.filterInputCol}>
        <label className='label' htmlFor={searchId}>Search</label>
        <div className={`flex flex-row items-center ${classes.search}`}>
          <input id={searchId} type="text" placeholder="Search for..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              handleOnChange(event.target.value, searchType, 2000)
            }}
          />
          <Search size={15} />
        </div>
      </div>
    </div >
  )
}

export default TableFilter