import MediaPlayer from '../MediaPlayer'
import BandsTable from '../BandsTable';

function Home() {

  return <article>
    <section className='home mb-20 mx-32'>
      <div className="text-justify">
        <div className='text-center mb-16'>
          <h1 className="title1">
            Women Frontend
          </h1>
          <h1 className="title2">metal bands</h1>
          <p className="text-xl mt-5"> This is a tiny project to compile a list of metal bands that have women as lead
            vocalists.</p>
        </div>

        <p>This project started when I realized that most metal/rock band that I usually listened all had men as lead vocalist.
          And this realization lead me to search for bands with women as lead
          vocalists, and specially where said vocalist isn’t just doing the melodic parts but doing lots of growling. </p>
        <p>So I decided to make this page to compile the bands that I found and also pratice my frontend
          skills. You can filter bands by how much growling the singer can / usually do on the songs of
          the band.</p>

        <small className="text-sm">Note: This is an ongoing project.</small>
      </div>
    </section>

    <BandsTable />


    <MediaPlayer />
  </article >;
}

export default Home;