// jsx file because didnt know how to type context
import React from "react";
import useSWR from "swr";
import { BandContext } from "../BandsProvider";
import { ToastContext } from "../ToastProvider";
import { DEEZER_API } from "../../constants";
import { Band, TrackInfo } from "../../models/Band";

const DEEZER_EMPTY_PICTURE =
  "https://e-cdns-images.dzcdn.net/images/artist//500x500-000000-80-0-0.jpg";

const localStoragePreviewKey = "last-preview-track";

interface IDeezerContext {
  deezerTrackInfo: TrackInfo;
  title: string;
  cover: string | null;
  artist: string | null;
  src: string | null;
  currentBandId: number | undefined;
  trackIsLoading: boolean;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  playRecommendedTrackOrOpenLink: (band: Band) => void;
  playNextTrack: () => void;
  getArtistPicture: (bandId: string | null) => void;
  getTrackPreview: (bandId: string | null) => void;
}

export const DeezerContext = React.createContext<Partial<IDeezerContext>>({});

async function fetcher(endpoint) {
  const response = await fetch(`${DEEZER_API}api/${endpoint}`, {
    method: "GET",
    headers: {
      "X-API-KEY": import.meta.env.VITE_MY_API_KEY
    }
  });

  const json = await response.json();
  if (json.error && json.error?.code === 800)
    throw new Error(json.error.message);
  return json;
}

const errorRetry = (error, revalidate, { retryCount }) => {
  // Never retry on 404.
  if (error.status === 404) return;

  if (retryCount >= 2) return;

  // Retry after 5 seconds.
  setTimeout(() => revalidate({ retryCount }), 5000);
};

function DeezerProvider({ children }) {
  const { bands } = React.useContext(BandContext);
  const { openToast } = React.useContext(ToastContext);

  const [trackId, setTrackId] = React.useState(null);
  const [previewTrack, setPreviewTrack] = React.useState(() => {
    const storageValue = localStorage.getItem(localStoragePreviewKey);

    return storageValue ? JSON.parse(storageValue) : null;
  });

  const [bandTopTrack, setBandTopTrack] = React.useState(null);
  const [artistId, setArtistId] = React.useState(null);
  const [currentBandId, setCurrentBandId] = React.useState();
  const [isPlaying, setIsPlaying] = React.useState(false);

  // const [progress, setProgress] = React.useState(55);

  const {
    data: trackInfo,
    error: trackError,
    isLoading: trackIsLoading
  } = useSWR(trackId ? `deezer/track/${trackId}` : null, fetcher, {
    errorRetry,
    revalidateOnFocus: false
  });

  const {
    data: topTrackInfo,
    error: topTrackError,
    isLoading: topTrackIsLoading
  } = useSWR(
    bandTopTrack ? `deezer/artist/${bandTopTrack}/top` : null,
    fetcher,
    {
      errorRetry,
      revalidateOnFocus: false
    }
  );
  const { data: artist } = useSWR(
    artistId ? `deezer/artist/${artistId}/null` : null,
    fetcher,
    {
      errorRetry,
      revalidateOnFocus: false
    }
  );

  const getArtistPicture = (bandId) => {
    const foundBand = bands.find((band) => band.deezerId === bandId);
    if (!foundBand) return;
    if (!foundBand.deezerPicture) return;

    setArtistId(foundBand.id);
  };

  React.useEffect(() => {
    if (artist === undefined) return;

    const bandIndex = bands.findIndex((band) => band.deezerId === artistId);
    if (bandIndex < 0) return;

    const newBands = [...bands];
    if (artist.picture_big === DEEZER_EMPTY_PICTURE)
      newBands[bandIndex].emptyPicture = true;

    newBands[bandIndex].deezerPicture = artist.picture_big;
    // setBands(newBands);
  }, [artist]);

  React.useEffect(() => {
    if (trackError !== undefined) {
      setBandTopTrack(currentBandId);
      setTrackId(undefined);
    }
  }, [trackError, currentBandId]);

  React.useEffect(() => {
    if (topTrackError !== undefined) {
      const band = bands.find((band) => band.deezerId === currentBandId);
      let bandMessage = "";
      if (band) bandMessage = `from the band ${band.band} `;
      openToast({
        title: "Deezer API Error",
        description: `An error ocurred to get the top track  ${bandMessage} of Deezer API: ${topTrackError.error ? topTrackError.error?.message : ""
          }`
      });
      setBandTopTrack(undefined);
      setCurrentBandId(undefined);
    }
  }, [topTrackError]);

  const getTrackPreview = (bandId) => {
    //   console.log('hey', bandId)
    setTrackId(null);
    setArtistId(null);
    setBandTopTrack(null);

    const foundBand = bands.find((band) => band.deezerId === bandId);
    // console.log({foundBand})
    if (!foundBand) return;
    if (!foundBand.deezerPicture) {
      setArtistId(foundBand.deezerId);
    }

    if (!foundBand.deezerRecommendationId) {
      setCurrentBandId(bandId);
      setBandTopTrack(bandId);
      setIsPlaying(false);
      return;
    }

    if (currentBandId === foundBand.deezerId) {
      setIsPlaying((current) => !current);
      return;
    }

    if (foundBand.deezerTrackInfo) {
      setPreviewTrack({ ...foundBand.deezerTrackInfo });
      setCurrentBandId(bandId);
      setIsPlaying(false);
      return;
    }
    setCurrentBandId(bandId);
    setIsPlaying(false);
    setTrackId(foundBand.deezerRecommendationId);
  };

  React.useEffect(() => {
    if (trackInfo === undefined) return;
    setPreviewTrack({ ...trackInfo });
  }, [trackInfo]);

  React.useEffect(() => {
    if (topTrackInfo === undefined) return;
    if (topTrackInfo.data.length === 0) {
      const band = bands.find((band) => band.deezerId === currentBandId);
      let bandName = "";
      if (band) bandName = `${band.band} `;

      openToast({
        title: "Loading next band..",
        description: `Band ${bandName} doesn't have a top track.`
      });
      playNextTrack();
      return;
    }

    setPreviewTrack(topTrackInfo.data[0]);
  }, [topTrackInfo]);

  React.useEffect(() => {
    const bandIndex = bands.findIndex(
      (band) => band.deezerId === currentBandId
    );
    if (bandIndex < 0) return;

    const newBands = [...bands];
    newBands.forEach((band) => {
      band.selected = false;
    });
    newBands[bandIndex].deezerTrackInfo = trackInfo;
    newBands[bandIndex].selected = true;
    // setBands(newBands);
    // saveBandListStorage(newBands);
    window.localStorage.setItem(
      localStoragePreviewKey,
      JSON.stringify(previewTrack)
    );
    // console.log(previewTrack);
  }, [previewTrack]);

  const playNextTrack = () => {
    try {
      const copyBands = [...bands];
      const bandIndex = copyBands
        .filter((item) => item.deezerId !== null)
        .findIndex((band) => band.deezerId === currentBandId);

      
      if (bandIndex < 0) return;

      let nextIndex = bandIndex + 1;
      if (nextIndex >= bands.length) nextIndex = 0;
      const copyBand = copyBands
        .filter((item) => item.deezerId !== null)
        .slice(nextIndex, copyBands.length);
      const nextBandPlaying = copyBand.find(
        (band) => band.deezerId || band.deezerRecommendationId
      );
      // console.log({ name: nextBandPlaying.band });
      getTrackPreview(nextBandPlaying.deezerId);
    } catch (error) {
      console.log({ error })
    }
  };

  const playRecommendedTrackOrOpenLink = (band: Band) => {
    // console.log(band)
    if (band.deezerId || band.deezerRecommendationId) {
      getTrackPreview(band.deezerId);
      return;
    }
    if (band.links) {
      setTimeout(() => window.open(band.links, "_blank"), 10);
    }
  };


  const state = {
    deezerTrackInfo: previewTrack,
    title: previewTrack && previewTrack?.title ? previewTrack.title : "",
    cover:
      previewTrack && previewTrack?.album
        ? previewTrack.album.cover_small
        : null,
    artist:
      previewTrack && previewTrack?.artist
        ? previewTrack.artist.name
        : "",
    src: previewTrack && previewTrack?.preview ? previewTrack.preview : null,
    currentBandId,
    trackIsLoading: trackIsLoading || topTrackIsLoading,
    isPlaying,
    setIsPlaying,
    playNextTrack,
    getArtistPicture,
    playRecommendedTrackOrOpenLink,
    getTrackPreview
  };

  return (
    <DeezerContext.Provider value={state}>{children}</DeezerContext.Provider>
  );
}

export default React.memo(DeezerProvider);
