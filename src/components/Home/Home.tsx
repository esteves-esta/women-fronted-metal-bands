import * as React from 'react';
import BandsTable from '../BandsTable';
import { List } from 'lucide-react';

function Home() {


  return <article>
    <section className='mb-20'>
      <div className="text-justify">
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

      <h2 className="title1">
        The List
      </h2>



      <BandsTable />
    </section>
  </article >;
}

export default Home;
