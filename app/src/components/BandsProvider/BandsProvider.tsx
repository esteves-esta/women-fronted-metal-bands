import * as React from "react";
import list from "../../../list-of-metal-bands/list.json";
import Papa from "papaparse";
import { downloadCsvFile } from "../../helpers/downloadCsvFile";
import { ToastContext } from "../ToastProvider";
// import { DEEZER_API } from "../../constants";
import { Band, TrackInfo } from "../../models/Band";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../database/db";
import Fuse from 'fuse.js'
import { SearchParams } from "../../models/SearchParams";
import { searchQueryBuild } from "../../database/query";

interface IBandContext {
  databaseChecked: boolean;
  total: number;
  isLoading: boolean;
  totalFiltered: number;
  bands: Band[];
  currentPage: number;
  searchParams: SearchParams;
  handleFilter: (growIntensity: number, detailFilter: string[]) => void;
  handleQuery: (query?: string, col?: string) => void;
  handlePageChange: (page: number) => void;
  handleSort: (sortBy: string, sort: string) => void;
  downloadAll: () => void;
  downloadFiltered: () => void;
  downloadUserList: () => void;

  userLikedTracksList: TrackInfo[];
  saveTrackToUserList: (deezerTrackInfo: TrackInfo) => void;
  clearUserList: () => void;
  removeTrackFromUserList: (id: string) => void;
}



export const BandContext = React.createContext<Partial<IBandContext>>({});

const localStorageUserListKey = "user-liked-tracks-list";

function BandsProvider({ children }) {
  // const initialBandList = React.useMemo(() => list, []);
  const { openToast } = React.useContext(ToastContext);

  const [userLikedTracksList, setUserLikedTracksList] = React.useState(() => {
    const storageValue = localStorage.getItem(localStorageUserListKey);

    return storageValue ? JSON.parse(storageValue) : [];
  });

  const [databaseChecked] = React.useState(true);
  const [total, setTotal] = React.useState(0);
  const [totalFiltered, setTotalFiltered] = React.useState(0);
  const [bands, setBands] = React.useState<Band[]>([]);
  const [currentPage, setCurrentPage] = React.useState(0);

  // fuse
  const options = {
    threshold: 0.1,
    keys: ['band', 'country', "currentVocalists"]
  }

  // Create the Fuse index
  // const myFuseIndex = Fuse.createIndex(options.keys, list as Band[])

  // fuse

  // const { data: isUpdated} = useSWR(
  //   `/update-database`,
  //   fetcher,
  //   {
  //     errorRetry,
  //     revalidateOnFocus: false
  //   }
  // );

  // React.useEffect(() => {
  //   if (isUpdated !== undefined) {
  //     setDatabaseChecked(true);
  //   }
  // }, [isUpdated]);

  // const { data, isLoading } = useSWR(
  //   databaseChecked
  //     ? `/search/${searchParams.query}/${searchParams.col}/${searchParams.page}/${searchParams.limit}/${searchParams.sort}/${searchParams.sortBy}/${searchParams.filter}/${searchParams.growling}`
  //     : null,
  //   fetcher,
  //   {
  //     errorRetry,
  //     revalidateOnFocus: false
  //   }
  // );

  // React.useEffect(() => {
  //   if (data !== undefined) {
  //     setTotal(data.total ? data.total : 0);
  //     setTotalFiltered(data.totalFiltered ? data.totalFiltered : 0);
  //     setBands(data.documents ? data.documents : []);
  //   }
  //   // console.log({ data, bands });
  // }, [data]);

  const [isLoading, setIsLoading] = React.useState(true);
  const [searchParams, setSearchParams] = React.useState<SearchParams>({
    query: null,
    col: null,
    page: 0,
    limit: 10000,
    sort: "desc",
    sortBy: "growling",
    filter: null,
    growling: null
  });
  // function isNumeric(str: unknown) {
  //   if (typeof str != "string") return false // we only process strings!
  //   // @ts-expect-error
  //   return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
  //     !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  // }

  // const data = useLiveQuery(() => {
  //   console.log({ searchParams })
  //   const { query, sort, sortBy, growling, filter } = searchParams;
  //   let col: any = db.bands;
  //   if (query) {
  //     if (!isNumeric(query)) {
  //       var regex = RegExp(query, 'i');
  //       col = col.filter(item =>
  //         regex.test(item.band) ||
  //         regex.test(item.country) ||
  //         regex.test(item.currentVocalists.toString() + item.pastVocalists.toString())
  //       );
  //     }
  //     else {
  //       const queryNum = Number(query)
  //       col = col.filter(item =>
  //         item.activeFor === queryNum ||
  //         item.currentVocalists.length === queryNum ||
  //         item.yearStarted === queryNum ||
  //         item.yearEnded === queryNum
  //       );
  //     }
  //   }
  //   // if (growling) {
  //   //   col = col.where('growling').equals(growling)
  //   // }
  //   if (filter) {
  //     switch (filter) {
  //       case "active":
  //         {
  //           col = col.where('yearEnded').notEqual(0)
  //           break;
  //         }
  //       case "disbanded":
  //         {
  //           col = col.where('yearEnded').equals(0)
  //           break;
  //         }
  //       case "allWomen":
  //         {
  //           col = col.where('allWomenBand').equals(true)
  //           break;
  //         }
  //       case "mixedGender":
  //         {
  //           return db.bands.filter(item => !item.allWomenBand).toArray()
  //           // col = col.where('allWomenBand').equals(false)
  //           // break;
  //         }
  //       case "blackWomen":
  //         {
  //           col = col.where('blackWomen').equals(true)
  //           break;
  //         }
  //       case "sister":
  //         {
  //           return col.where('sister').equals(true).toArray()
  //           break;
  //         }
  //       default:
  //         { break; }
  //     }
  //   }
  //   // if (sort === "desc") {
  //   //   return col.reverse().sortBy(sortBy || 'growling');
  //   // } else {
  //   //   return col.sortBy(sortBy || 'growling');

  //   // }
  //   // col = col.orderBy(sortBy || 'growling')
  //   // if (sort === "desc") col = col.reverse()
  //   return col.toArray()

  // }, [searchParams]);


  // React.useEffect(() => {
  //   setIsLoading(true)
  //   if(!searchParams.query) {
  //     setBands(data ? data as Band[] : []);
  //     setIsLoading(false)
  //     return;
  //   }

  //   if (data !== undefined) {
  //     const fuse = new Fuse(bands, options);
  //     const results = fuse.search(searchParams.query)
  //     setTotalFiltered(results.length);
  //     setBands(results.map(item => item.item));
  //     setIsLoading(false)
  //   }

  // }, [searchParams]);
  const data = useLiveQuery(() => {
    console.log({ searchParams })
    const test = searchQueryBuild(searchParams)
    // console.log({ test })
    return test
  }, [searchParams]);

  React.useEffect(() => {
    setIsLoading(false)
    if (data !== undefined) {
      if (total === 0) setTotal(data.length);
      setTotalFiltered(data.length);
      setBands(data ? data as Band[] : []);
    }
  }, [data]);

  React.useEffect(() => {
    window.localStorage.setItem(
      localStorageUserListKey,
      JSON.stringify(userLikedTracksList)
    );
  }, [userLikedTracksList]);

  const saveTrackToUserList = (deezerTrackInfo) => {
    if (!deezerTrackInfo) return;
    const alreadyOnList = userLikedTracksList.find(
      (track) => track.id === deezerTrackInfo.id
    );
    if (alreadyOnList) {
      openToast({
        title: "Already on list",
        description: `This track has already been added to the playlist.`
      });
      return;
    }
    setUserLikedTracksList([...userLikedTracksList, deezerTrackInfo]);
    openToast({
      title: "Add track to list",
      description: `${deezerTrackInfo.title} added to list.`
    });
  };

  const clearUserList = () => {
    setUserLikedTracksList([]);
  };

  const removeTrackFromUserList = (id) => {
    setUserLikedTracksList(
      userLikedTracksList.filter((track) => track.id !== id)
    );
  };

  const handleQuery = React.useCallback((query, col) => {
    setSearchParams((params) => {
      return {
        ...params,
        query: query ? query : null,
        col: col ? col : null,
        page: 0
      };
    });
    setTotalFiltered(0);
  }, []);

  const handleSort = React.useCallback((sortBy, sort) => {
    setSearchParams((params) => {
      return {
        ...params,
        sort,
        sortBy
      };
    });
  }, []);

  const handlePageChange = React.useCallback((page) => {
    setCurrentPage(Number(page));
    setSearchParams((params) => {
      return {
        ...params,
        page: page > 0 ? Number(page) + Number(params.limit) : 0
      };
    });
    // console.log(page);
  }, []);

  const handleFilter = React.useCallback((growIntensity, detailFilter) => {
    const grows = [0, 1, 2, 3];
    if (grows.includes(Number(growIntensity))) {
      setSearchParams((params) => {
        return { ...params, growling: growIntensity, page: 0 };
      });
    } else {
      setSearchParams((params) => {
        return { ...params, growling: null, page: 0 };
      });
    }
    if (detailFilter.length > 0) {
      setSearchParams((params) => {
        return { ...params, filter: detailFilter.join(','), page: 0 };
      });
    } else {
      setSearchParams((params) => {
        return { ...params, filter: null, page: 0 };
      });
    }
    setCurrentPage(0);
    setTotalFiltered(0);
  }, []);

  function downloadAll() {
    const content = Papa.unparse(list, {
      quotes: false,
      delimiter: ",",
      header: true,
      newline: "\r\n",
      skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
      columns: null //or array of strings
    });
    downloadCsvFile(content, "women-fronted-metal-bands.csv");
  }

  function downloadFiltered() {
    if (!bands) return;
    const content = Papa.unparse(bands, {
      quotes: false,
      delimiter: ",",
      header: true,
      newline: "\r\n",
      skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
      columns: null //or array of strings
    });
    downloadCsvFile(content, "women-fronted-metal-bands filtered-list.csv");
  }

  function downloadUserList() {
    const formattedTrackList = userLikedTracksList.map((track) => {
      return {
        id: track.id,
        title: track.title,
        "release date": track.release_date,
        artist: track.artist.name,
        album: track.album.title,
        link: track.share
      };
    });
    const content = Papa.unparse(formattedTrackList, {
      quotes: false,
      delimiter: ",",
      header: true,
      newline: "\r\n",
      skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
      columns: null //or array of strings
    });

    downloadCsvFile(content, "user favorite tracks.csv");
  }

  const state = {
    databaseChecked,
    total,
    isLoading,
    totalFiltered,
    bands,
    currentPage,
    searchParams,
    handleFilter,
    handleQuery,
    handlePageChange,
    handleSort,
    downloadAll,
    downloadFiltered,
    userLikedTracksList,
    saveTrackToUserList,
    clearUserList,
    removeTrackFromUserList,
    downloadUserList
  };

  return <BandContext.Provider value={state}>{children}</BandContext.Provider>;
}

export default React.memo(BandsProvider);
