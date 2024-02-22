
//  YES ======>
/* 

1990 = 29 - 7 => 22
1980 = 12 - 4 => 13
1970 = 2 - 1 => 1

36

> FT.SEARCH idx:bands "@yearStarted:[0 1989] -@yearEnded:[1 1980]"
> FT.AGGREGATE idx:bands "@yearStarted:[0 1989] -@yearEnded:[1 1980]" GROUPBY 0 REDUCE COUNT 0 as count
 */
export function getIfActiveOnDecade(band, decade) {
  const { yearStarted, yearEnded } = band;
  if (yearEnded !== 0) {
    return yearEnded <= decade ? 0 : 1;
  }

  return yearStarted < decade + 10 ? 1 : 0;
}

// FT.AGGREGATE idx:bands "@yearEnded:[1 2020] @yearStarted:[inf 2030]" GROUPBY 1 @band REDUCE COUNT 0 as count



// FT.AGGREGATE idx:bands @yearEnded:[0 2020] @yearStarted:[2010 2020]" GROUPBY 1 @band REDUCE COUNT 0 as count

// FT.AGGREGATE idx:bands "*" GROUPBY 2 @countryCode @country REDUCE COUNT 0 as count

//FT.SEARCH idx:bands "@yearEnded:[0 2020] @yearStarted :[2010 2020]" RETURN 3 $.yearStarted $.yearEnded $.activeFor


// FT.AGGREGATE idx:bands "-@yearEnded[0 0]" GROUPBY 0 REDUCE COUNT 0 as count FILTER "@yearEnded <= 2020 && @yearStarted < 2030"

/* 

FT.AGGREGATE idx:bands "*" GROUPBY 0
REDUCE AVG 1 @numberOfVocalists as count */