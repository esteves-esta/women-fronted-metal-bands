import styled from 'styled-components';
import LoaderSvg from '../LoaderSvg';
import React from 'react';


function ChartLoader(){
  return (
    <React.Fragment>
      <LoaderWrapper>
        <p>Loading </p>
        <LoaderSvg width={50} height={50} />
      </LoaderWrapper>
    </React.Fragment>
  )
}

const LoaderWrapper = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
gap: 4px;
@media ${(p) => p.theme.queries.tabletAndUp} {
flex-direction: row;
}
`;


export default ChartLoader;