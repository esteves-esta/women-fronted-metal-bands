import React from 'react';
import { BandContext } from '../BandsProvider';
import classes from './ChartsPage.module.css'
import useSWR from "swr";
import { errorRetry, fetcher } from './apiFunctions';
import LoaderSvg from '../LoaderSvg';
import { Text } from '@visx/text';
import { scaleLog } from '@visx/scale';
import Wordcloud from '@visx/wordcloud/lib/Wordcloud';
import ParentSize from '@visx/responsive/lib/components/ParentSize';

export interface WordData {
  text: string;
  value: number;
}

function GenreChart() {
  const { databaseChecked } = React.useContext(BandContext)
  const [chartDetails, setChartDetails] = React.useState([]);



  const { data, isLoading } = useSWR(
    databaseChecked ? `/beginning-letter` : null,
    fetcher,
    {
      errorRetry,
      revalidateOnFocus: false,
    }
  );

  React.useEffect(() => {
    if (data !== undefined) {
      setChartDetails(data);
    }
  }, [data]);


  return (
    <div className={`flex flex-col md:flex-row items-center justify-center`}>
      {isLoading && <div className="flex justify-center items-center" style={{ width: "350px", height: "350px" }}>
        <LoaderSvg width={50} height={50} />
      </div>}
      {/* {chartDetails.length} */}
      {!isLoading && data.length > 0 && <ParentSize>
        {({ width }) => <WordCloundCustom data={chartDetails} width={width} />}
      </ParentSize>}

    </div>
  )

};

function WordCloundCustom({ data, width }) {
  const fontScale = scaleLog({
    domain: [Math.min(...data.map((w) => w.value)), Math.max(...data.map((w) => w.value))],
    range: [30, 200],
  });

  const fontSizeSetter = (datum: WordData) => fontScale(datum.value);

  const fixedValueGenerator = () => 0.5;

  // https://d3js.org/d3-scale-chromatic/sequential

  // const colors = [
  //   "#a50026",
  //   "#d73027",
  //   "#f46d43",
  //   "#fdae61",
  //   "#fee090",
  //   "#ffffbf",
  //   "#e0f3f8",
  //   "#abd9e9",
  //   "#74add1",
  //   "#4575b4",
  //   "#313695",
  // ];

  const colors = [
    "#9e0142",
    "#d53e4f",
    "#f46d43",
    "#fdae61",
    "#fee08b",
    "#ffffbf",
    "#e6f598",
    "#abdda4",
    "#66c2a5",
    "#3288bd",
    "#5e4fa2",
  ]

  // const colors = [
  //   "#7f3b08",
  //   "#b35806",
  //   "#e08214",
  //   "#fdb863",
  //   "#fee0b6",
  //   "#f7f7f7",
  //   "#d8daeb",
  //   "#b2abd2",
  //   "#8073ac",
  //   "#542788",
  //   "#2d004b",
  // ]
  function getRotationDegree() {
    const rand = Math.random();
    const degree = rand > 0.5 ? 60 : -60;
    return rand * degree;
  }

  function getColor(item: any): string {
    console.log(item)
    if (item.size <= 30) {
      return colors[10]
    }
    if (item.size <= 50) {
      return colors[9]
    }
    if (item.size <= 80) {
      return colors[8]
    }
    if (item.size <= 100) {
      return colors[4]
    }
    if (item.size <= 150) {
      return colors[2]
    }
    if (item.size === 200) {
      return colors[0]
    }
    return colors[1]
  }

  return (
    <div className={classes.wordcloud}>
      <Wordcloud
        words={data}
        width={width}
        height={400}
        fontSize={fontSizeSetter}
        font={'Cinzel'}
        padding={2}
        spiral={'rectangular'}
        rotate={getRotationDegree}
        random={fixedValueGenerator}
      >
        {(cloudWords) =>
          cloudWords.map((w) => (
            <Text
              key={w.text}
              fill={getColor(w)}
              textAnchor={'middle'}
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              fontSize={w.size}
              fontFamily={w.font}
            >
              {w.text}
            </Text>
          ))
        }
      </Wordcloud>
    </div>);
}
export default GenreChart;