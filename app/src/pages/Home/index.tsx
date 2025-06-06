import * as React from "react";
import Toast from "../../components/Toast";
import { BandContext } from "../../components/BandsProvider";
import BandGrid from "../../components/BandGrid";
import SearchBar from "../../components/SearchBar";
import styled from "styled-components";

function App() {
  const { isLoading, totalFiltered, bands } = React.useContext(BandContext);

  return (
    <>
      <Toast />
      <SearchBar />
      <TotalSpan>
        Total: {isLoading ? '..' : totalFiltered} band{totalFiltered > 1 ? 's' : ''}
      </TotalSpan>
      {!isLoading && bands.length > 0 && <BandGrid bands={bands} />}
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
