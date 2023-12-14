import MediaPlayer from '../MediaPlayer'
import BandsTable from '../BandsTable';
import * as Progress from '@radix-ui/react-progress';
import classes from './Home.module.css'
import { DeezerContext } from '../DeezerProvider';
import React from 'react';

function Home() {
  const { trackIsLoading } = React.useContext(DeezerContext)
  
  return <article>
    <section className='home'>
      <div className="text-justify">
        <div className='text-center mb-16'>
          <h1 className="title1">
            Women Fronted
          </h1>
          <h1 className="title2">metal bands</h1>
          <p className="text-xl mt-5"> This is a project to compile a list of metal bands that have women as lead
            vocalists.</p>
        </div>

        <p>This project started when I realized that most metal/rock band that I usually listened all had men as lead vocalist.
          And this realization lead me to search for bands with women as lead
          vocalists, and specially where said vocalist isn’t just doing the melodic parts but doing lots of growling. </p>
        <p>So I decided to make this page to compile the bands that I found and also pratice my frontend
          skills. You can filter bands by how much growling the singer is capable of doing.</p>

        <small className="text-sm">Note: This is an ongoing project. To see from where these data has been collected{" "}
          <a className='inline' href="https://github.com/esteves-esta/women-fronted-metal-bands#sources" target="_blank"> click here</a></small>
      </div>
    </section>

    <BandsTable />


    <MediaPlayer />

    {trackIsLoading && <div className={classes.ProgressContainer}>
      <Progress.Root className={classes.ProgressRoot}>

        <Progress.Indicator
          className={classes.ProgressIndicator}
        />
      </Progress.Root>
    </div>}
  </article >;
}

export default Home;