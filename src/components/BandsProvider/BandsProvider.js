import * as React from "react";
import list from "../../../list-of-metal-bands/list.json";

export const BandContext = React.createContext();

function BandsProvider({ children }) {
  const initialBandList = list.filter((band) => !band.Cover && !band["Not Metal"])

  const [bands, setBands] = React.useState(() =>
    initialBandList
  );
  const [covers, setCovers] = React.useState(() =>
    list.filter((band) => !!band.Cover)
  );

  const filterByGrow = (intensity) => {
    const grows = [0, 1, 2, 3];
    if (grows.includes(Number(intensity))) {
      setBands(
        initialBandList.filter((band) => band.Growling === Number(intensity))
      );
    } else {
      setBands(initialBandList)
    }
  };

  const state = { initialBandList, bands, covers, filterByGrow, setBands };

  return <BandContext.Provider value={state}>{children}</BandContext.Provider>;
}

export default React.memo(BandsProvider);
