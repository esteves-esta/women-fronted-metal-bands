import * as React from "react";
import { styled } from "styled-components";

function SearchBar() {
  return <Wrapper>Search...</Wrapper>;
}

const Wrapper = styled.div`
  padding: 12px 10%;
  background-color: var(--color-secondary);
  margin-bottom: 30px;
  isolation: isolate;
  z-index: 1;
  position: sticky;
  left: 0;
  top: 42px;
  font-size: 1.2rem;
  border-top: 2px solid hsl(291deg 96% 10%);

  /* border-top: 15px solid hsl(291deg 96% 10%); */
`;

export default SearchBar;
