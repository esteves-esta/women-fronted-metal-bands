import React from 'react';

function DeezerProvider() {
  return <div></div>;
}

export default DeezerProvider;


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