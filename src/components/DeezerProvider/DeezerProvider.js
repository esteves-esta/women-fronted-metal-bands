import React from 'react';
import useSWR from 'swr';
import { BandContext } from '../BandsProvider';

const CROSS_PROXY2 = 'https://cors-anywhere.herokuapp.com/'
const CROSS_PROXY1 = 'https://corsproxy.github.io/'
const DEEZER_API = 'https://api.deezer.com/'

export const DeezerContext = React.createContext();

async function fetcher(endpoint) {
  const response = await fetch(`${CROSS_PROXY2}${DEEZER_API}${endpoint}`, {
    method: 'GET'
  });
  const json = await response.json();
  return json;
};

function DeezerProvider({ children }) {
  const { bands, setBands } = React.useContext(BandContext)
  const [trackId, setTrackId] = React.useState(null);
  const [currentBandId, setCurrentBandId] = React.useState(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const { data: trackInfo, error: trackError, isLoading: trackIsLoading } = useSWR(trackId ? `track/${trackId}` : null,
    fetcher
  );

  function getTrackPreview(bandId) {
    
    const foundBand = bands.find(band => band.deezerId === bandId);
    if (!foundBand) return;
    if (!foundBand.deezerRecommendationId) {
      // getBandTopTrack(bandId)
      return;
    }
    console.log({ bandId })
    if (currentBandId === foundBand.deezerId && !trackIsLoading) {
      // setIsPlaying((current) => !current)
      return;
    }

    if (foundBand.deezerTrackInfo) {
      setPreviewTrack(foundBand.deezerTrackInfo.preview)
      return;
    }

    setIsPlaying(false)
    setTrackId(foundBand.deezerRecommendationId)
    setCurrentBandId(bandId)
  }

  React.useEffect(() => {
    if (!!trackInfo) return;

    const bandIndex = bands.findIndex(band => band.deezerId === currentBandId)
    if (bandIndex < 0) return;

    const newBands = [...bands]
    newBands[bandIndex].deezerTrackInfo = trackInfo
    setBands(newBands)
  }, [trackInfo, currentBandId])

  const state = {
    deezerTrackInfo: trackInfo,
    title: trackInfo ? trackInfo.title : null,
    cover: trackInfo ? trackInfo.album.cover_small : null,
    artist: trackInfo ? trackInfo.artist.name : null,
    src: trackInfo ? trackInfo.preview : null,
    currentBandId,
    isPlaying,
    setIsPlaying,
    getTrackPreview,
  };

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