import React from 'react';
import useSWR from 'swr';
import { BandContext } from '../BandsProvider';

const DEEZER_EMPTY_PICTURE = 'https://e-cdns-images.dzcdn.net/images/artist//500x500-000000-80-0-0.jpg'

const CROSS_PROXY2 = 'https://cors-anywhere.herokuapp.com/'
const CROSS_PROXY1 = 'https://crossorigin.me/'
const DEEZER_API = 'https://api.deezer.com/'

export const DeezerContext = React.createContext();

async function fetcher(endpoint) {
  const response = await fetch(`${DEEZER_API}${endpoint}`, {
    method: 'GET'
  });
  const json = await response.json();
  return json;
};

function DeezerProvider({ children }) {
  const { bands, setBands } = React.useContext(BandContext)
  const [trackId, setTrackId] = React.useState(null);
  const [previewTrack, setPreviewTrack] = React.useState(null);
  const [bandTopTrack, setBandTopTrack] = React.useState(null);
  const [artistId, setArtistId] = React.useState(null);
  const [currentBandId, setCurrentBandId] = React.useState();
  const [isPlaying, setIsPlaying] = React.useState(false);

  const { data: trackInfo, error: trackError, isLoading: trackIsLoading } = useSWR(trackId ? `track/${trackId}` : null,
    fetcher
  );

  const { data: topTrackInfo, error: topTrackError, isLoading: topTrackIsLoading } = useSWR(bandTopTrack ? `artist/${bandTopTrack}/top?index=0&limit=1` : null,
    fetcher
  );
  const { data: artist, isLoading: artistLoading } = useSWR(artistId ? `artist/${artistId}` : null,
    fetcher
  );


  const getArtistPicture = React.useCallback((bandId) => {
    const foundBand = bands.find(band => band.deezerId === bandId);
    if (!foundBand) return;
    if (!foundBand.deezerPicture) return;

    setArtistId(founbandId)
  }, [])

  React.useEffect(() => {
    if (artist === undefined) return;

    const bandIndex = bands.findIndex(band => band.deezerId === artistId)
    if (bandIndex < 0) return;

    const newBands = [...bands]
    newBands[bandIndex].deezerPicture = artist.picture_medium
    setBands(newBands)
  }, [artist])

  React.useEffect(() => {
    if (artist === undefined) return;

    const bandIndex = bands.findIndex(band => band.deezerId === artistId)
    if (bandIndex < 0) return;

    const newBands = [...bands]
    if (artist.picture_big === DEEZER_EMPTY_PICTURE) newBands[bandIndex].emptyPicture = true

    newBands[bandIndex].deezerPicture = artist.picture_big
    setBands(newBands)
  }, [artist])

  const getTrackPreview = React.useCallback((bandId) => {
    const foundBand = bands.find(band => band.deezerId === bandId);
    if (!foundBand) return;

    if (!foundBand.deezerPicture) {
      setArtistId(foundBand.deezerId)
    }

    if (!foundBand.deezerRecommendationId) {
      setCurrentBandId(bandId)
      setBandTopTrack(bandId)
      setIsPlaying(false)
      return;
    }

    if (currentBandId === foundBand.deezerId) {
      setIsPlaying(current => !current)
      return;
    }

    if (foundBand.deezerTrackInfo) {
      setPreviewTrack(foundBand.deezerTrackInfo)
      setCurrentBandId(bandId)
      setIsPlaying(false)
      return;
    }

    setCurrentBandId(bandId)
    setIsPlaying(false)
    setTrackId(foundBand.deezerRecommendationId)
  }, [currentBandId, trackIsLoading])

  React.useEffect(() => {
    if (trackInfo === undefined) return;
    setPreviewTrack(trackInfo)
  }, [trackInfo])

  React.useEffect(() => {
    if (topTrackInfo === undefined) return;
    if (topTrackInfo.data.length === 0) return;

    setPreviewTrack(topTrackInfo.data[0])
  }, [topTrackInfo])

  React.useEffect(() => {
    const bandIndex = bands.findIndex(band => band.deezerId === currentBandId)
    if (bandIndex < 0) return;

    const newBands = [...bands]
    newBands.forEach(band => { band.selected = false })
    newBands[bandIndex].deezerTrackInfo = trackInfo
    newBands[bandIndex].selected = true
    setBands(newBands)

  }, [previewTrack])

  const playNextTrack = React.useCallback(() => {
    const bandIndex = bands.findIndex(band => band.deezerId === currentBandId)
    if (bandIndex < 0) return;

    let nextIndex = bandIndex + 1;
    if (nextIndex >= bands.length) nextIndex = 0;

    getTrackPreview(bands[nextIndex].deezerId)
  }, [currentBandId])

  const state = React.useMemo(() => {
    return {
      deezerTrackInfo: previewTrack,
      title: previewTrack ? previewTrack.title : null,
      cover: previewTrack ? previewTrack.album.cover_small : null,
      artist: previewTrack ? previewTrack.artist.name : null,
      src: previewTrack ? previewTrack.preview : null,
      currentBandId,
      trackIsLoading: trackIsLoading || topTrackIsLoading,
      isPlaying,
      setIsPlaying,
      getTrackPreview,
      playNextTrack,
      getArtistPicture
    }
  }, [previewTrack, currentBandId, isPlaying, trackIsLoading, topTrackIsLoading]);

  return (<DeezerContext.Provider value={state}>{children}</DeezerContext.Provider>);
}

export default React.memo(DeezerProvider);


/* 
https://developers.deezer.com/sdk/javascript/init
https://developers.deezer.com/api
https://api.deezer.com/artist/27
https://api.deezer.com/search/artist?q=otep&index=0&limit=2
https://api.deezer.com/track/2012155467


https://swr.vercel.app/pt-BR

## dezeer acess
DOCS -> https://developers.deezer.com/api/oauth

### 1
GET https://connect.deezer.com/oauth/auth.php?
app_id=[ID]
&redirect_uri=http://localhost:1234/
&perms=manage_library
&dispatch_path=auth
// if user give permission
// on url will be code necessary to get acess_token

### 2
GET https://connect.deezer.com/oauth/access_token.php
?app_id=[APPID]
&secret=[APPSECRET]
&code=[code from step 1]

### 3
GET  https://api.deezer.com/user/me?access_token=[TOKEN]
- get user id
- 
### 4
POST https://api.deezer.com/user/[USERID]/playlists?access_token=[TOKEN]
- title : asdf
- response - new playlistid
- 
### 5
POST https://api.deezer.com/playlist/[PLAYLIST_ID]/tracks?access_token=[TOKEN]
- songs : 234,234,234
- response: boolean

https://api.deezer.com/playlist/[PLAYLIST_ID]/tracks?
&request_method=POST
&songs=555962972
&access_token=[TOKEN]

*/