import * as React from "react";
import ChartsPage from "../../components/ChartsPage";
import { BandContext } from "../../components/BandsProvider";

function Charts() {
  const { databaseChecked } = React.useContext(BandContext);

  if (!databaseChecked) return <>loading</>;

  return <ChartsPage />;
}

export default Charts;
