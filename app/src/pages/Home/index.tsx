import * as React from "react";
import Toast from "../../components/Toast";
import { BandContext } from "../../components/BandsProvider";
function App() {
  const year = new Date().getFullYear();
  const {
    bands,
    total,
    isLoading,
    totalFiltered,
    handleFilter,
    handleSort,
    downloadAll,
    downloadFiltered,
    handleQuery,
    searchParams
  } = React.useContext(BandContext);

  const { databaseChecked } = React.useContext(BandContext);

  if (!databaseChecked) return <>loading</>;

  return (
    <>
      <Toast />

      {bands.map((band) => (
        <div>{band.name}</div>
      ))}
    </>
  );
}

export default App;
