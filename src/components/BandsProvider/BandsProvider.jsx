// jsx file because didnt know how to type context
import * as React from "react";
import list from "../../../list-of-metal-bands/list.json";
import Papa from 'papaparse';
import { downloadCsvFile } from '../../helpers/downloadCsvFile'
import { ToastContext } from "../ToastProvider";

export const BandContext = React.createContext();
const localStorageUserListKey = 'user-liked-tracks-list'
const localStorageBandKey = 'band-list'

function BandsProvider({ children }) {
  const initialBandList = React.useMemo(() => list, [])
  const { openToast } = React.useContext(ToastContext);

  const [userLikedTracksList, setUserLikedTracksList] = React.useState(() => {
    const storageValue = localStorage.getItem(localStorageUserListKey)

    return storageValue ? JSON.parse(storageValue) : [];
  });

  const [bands, setBands] = React.useState(() => {
    const storageValue = localStorage.getItem(localStorageBandKey)
    let parsedValue
    if (storageValue) parsedValue = JSON.parse(storageValue);
    if (Array.isArray(parsedValue) && parsedValue.length === initialBandList.length) return parsedValue

    return initialBandList.map(band => {
      if (!band.deezerId) band.id = crypto.randomUUID()
      else band.id = band.deezerId
      return band
    })
  });

  React.useEffect(() => {
    window.localStorage.setItem(localStorageUserListKey, JSON.stringify(userLikedTracksList))
  }, [userLikedTracksList])

  const saveTrackToUserList = (deezerTrackInfo) => {
    if (!deezerTrackInfo) return;
    const alreadyOnList = userLikedTracksList.find(track => track.id === deezerTrackInfo.id)
    if (alreadyOnList) {
      openToast({
        title: "Already on list",
        description: `This track has already been added to the playlist.`,
      })
      return;
    }
    setUserLikedTracksList([...userLikedTracksList, deezerTrackInfo])
    openToast({
      title: "Add track to list",
      description: `${deezerTrackInfo.title} added to list.`,
    })
  }

  const saveBandListStorage = (newList) => {
    window.localStorage.setItem(localStorageBandKey, JSON.stringify(newList))
  }

  const clearUserList = () => {
    setUserLikedTracksList([])
  }

  const removeTrackFromUserList = (id) => {
    setUserLikedTracksList(userLikedTracksList.filter(track => track.id !== id))
  }

  const filter = React.useCallback((growIntensity, detailFilter) => {
    const details = ['active', 'disbanded', 'all women',
      'mixed', 'black women', 'sister',];
    const grows = [0, 1, 2, 3];
    let filtered = [...initialBandList]

    if (grows.includes(Number(growIntensity))) {
      filtered = initialBandList.filter((band) => band.growling === Number(growIntensity))
    }

    if (details.includes(detailFilter)) {
      if (detailFilter === 'active') filtered = filtered.filter((band) => !band.yearEnded)
      if (detailFilter === 'disbanded') filtered = filtered.filter((band) => band.yearEnded)
      if (detailFilter === 'all women') filtered = filtered.filter((band) => band.allWomenBand)
      if (detailFilter === 'mixed') filtered = filtered.filter((band) => !band.allWomenBand)
      if (detailFilter === 'sister') filtered = filtered.filter((band) => band.sister)
      if (detailFilter === 'black women') filtered = filtered.filter((band) => band.blackWomen)
    }

    setBands(filtered);
  }, []);

  function downloadAll() {
    const content = Papa.unparse(initialBandList, {
      quotes: false,
      delimiter: ",",
      header: true,
      newline: "\r\n",
      skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
      columns: null //or array of strings
    }
    );

    downloadCsvFile(content, 'women-fronted-metal-bands.csv')
  }

  function downloadFiltered() {
    const content = Papa.unparse(bands, {
      quotes: false,
      delimiter: ",",
      header: true,
      newline: "\r\n",
      skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
      columns: null //or array of strings
    }
    );

    downloadCsvFile(content, 'women-fronted-metal-bands filtered-list.csv')
  }

  function downloadUserList() {
    const formattedTrackList = userLikedTracksList.map(track => {
      return {
        "id": track.id,
        "title": track.title,
        "release date": track.release_date,
        "artist": track.artist.name,
        "album": track.album.title,
        "link": track.share
      }
    })
    const content = Papa.unparse(formattedTrackList, {
      quotes: false,
      delimiter: ",",
      header: true,
      newline: "\r\n",
      skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
      columns: null //or array of strings
    }
    );

    downloadCsvFile(content, 'user favorite tracks.csv')
  }

  const state = {
    initialBandList,
    bands,
    filter,
    setBands,
    downloadAll,
    downloadFiltered,
    userLikedTracksList,
    saveTrackToUserList,
    clearUserList,
    removeTrackFromUserList,
    saveBandListStorage,
    downloadUserList
  };

  return <BandContext.Provider value={state}>{children}</BandContext.Provider>;
}

export default React.memo(BandsProvider);
