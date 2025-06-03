import * as React from "react";
import Toast from "../../components/Toast";
import { BandContext } from "../../components/BandsProvider";
import BandTable from "../../components/BandTable";
import SearchBar from "../../components/SearchBar";
import styled from "styled-components";

// import bands from "../../../list-of-metal-bands/list.json";

function App() {
  const { isLoading, totalFiltered, bands } = React.useContext(BandContext);


  return (
    <>
      <Toast />
      <SearchBar />

      <TotalSpan>
        Total: {isLoading ? '..' : totalFiltered} band{totalFiltered > 1 ? 's' : ''}
      </TotalSpan>
      {bands.length > 0 && !isLoading && <BandTable bands={bands} />}
    </>
  );
}

const TotalSpan = styled.div`
  white-space: nowrap;
  font-size: calc(10rem /16);
  text-transform: uppercase;
  font-family: var(--secondary-font-family);
  margin: 0px 10% 20px 10%;
`;

export default App;
