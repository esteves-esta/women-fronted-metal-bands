import * as React from "react";
import Toast from "../../components/Toast";
import { BandContext } from "../../components/BandsProvider";
import BandGrid from "../../components/BandGrid";

function App() {
  const { isLoading } = React.useContext(BandContext);

  const { databaseChecked } = React.useContext(BandContext);

  if (!databaseChecked || isLoading) return <>loading</>;

  return (
    <>
      <Toast />
      <BandGrid />

    </>
  );
}

export default App;
