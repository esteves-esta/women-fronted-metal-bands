import * as React from 'react';
import BandsTable from '../BandsTable';
import { List, Filter } from 'lucide-react';
import { growTagList } from '../../constants';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import ToogleGroupButton from '../ToogleGroupButton/ToogleGroupButton';
import { BandContext } from '../BandsProvider';

// import Image from '../../assets/jinjer.png';

function Home() {
  const growFilterOptions = [...growTagList, {
    value: 'todos', text: 'Todos'
  }]
  const [growlFilter, setGrowlFilter] = React.useState('todos')
  const { filterByGrow } = React.useContext(BandContext)


  const handleGrowlFilter = React.useCallback((val) => {
    if (growFilterOptions.find(filter => filter.value.toString() === val)) {
      setGrowlFilter(val)
      filterByGrow(val)
    }
  }, []);

  return <main className="mx-24 my-16">
    <section className='flex flex-row gap-x-6 p-5 mb-20'>
      <div className="flex-col">
        {/* <img
          src={Image}
          alt="Tatiana Shmailyuk (from ucranian band Jinjer)"
        /> */}
        <p className="text-xs">Image: Tatiana Shmailyuk (Jinjer)</p>
      </div>

      <div className="flex-col grow text-justify">
        <h1 className="title1">Women frontend </h1>
        <h2 className="title2 -mt-3">metal bands</h2>

        <p className="text-xl"> This is a tiny project to compile a list of metal / hard rock bands that have women as lead
          vocalists.</p>
        <p className="text-base">This project started when I realized that most metal/rock band that I usually listened mostly
          had man as lead vocalist. And I just got interessed in find and looking for band where with women as lead
          vocalist, and specially where said vocalist isn’t just doing the melodic parts but doing lots of growling. </p>
        <p>So I decided to make this page to compile the bands that I found and also pratice my frontend
          skills. I didn’t add genres of the bands as some don’t have it on there websites and a lot of bands change with
          time, so instead of genre you can filter bands by how much growling the singer can / usually do on the songs of
          the band.</p>

        <p className="text-xs">Note: This is an ongoing project, so there probaly is going to be missing some bands.</p>
      </div>
    </section>

    <section>
      <div className='flex flex-row items-center mb-5'>
        <List size={32} />
        <h2 className="title1 ml-3">
          List of
          <span className="title2 pl-3">bands</span>
        </h2>
      </div>

      {growlFilter}
      <div className='flex flex-row items-center mb-5'>
        <Filter size={17} />
        <span className='mr-3'>

          Growling intensity
        </span>


        <ToogleGroupButton list={growFilterOptions} currentValue={growlFilter}
          onChange={handleGrowlFilter} />
        {/* <ToggleGroup.Root type="single" defaultValue={undefined}>
          {growTagList.map(({ text, value }) => (
            <ToggleGroup.Item value={value.toString()} aria-label={text}>
              {text}
            </ToggleGroup.Item>
          ))}
          <ToggleGroup.Item value="2" aria-label="2">
            23
          </ToggleGroup.Item>
        </ToggleGroup.Root> */}
      </div>
      <BandsTable />
    </section>
  </main >;
}

export default Home;
