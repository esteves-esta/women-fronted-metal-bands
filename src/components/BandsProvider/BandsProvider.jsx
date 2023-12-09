// jsx file because didnt know how to type context
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


  const filter = React.useCallback((growIntensity, detailFilter) => {
    const details = ['active', 'disbanded', 'all women',
      'mixed', 'black women', 'sister',];
    const grows = [0, 1, 2, 3];
    let filtered = [...initialBandList]

    if (grows.includes(Number(growIntensity))) {
      filtered = initialBandList.filter((band) => band.growling === Number(growIntensity))
    }

    if (details.includes(detailFilter)) {
      if (detailFilter === 'active') filtered = filtered.filter((band) => !band.yearEnded)
      if (detailFilter === 'disbanded') filtered = filtered.filter((band) => band.yearEnded)
      if (detailFilter === 'all women') filtered = filtered.filter((band) => band.allWomenBand)
      if (detailFilter === 'mixed') filtered = filtered.filter((band) => !band.allWomenBand)
      if (detailFilter === 'sister') filtered = filtered.filter((band) => band.sister)
      if (detailFilter === 'black women') filtered = filtered.filter((band) => band.blackWomen)
    }

    setBands(filtered);
  }, []);

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
    filter,
    setBands,
    downloadAll,
    downloadFiltered
  };

  return <BandContext.Provider value={state}>{children}</BandContext.Provider>;
}

export default React.memo(BandsProvider);
