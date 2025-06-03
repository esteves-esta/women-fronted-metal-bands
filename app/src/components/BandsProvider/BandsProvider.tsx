import * as React from "react";
import list from "../../../list-of-metal-bands/list.json";
import Papa from "papaparse";
import { downloadCsvFile } from "../../helpers/downloadCsvFile";
import { ToastContext } from "../ToastProvider";
import { Band, TrackInfo } from "../../models/Band";
import { useLiveQuery } from "dexie-react-hooks";
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
  const { openToast } = React.useContext(ToastContext);

  const [databaseChecked] = React.useState(true);
  const [total, setTotal] = React.useState(0);
  const [totalFiltered, setTotalFiltered] = React.useState(0);
  const [bands, setBands] = React.useState<Band[]>([]);
  const [currentPage, setCurrentPage] = React.useState(0);
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


  // START GET DATA FROM DEXIE DATABASE WITH SEARCH

  const data = useLiveQuery(() => {
    setIsLoading(true)
    const result = searchQueryBuild(searchParams)
    setIsLoading(false)
    return result
  }, [searchParams]);

  React.useEffect(() => {
    if (data !== undefined) {
      if (total === 0) setTotal(data.length);
      setTotalFiltered(data.length);
      setBands(data ? data as Band[] : []);
    }
  }, [data]);


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

  // END GET DATA FROM DEXIE DATABASE WITH SEARCH


  //  -----------------------------------------

  // START USER FAVORITES

  const [userLikedTracksList, setUserLikedTracksList] = React.useState(() => {
    const storageValue = localStorage.getItem(localStorageUserListKey);

    return storageValue ? JSON.parse(storageValue) : [];
  });

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

  // END USER FAVORITES

  //  -----------------------------------------

  // START DOWNLOANDS

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
  // START DOWNLOANDS
  //  -----------------------------------------
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
