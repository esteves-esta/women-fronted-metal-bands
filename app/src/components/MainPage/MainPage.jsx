import * as React from "react";

import { BandContext } from "../BandsProvider";
import Home from "../Home";
import ChartsPage from "../ChartsPage";
import Toast from "../Toast";
import { DeezerContext } from "../DeezerProvider";
import MediaPlayer from "../MediaPlayer";
import BandsTable from "../BandsTable";

import classes from "../Home/Home.module.css";
import LoaderSvg from "../LoaderSvg";

function App() {
  const { trackIsLoading } = React.useContext(DeezerContext);
 
  return (
    <>
      <Toast />
      {/* <main>
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

      {databaseChecked && <ChartsPage />} */}

      {/* <hr />
      */}
    </>
  );
}

export default App;
