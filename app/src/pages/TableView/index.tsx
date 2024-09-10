import * as React from "react";
import Toast from "../../components/Toast";
// import { BandContext } from "../../components/BandsProvider";
import BandTable from "../../components/BandTable";
import bands from "../../../list-of-metal-bands/list.json";
import { Band } from "../../models/Band";
import SearchBar from "../../components/SearchBar";

function App() {
  // const { isLoading } = React.useContext(BandContext);

  // const { databaseChecked,bands } = React.useContext(BandContext);

  // if (!databaseChecked || isLoading) return <>loading</>;

  return (
    <>
      <Toast />
      <SearchBar />
      <BandTable bands={bands as Band[]} />
    </>
  );
}

export default App;
