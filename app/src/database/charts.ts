// import { SearchParams } from "../models/SearchParams"
import { db } from "./db";
import countriesCodes from "../constants/countriesCodes";

export async function getCountryCountChart(filterCol: string, filterGrow: number) {
  try {
    const result = {}
    await db.bands
      .orderBy('countryCode')
      .filter(band => {
        let grow = true;
        let filter = true;
        if (filterGrow >= 0) grow = band.growling === filterGrow
        if (filterCol) {
          switch (filterCol) {
            case "active": {
              filter = band.yearEnded === 0;
              break;
            }
            case "disbanded": {
              filter = band.yearEnded !== 0;
              break;
            }
            case "mixedGender": {
              filter = !band.allWomenBand;
              break;
            }
            case "viewAll": {
              break;
            }
            default: {
              filter = !!band[filterCol];
              break;
            }
          }
        }

        return filter && grow;
      })
      .eachKey(countryCode => {
        const code = countryCode.toString()
        result[code] = (result[code] || 0) + 1;
      });
    return result;
  }
  catch (e) {
    console.log(e)
  }
}

export async function getGenreChart() {
  try {
    const result = {}
    await db.bands
      .orderBy('genre')
      .eachKey(genre => {
        const code = genre.toString()
        result[code] = (result[code] || 0) + 1;
      });
    return result;
  }
  catch (e) {
    console.log(e)
  }
}

export async function getBandsActive() {
  try {

    let chartData = [
      { id: "1", value: 0 },
      { id: "2", value: 0 },
      { id: "3", value: 0 },
      { id: "4", value: 0 },
      { id: "5-10", value: 0 },
      { id: "10-20", value: 0 },
      { id: "20-30", value: 0 },
      { id: "30-40", value: 0 },
      { id: "40-50", value: 0 },
    ];

    const beginEnd = [
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 11],
      [10, 20],
      [20, 30],
      [30, 40],
      [40, 50],
    ];

    let sumValues = 0;
    let count = 0;

    await db.transaction('r', db.bands, async () => {
      count = await db.bands.count()

      await db.bands
        .orderBy('activeFor')
        .eachKey((activeFor) => { sumValues += Number(activeFor) });

      await beginEnd.forEach(async ([start, end], index) => {
        chartData[index].value = await db.bands
          .where("activeFor").between(start, end)
          .count()
      })
    })
    return { chartData, average: Math.round(sumValues / count) };
  }
  catch (e) {
    console.log(e)
  }
}


export async function getDetails(filter: string) {
  try {
    const allwomenData = [
      { id: "all women", value: 0 },
      { id: "mixed", value: 0 },
    ];
    const blackwomenData = [
      { id: "other", value: 0 },
      { id: "black women", value: 0 },
    ];
    const sisterData = [
      { id: "yes", value: 0 },
      { id: "no", value: 0 },
    ];

    const statusData = [
      { id: "active", value: 0 },
      { id: "disbanded", value: 0 },
    ];
    let filters = (band) => !!band
    if (filter && filter != "viewAll") {
      switch (filter) {
        case "active":
          filters = (band) => !band.yearEnded;
          break;
        case "disbanded":
          filters = (band) => !!band.yearEnded;
          break;
      }
    }

    await db.transaction('r', db.bands, async () => {
      await db.bands
        .filter(band => !band.allWomenBand && filters(band))
        .eachKey(() => {
          allwomenData[0].value += 1;
        });

      await db.bands
        .filter(band => band.allWomenBand && filters(band))
        .eachKey(() => {
          allwomenData[1].value += 1;
        });

      await db.bands
        .filter(band => !band.blackWomen && filters(band))
        .eachKey(() => {
          blackwomenData[0].value += 1;
        });

      await db.bands
        .filter(band => band.blackWomen && filters(band))
        .eachKey(() => {
          blackwomenData[1].value += 1;
        });

      await db.bands
        .filter(band => !band.sister && filters(band))
        .eachKey(() => {
          sisterData[0].value += 1;
        });

      await db.bands
        .filter(band => band.sister && filters(band))
        .eachKey(() => {
          sisterData[1].value += 1;
        });

      await db.bands
        .filter(band => !band.yearEnded)
        .eachKey(() => {
          statusData[0].value += 1;
        });

      await db.bands
        .filter(band => !!band.yearEnded)
        .eachKey(() => {
          statusData[1].value += 1;
        });
    });

    return {
      allwomenData,
      blackwomenData,
      sisterData,
      statusData
    };
  }
  catch (e) {
    console.log(e)
  }


}


export async function getActivityByEachDecade() {
  try {
    let chartData: any[] = [
      { id: "1970", value: 0 },
      { id: "1980", value: 0 },
      { id: "1990", value: 0 },
      { id: "2000", value: 0 },
      { id: "2010", value: 0 },
      { id: "2020", value: 0 },
    ];

    const decadeBeginEnd = [
      [1970, 1980],
      [1980, 1990],
      [1990, 2000],
      [2000, 2010],
      [2010, 2020],
      [2020, 2030],
    ];

    await decadeBeginEnd.forEach(async ([start, end], index) => {
      chartData[index].value = await db.bands
        .where("yearStarted").between(start, end)
        .count()
    })

    return chartData;
  }
  catch (e) {
    console.log(e)
  }
}


export async function getActivityByDecadeAndCountry() {
  try {
    const decadeBeginEnd = [
      [1970, 1980],
      [1980, 1990],
      [1990, 2000],
      [2000, 2010],
      [2010, 2020],
      [2020, 2030],
    ];
    const result = {}
    await db.transaction('r', db.bands, async () => {
      countriesCodes.forEach((code) => {
        result[code] = {
          id: code,
          id2: code,
          data: [
            { x: "70s", y: 2 },
            { x: "80s", y: 3 },
            { x: "90s", y: 0 },
            { x: "00s", y: 0 },
            { x: "10s", y: 0 },
            { x: "20s", y: 0 },
          ]
        }
      })
      const arr = []
      countriesCodes.forEach((code) => {
        decadeBeginEnd.forEach(([start, end], index) => {
          arr.push([code, start, end, index])
        })
      })

      await arr.forEach(async ([code, start, end, index]) => {
        result[code].data[index].y = await db.bands
          .where("yearStarted").between(start, end)
          .and(band => band.countryCode === code)
          .count()
      })
    });

    return Object.entries(result).map(([, value]) => value)

  }
  catch (e) {
    // console.log(e)
  }
}


export async function getActiveByCountry() {
  try {
    const beginEnd = [
      [0, 5],
      [5, 11],
      [10, 20],
      [20, 30],
      [30, 40],
      [40, 50],
    ];
    const result = {}
    await db.transaction('r', db.bands, async () => {
      countriesCodes.forEach((code) => {
        result[code] = {
          id: code,
          id2: code,
          data: [
          { x: "1-5", y: 0 },
          { x: "5-10", y: 0 },
          { x: "10-20", y: 0 },
          { x: "20-30", y: 0 },
          { x: "30-40", y: 0 },
          { x: "40-50", y: 0 },
          ]
        }
      })
      const arr = []
      countriesCodes.forEach((code) => {
        beginEnd.forEach(([start, end], index) => {
          arr.push([code, start, end, index])
        })
      })

      await arr.forEach(async ([code, start, end, index]) => {
        result[code].data[index].y = await db.bands
          .where("activeFor").between(start, end)
          .and(band => band.countryCode === code)
          .count()
      })
    });

    return Object.entries(result).map(([, value]) => value)

  }
  catch (e) {
    // console.log(e)
  }
}
