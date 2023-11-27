import * as React from "react";
import list from "../../../list-of-metal-bands/list.json";

export const BandContext = React.createContext();

function BandsProvider({ children }) {
  const bandsList = list.filter((band) => !band.Cover && !band["Not Metal"])

  const [bands, setBands] = React.useState(() =>
    bandsList
  );
  const [covers, setCovers] = React.useState(() =>
    list.filter((band) => !!band.Cover)
  );

  const filterByGrow = (intensity) => {
    const grows = [0, 1, 2, 3];
    if (grows.includes(Number(intensity))) {
      setBands(
        bandsList.filter((band) => band.Growling === Number(intensity))
      );
    } else {
      setBands(bandsList)
    }
  };

  const state = { bands, covers, filterByGrow, setBands };

  return <BandContext.Provider value={state}>{children}</BandContext.Provider>;
}

export default React.memo(BandsProvider);
