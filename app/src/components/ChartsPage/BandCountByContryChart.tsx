import React from 'react';
import { ResponsiveWaffle } from '@nivo/waffle'
import { BandContext } from '../BandsProvider';
import colors from './colors'
import useMatchMedia from '../../helpers/useMatchMedia';
import useSWR from "swr";
import { errorRetry, fetcher } from './apiFunctions';
import LoaderSvg from '../LoaderSvg';

function BandCountByContryChart({ filter, filterGrow }) {
  const { databaseChecked, total } = React.useContext(BandContext)
  const [chartData, setChartData] = React.useState([])
  const [bandCount, setBandCount] = React.useState(0)


  const { data, isLoading } = useSWR(
    databaseChecked
      ? `/count-by-country/${filter === 'viewAll' ? null : filter}/${filterGrow === 'viewAll' ? null : filterGrow}`
      : null,
    fetcher,
    {
      errorRetry,
      revalidateOnFocus: false,
    }
  );

  React.useEffect(() => {
    setBandCount(0)
    if (data !== undefined) {
      let colorIndex = colors.length
      const newChartData = data.results.map((result) => {
        colorIndex -= 1
        setBandCount(count => count + Number(result.count))
        return {
          color: colors[colorIndex],
          id: result.country,
          label: result.countryCode,
          value: result.count
        }
      })
      newChartData.sort((a, b) => b.value - a.value);
      setChartData(newChartData)
    }
  }, [data]);

  const isMediaNarrow = useMatchMedia();

  if (!isLoading)
    return (<React.Fragment>
      <div className='flex flex-col md:flex-row gap-5 justify-center'>
        <p className='text-center title3 mt-10'>
          Total countries: {" "}
          <span className='font-black'> {chartData.length}</span>
        </p>

        <p className='text-center title3 mt-10'>
          Total bands : {" "}
          <span className='font-black'>{bandCount}</span>
        </p>
      </div>

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
  else return (<React.Fragment>
    <div className="flex flex-row gap-4 justify-center items-center">
      <p>Loading </p>
      <LoaderSvg width={50} height={50} />
    </div>
  </React.Fragment>)
};

export default BandCountByContryChart;