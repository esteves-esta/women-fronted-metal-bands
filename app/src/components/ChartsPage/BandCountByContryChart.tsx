// @ts-nocheck
import React from 'react';
import { ResponsiveWaffle } from '@nivo/waffle'
import { BandContext } from '../BandsProvider';
import colors from './colors'
import useMatchMedia from '../../helpers/useMatchMedia';
import useSWR from "swr";
import { errorRetry, fetcher } from './apiFunctions';
import LoaderSvg from '../LoaderSvg';
import { styled } from "styled-components";
import { useLiveQuery } from "dexie-react-hooks";
import { getChart } from '../../database/charts'

function BandCountByContryChart({ filter, filterGrow }) {
  const { databaseChecked, total } = React.useContext(BandContext)
  const [chartData, setChartData] = React.useState([])
  const [bandCount, setBandCount] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(true)

  const data = useLiveQuery(() => {
    setIsLoading(true);
    return getChart(filter, filterGrow)
  }, [filter, filterGrow]);


  React.useEffect(() => {
    setBandCount(0)
    if (data !== undefined) {
      let colorIndex = colors.length
      const newChartData = []
      Object.entries(data).forEach(([key, value]) => {

        colorIndex -= 1
        setBandCount(count => count + value)
        newChartData.push({
          color: colors[colorIndex],
          id: key,
          label: key,
          value: value
        })
      })
      newChartData.sort((a, b) => b.value - a.value);
      setChartData(newChartData)
    }
    setIsLoading(false);
  }, [data]);

  const isMediaNarrow = useMatchMedia();

  if (!isLoading)
    return (<React.Fragment>
      <Wrapper>
        <p>
          Total countries: {" "}
          <span> {chartData.length}</span>
        </p>

        <p>
          Total bands : {" "}
          <span>{bandCount}</span>
        </p>
      </Wrapper>

      <ResponsiveWaffle
        data={chartData}
        total={total + 5}
        rows={isMediaNarrow ? 20 : 10}
        columns={isMediaNarrow ? 15 : ((total + 5) / 5)}
        padding={2}
        borderRadius={10}
        fillDirection='right'
        motionStagger={2}
        emptyColor='#444'
        colors={{
          datum: 'color'
        }}
        margin={{ left: 30, right: 30, top: 0 }}
        // legends={[
        //   {
        //     anchor: 'top-left',
        //     direction: 'row',
        //     padding: 10,
        //     translateY: -30,
        //     itemsSpacing: 4,
        //     itemWidth: 40,
        //     itemHeight: 5,
        //     itemDirection: 'left-to-right',
        //     itemTextColor: '#fff ',
        //     symbolSize: 10,
        //     symbolShape: 'circle',
        //     effects: [
        //       {
        //         on: 'hover',
        //         style: {
        //           itemOpacity: 0.5,
        //         }
        //       }
        //     ]
        //   }
        // ]}
        tooltip={
          ({ data }) => {
            return (<div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexDirection: 'row', padding: 12, backgroundColor: "#444", }}>
              <div style={{ backgroundColor: data.color, height: '15px', width: '15px' }}></div>
              <strong>{data.id}: {data.value}</strong>
            </div >)
          }
        }
      />
    </React.Fragment>
    );


  return (<React.Fragment>
    <LoaderWrapper>
      <p>Loading </p>
      <LoaderSvg width={50} height={50} />
    </LoaderWrapper>
  </React.Fragment>)
};

export default BandCountByContryChart;

const LoaderWrapper = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
gap: 4px;
`;

const Wrapper = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
gap: 5px;
@media ${(p) => p.theme.queries.tabletAndUp} {
flex-direction: row;
}
p {
  text-align: center;
  margin-top: 10px;
   color: var(--text-title);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 1rem;
}
span {
   color: white;
}
`;
