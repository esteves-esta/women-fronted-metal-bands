import * as React from "react";
import Toast from "../../components/Toast";
import { BandContext } from "../../components/BandsProvider";
import BandGrid from "../../components/BandGrid";
import bands from "../../../list-of-metal-bands/list.json";

function App() {
  // const { isLoading } = React.useContext(BandContext);

  // const { databaseChecked,bands } = React.useContext(BandContext);

  // if (!databaseChecked || isLoading) return <>loading</>;

  return (
    <>
      <Toast />
      <BandGrid bands={bands} />
    </>
  );
}

export default App;
