import * as React from "react";
import list from "../../../list-of-metal-bands/list.json";

export const BandContext = React.createContext();

function BandsProvider({ children }) {
  const initialBandList = React.useMemo(() => list, [])

  const [bands, setBands] = React.useState(() =>
    initialBandList
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

  const state = { initialBandList, bands, filterByGrow, setBands };

  return <BandContext.Provider value={state}>{children}</BandContext.Provider>;
}

export default React.memo(BandsProvider);
