// jsx file because didnt know how to type context
import * as React from "react";
import useSWR from "swr";
import list from "../../../list-of-metal-bands/list.json";
import Papa from "papaparse";
import { downloadCsvFile } from "../../helpers/downloadCsvFile";
import { ToastContext } from "../ToastProvider";
import { DEEZER_API } from "../../constants";
import { Band, TrackInfo } from "../../models/Band";

interface IBandContext {
  databaseChecked: boolean;
  total: number;
  isLoading: boolean;
  totalFiltered: number;
  bands: Band[];
  currentPage: number;
  searchParams: Params;
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

interface Params {
  query: string | null;
  col: string | null;
  page: number;
  limit: number;
  sort: "desc" | "asc";
  sortBy: string;
  filter: string | null;
  growling: number | null;
}

export const BandContext = React.createContext<Partial<IBandContext>>({});

const localStorageUserListKey = "user-liked-tracks-list";
// const localStorageBandKey = "band-list";

async function fetcher(endpoint) {
  const response = await fetch(`${DEEZER_API}api${endpoint}`, {
    method: "GET",
    headers: {
      "X-API-KEY": import.meta.env.VITE_MY_API_KEY
    }
  });

  const json = await response.json();
  if (json.error && json.error?.code === 500)
    throw new Error(json.error.message);
  return json;
}

const errorRetry = (error, revalidate, { retryCount }) => {
  // Never retry on 404.
  if (error.status === 404 || error.status === 500) return;

  if (retryCount >= 2) return;

  // Retry after 5 seconds.
  setTimeout(() => revalidate({ retryCount }), 5000);
};

function BandsProvider({ children }) {
  // const initialBandList = React.useMemo(() => list, []);
  const { openToast } = React.useContext(ToastContext);

  const [userLikedTracksList, setUserLikedTracksList] = React.useState(() => {
    const storageValue = localStorage.getItem(localStorageUserListKey);

    return storageValue ? JSON.parse(storageValue) : [];
  });

  const [databaseChecked, setDatabaseChecked] = React.useState(false);
  const [total, setTotal] = React.useState(0);
  const [totalFiltered, setTotalFiltered] = React.useState(0);
  const [bands, setBands] = React.useState<Band[]>([]);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [searchParams, setSearchParams] = React.useState<Params>({
    query: null,
    col: null,
    page: 0,
    limit: 10000,
    sort: "desc",
    sortBy: "growling",
    filter: null,
    growling: null
  });

  const { data: isUpdated} = useSWR(
    `/update-database`,
    fetcher,
    {
      errorRetry,
      revalidateOnFocus: false
    }
  );

  React.useEffect(() => {
    if (isUpdated !== undefined) {
      setDatabaseChecked(true);
    }
  }, [isUpdated]);

  const { data, isLoading } = useSWR(
    databaseChecked
      ? `/search/${searchParams.query}/${searchParams.col}/${searchParams.page}/${searchParams.limit}/${searchParams.sort}/${searchParams.sortBy}/${searchParams.filter}/${searchParams.growling}`
      : null,
    fetcher,
    {
      errorRetry,
      revalidateOnFocus: false
    }
  );

  React.useEffect(() => {
    if (data !== undefined) {
      setTotal(data.total ? data.total : 0);
      setTotalFiltered(data.totalFiltered ? data.totalFiltered : 0);
      setBands(data.documents ? data.documents : []);
    }
    // console.log({ data, bands });
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
