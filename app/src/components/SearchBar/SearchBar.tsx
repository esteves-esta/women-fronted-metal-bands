import * as React from "react";
import { styled } from "styled-components";
import { Search as SearchIcon, Filter, ChevronDown, ArrowUpAZ, ArrowDownAZ, FilterX } from 'lucide-react';
import { BandContext } from "../BandsProvider";
import Dropdown from '../Dropdown'
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import ToogleGroupButton from "../ToogleGroupButton";
import { filterGenderOptions, filterStatusOptions, growFilterOptions } from "../../constants";

function SearchBar() {
  const { handleQuery, handleFilter, searchParams, handleSort } = React.useContext(BandContext);

  const [growlFilter, setGrowlFilter] = React.useState(() => {
    return searchParams.growling ? searchParams.growling.toString() : ''
  });
  const [openFilters, setOpenFilters] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [searchType, setSearchType] = React.useState('all');
  const [sortBy, setSortBy] = React.useState(searchParams.sortBy);
  const [sort, setSort] = React.useState(searchParams.sort);

  const [filtersList, setFiltersList] = React.useState<string[]>([]);
  const [statusFilter, setStatusFilter] = React.useState('');
  const [genderFilter, setGenderFilter] = React.useState('');
  const [blackFilter, setBlackFilter] = React.useState('');
  const [sisterFilter, setSisterFilter] = React.useState('');

  const id = React.useId();
  const searchId = `${id}-search`;
  const [timeoutid, setTimeoutid] = React.useState<number | null>(null);

  const handleFilterList = (val: string, values: string[]) => {
    let newFilter = [...filtersList];
    newFilter = newFilter.filter(item => !values.includes(item))

    if (val) newFilter = [...newFilter, val];
    setFiltersList(
      [...newFilter]
    )

    // console.log({ newFilter })

    handleFilter(growlFilter === '' ? null : Number(growlFilter), newFilter);
  }

  const handleOnChange = (search, searchType, delay) => {
    // console.log({
    //   search, searchType
    // })
    if (timeoutid) {
      clearTimeout(timeoutid)
      setTimeoutid(null);
    }

    const timeout = window.setTimeout(() => {
      handleQuery(search, searchType === "all" ? '' : searchType);
    }, delay)

    setTimeoutid(timeout);

    // return () => window.clearTimeout(timeoutId)
  };

  const handleGrowlFilter = React.useCallback(
    (val) => {
      setGrowlFilter(val);
      handleFilter(val === '' ? null : val, []);
    },
    []
  );


  const options = [
    { key: 'all', headerLabel: 'All columns' },
    { key: 'band', headerLabel: 'Band' },
    { key: 'numberOfVocalists', headerLabel: "Nº Voc." },
    { key: 'currentVocalists', headerLabel: 'Vocalists' },
    { key: 'country', headerLabel: 'Country' },
    { key: 'activeFor', headerLabel: 'Active for' },
    { key: 'yearStarted', headerLabel: 'Start' },
    { key: 'yearEnded', headerLabel: 'End' }
  ]

  const sortingOptions = [
    { key: 'band', headerLabel: 'Band' },
    { key: 'growling', headerLabel: 'Growling' },
    // { key: 'numberOfVocalists', headerLabel: "Nº Voc." },
    { key: 'country', headerLabel: 'Country' },
    { key: 'activeFor', headerLabel: 'Active for' },
    { key: 'yearStarted', headerLabel: 'Start' },
    { key: 'yearEnded', headerLabel: 'Status' },
    { key: 'blackWomen', headerLabel: 'Black woman' },
    { key: 'allWomenBand', headerLabel: 'All Women band' }
  ]





  return <Wrapper>
    <ResponsiveRow>
      <ColumnFilter>
        {/* <label className='label' htmlFor={searchTypeId}>Search by</label> */}
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
          {searchType === 'all' &&
            options.find(opt => opt.key === searchType).headerLabel
          }

          {searchType !== 'all' &&
            <DropdownLabel>
              {options.find(opt => opt.key === searchType).headerLabel}
            </DropdownLabel>
          }
          <ChevronDown />
        </Dropdown>
      </ColumnFilter>

      <SecondRow>
        <SearchWrapper>
          <Search id={searchId} type="text" placeholder="Search for..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              handleOnChange(event.target.value, searchType, 2000)
            }} />
          <Icon />
        </SearchWrapper>

        <ToogleFilterButton onClick={() => setOpenFilters(!openFilters)}>
          {openFilters ?
            <FilterX /> :
            <Filter />}
        </ToogleFilterButton>
      </SecondRow>
    </ResponsiveRow>
    {
      openFilters &&
      <Row>
        <GrowlCol>
          growling
          <ToogleGroupButton
            list={growFilterOptions}
            currentValue={growlFilter}
            onChange={handleGrowlFilter}
          />
        </GrowlCol>

        <DetailsCol>
          filters
          <ToogleGroupButton
            list={filterStatusOptions}
            currentValue={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              handleFilterList(val, filterStatusOptions.map(item => item.value));
            }}
          />
          <ToogleGroupButton
            list={filterGenderOptions}
            currentValue={genderFilter}
            onChange={(val) => {
              setGenderFilter(val);
              handleFilterList(val, filterGenderOptions.map(item => item.value));
            }}
          />

          <ToogleGroupButton
            list={[{ value: "blackWomen", text: "Black women" }]}
            currentValue={blackFilter}
            onChange={(val: string) => {
              setBlackFilter(val);
              handleFilterList(val, ['blackWomen']);
            }}
          />
          <ToogleGroupButton
            list={[{ value: "sister", text: "Sisters" }]}
            currentValue={sisterFilter}
            onChange={(val: string) => {
              setSisterFilter(val);
              handleFilterList(val, ['sister']);
            }}
          />
        </DetailsCol>


        <SortCol>
          <Label>
            sort by
          </Label>

          <Dropdown
            background={true}
            radioOptions={sortingOptions}
            handleChange={(selected) => {
              // console.log(selected)
              setSortBy(selected)
              handleSort(selected, sort)
            }}
            radioValue={sortBy}
            labelName="headerLabel"
            keyName="key"

          >

            {sortingOptions.find(opt => opt.key === sortBy).headerLabel}

          </Dropdown>
          <FilterIconBtn onClick={() => {
            const newSort = sort === 'asc' ? 'desc' : 'asc';
            setSort(newSort);
            handleSort(sortBy, newSort);
          }}>
            {sort === "asc" && <ArrowUpAZ size={20} />}
            {sort === "desc" && <ArrowDownAZ size={20} />}
            <VisuallyHidden.Root>
              Toggle sorting
            </VisuallyHidden.Root>
          </FilterIconBtn>

        </SortCol>
      </Row>
    }
  </Wrapper >;
}

const FilterIconBtn = styled.button`
  flex: 0 1 40px;
  padding: 5px 8px;
  border-radius: .8rem;
  background: var(--color-secondary-dark);
  border-radius: 9px;
  border: 1px solid var(--color-grey-500);
  color: var(--text-color);
  letter-spacing: .05rem !important;
  cursor: pointer;
  font-size: calc(12rem /16);

`;



const Label = styled.label`
text-transform: uppercase;
white-space: nowrap;
/* font-weight: bold; */
letter-spacing: .02rem;
font-size: calc(11rem /16);
color: var(--text-color-9);
display: flex;
flex-direction: row;
gap: 5px;
align-items: center;
`;


const SortCol = styled.div`
/* flex: 1 0 auto; */
display: flex;
flex-direction: row;
gap: 10px;
align-items: center;
font-size: calc(14rem /16);
`;
const GrowlCol = styled(Label)`
/* flex: 2 0 auto; */
`;
const DetailsCol = styled(Label)`
flex: 3 0 auto;
flex-wrap: wrap;
`;

const ColumnFilter = styled.div`
flex: 1 0 auto;
  @media ${(p) => p.theme.queries.tabletAndUp} {
     flex: 1 0 150px;

  }
`;

const DropdownLabel = styled.span`
  color:  var(--color-primary-light);
`;

const Icon = styled(SearchIcon)`
 color: var(--text-color);
 flex: 1 0 auto;
`;

const ToogleFilterButton = styled.button`
  flex: 0 1 auto;
  background: transparent;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  width: 30px;
`;

const SecondRow = styled.div`
  display: flex;
  flex-direction: row;
  flex: 15 0 auto;
  gap: 10px;
`;

const SearchWrapper = styled.div`
 flex: 3 0 auto;
display: flex;
align-items:center;
gap: 10px;
vertical-align: baseline;
border-bottom: 1px solid transparent;

&:focus-within ${Icon} {
  color: var(--color-primary-light);
  border-color:var(--color-primary-light);
}

& svg {
  flex: 1 0 auto;
}
`;

const Search = styled.input`
flex: 100 0 auto;
background-color: transparent;
border: none;
color: var(--color-primary-light);
&:focus {
  outline: none;
}
&::placeholder {
  color:var(--text-color);
}
`;

const BaseRow = styled.div`
padding: 12px 10%;
`;

const ResponsiveRow = styled(BaseRow)`
  display: flex;
  flex-direction: column;
  gap: 5px;
  @media ${(p) => p.theme.queries.tabletAndUp} {
    flex-direction: row;
    align-items:center;
    gap: 10px;
  }
`;


const Row = styled(BaseRow)`
  display: flex;
  flex-direction: column;
  gap: 5px 25px;
  flex-wrap: wrap;
  background-color: var(--color-dark-alpha-3);
  border-bottom: 1px solid var(--color-dark-alpha-5);
  @media ${(p) => p.theme.queries.tabletAndUp} {
    /* flex-wrap: nowrap; */
    flex-direction: row;
    align-items:center;
    gap: 10px 20px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--color-secondary);
  margin-bottom: 30px;
  isolation: isolate;
  z-index: 1;
  position: sticky;
  left: 0;
  font-size: 1.2rem;
  border-top: 2px solid hsl(291deg 96% 10%);
  top: 100px;
  @media ${(p) => p.theme.queries.tabletAndUp} {
    top: 40px;
  }
`;

export default SearchBar;
