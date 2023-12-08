import * as React from "react";
import list from "../../../list-of-metal-bands/list.json";
import Papa from 'papaparse';
import { downloadCsvFile } from '../../helpers/downloadCsvFile'

export const BandContext = React.createContext();

function BandsProvider({ children }) {
  const initialBandList = React.useMemo(() => list, [])

  const [bands, setBands] = React.useState(() =>
    initialBandList.map(band => {
      if (!band.deezerId) band.id = crypto.randomUUID()
      else band.id = band.deezerId
      return band
    })
  );

  const filterByGrow = (intensity) => {
    const grows = [0, 1, 2, 3];
    if (grows.includes(Number(intensity))) {
      setBands(
        initialBandList.filter((band) => band.growling === Number(intensity))
      );
    } else {
      setBands(initialBandList)
    }
  };

  function downloadAll() {
    const content = Papa.unparse(initialBandList, {
      quotes: false,
      delimiter: ",",
      header: true,
      newline: "\r\n",
      skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
      columns: null //or array of strings
    }
    );

    downloadCsvFile(content, 'women-frontend-metal-bands.csv')
  }

  function downloadFiltered() {
    const content = Papa.unparse(bands, {
      quotes: false,
      delimiter: ",",
      header: true,
      newline: "\r\n",
      skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
      columns: null //or array of strings
    }
    );

    downloadCsvFile(content, 'women-frontend-metal-bands filtered-list.csv')
  }

  const state = {
    initialBandList,
    bands,
    filterByGrow,
    setBands,
    downloadAll,
    downloadFiltered
  };

  return <BandContext.Provider value={state}>{children}</BandContext.Provider>;
}

export default React.memo(BandsProvider);
