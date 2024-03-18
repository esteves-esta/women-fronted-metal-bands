import * as React from "react";
import { Github } from "lucide-react";
import { BandContext } from "../BandsProvider";
import Home from "../Home";
import ChartsPage from "../ChartsPage";
import Toast from "../Toast";
import { DeezerContext } from "../DeezerProvider";
import MediaPlayer from "../MediaPlayer";
import BandsTable from "../BandsTable";
import * as Progress from "@radix-ui/react-progress";
import classes from "../Home/Home.module.css";
import LoaderSvg from "../LoaderSvg";

function App() {
  const year = new Date().getFullYear();
  const { databaseChecked } = React.useContext(BandContext);
  const { trackIsLoading } = React.useContext(DeezerContext);
  return (
    <>
      <Toast />
      <main>
        <Home />

        {!databaseChecked && (
          <div className="flex flex-row gap-4 justify-center items-center">
            <p>Loading </p>
            <LoaderSvg width={50} height={50} />
          </div>
        )}

        {databaseChecked && <BandsTable />}

        {databaseChecked && <MediaPlayer />}

        {databaseChecked && trackIsLoading && (
          <div className={classes.ProgressContainer}>
            <Progress.Root className={classes.ProgressRoot}>
              <Progress.Indicator className={classes.ProgressIndicator} />
            </Progress.Root>
          </div>
        )}
      </main>

      {databaseChecked && <ChartsPage />}

      <hr />
      <footer className="mx-10 md:mx-40 py-20 flex flex-col lg:flex-row gap-5 lg:gap-0 justify-between">
        <div className="flex flex-col lg:flex-row gap-3">
          <a
            href="https://github.com/esteves-esta/women-fronted-metal-bands"
            target="_blank"
          >
            <Github size={18} />
            <small>designed & developed by esteves-esta © {year}</small>
          </a>
        </div>
        <small>
          built with: React / RadixUI / Vite / Tailwind / LucideIcons
        </small>
      </footer>
    </>
  );
}

export default App;
