import * as React from "react";
import Toast from "../../components/Toast";
import { BandContext } from "../../components/BandsProvider";
import BandTable from "../../components/BandTable";
import SearchBar from "../../components/SearchBar";

// import bands from "../../../list-of-metal-bands/list.json";

function App() {
  const { isLoading } = React.useContext(BandContext);

  const { databaseChecked, bands } = React.useContext(BandContext);

  return (
    <>
      <Toast />
      <SearchBar />

      {databaseChecked && !isLoading && <BandTable bands={bands} />}
    </>
  );
}

export default App;
