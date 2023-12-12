# List of women fronted metalbands
A list of metal bands with women as lead vocalist (with focus on women that can growl)

![Header image written women fronted metal bands](/header-readme.png "Header")

> ### Access app on the link:
> ### https://esteves-esta.github.io/women-fronted-metal-bands/

---
teste
This project is a list of the bands of diferent metal genres and also an way of me to pratice frontend. 

You can filter bands by how much growling the singer is capable of doing.


## Index

# Table of Contents
- [List of women fronted metalbands](#list-of-women-fronted-metalbands)
  - [Index](#index)
- [Table of Contents](#table-of-contents)
  - [📖 Features](#-features)
    - [✅ Done](#-done)
    - [✍️ Todo](#️-todo)
  - [🧰 Tech Stack](#-tech-stack)
  - [🚀 How to run locally](#-how-to-run-locally)
  - [Sources](#sources)
    - [Method of data collecting](#method-of-data-collecting)
    - [Links](#links)
- [Printscreen of site](#printscreen-of-site)

---
## 📖 Features

### ✅ Done
- [x] Display list as table 
  - [x] option to change to grid
  - [x] Filter data
  - [x] Pagination
  - [x] Show/Hide columns
  - [x] Change page size
- [x] Download as .csv
  - [x] all data 
  - [x] filtered data
- [x] Use deezer API
  - [x] Uses a proxy to use api (/proxy/server.js) - and deployed on render free plan
  - [x] Save data already requested by api (tracks/artist) on localstorage
  - [x] Get image of the band on click of row/on playing track
  - [x] Be able to listen to a preview of a song on the page
    - [x] When track ends play next
    - [x] When band doesn't have a top track - show toast and play next
- [x] Button to play a random track
- [x] [Published on GitHub Pages](https://esteves-esta.github.io/women-fronted-metal-bands/)
- [x] Graphs
- [x] Add liked songs to a list:
  - [x] open modal and show list
    - [x]  be able to remove item from list
  - [x] Export as csv
- [x] Make site responsive

### ✍️ Todo
> for later
- [ ] Create playlist or add liked songs list to a playlist on deezer
- [ ] Put all data on redis
> maybe
- [ ] ?? Graph - how many bands start with each letter of the alphabet ??

---

## 🧰 Tech Stack

- Vite
- React
- Typescript
- Tailwind CSS
- SWR
- Lucide React - icons
- Papaparse - json to csv
- Radix-UI - unstyled components
- Nivo - charts

---

## 🚀 How to run locally

1. Install packages

      ```
      npm i 
      ```
      
      or

      ```
      yarn i
      ```

2. Run api proxy

      ```
      npm run proxy 
      ```
      
      or

      ```
      yarn proxy
      ```


3. Run dev server

      ```
      npm run dev 
      ```
      
      or

      ```
      yarn dev
      ```


      
## Sources

### Method of data collecting

1. Bands got on the list if they had:
  - at least one official site:
    - home page (active or archived)
    - streaming page 
    - bandcamp
    - official youtube channel
    - soundcloud
    - last.fm
    - blog
  - or having their music saved/archived by fans on some available website
2. The band detail information when possible was obtained from their official sites but some comes from fan archives/wikis so there may be incorrect data about the bands.

### Links

I got some of the bands and the information on this list from the following:

- Wikia / Archives
  - [Wikipedia - List of female heavy metal singers](https://en.wikipedia.org/wiki/List_of_female_heavy_metal_singers)
  - [Encyclopaedia Metallum - the metal archives](https://www.metal-archives.com/)
  - [Metal Music Archives](https://www.metalmusicarchives.com )
  - [Swedish Hard n'Heavy Encyclopedia](https://www.fwoshm.com/index/)
  - [Spirit of Metal](https://www.spirit-of-metal.com/)
  - [Metal ladies - all-female metal bands](https://www.metaladies.com/bands/)
  - http://www.metaleros.de/
  ---
- Sites / Magazines 
  - [FemMetal - Goddsses of Metal](https://femmetal.rocks/browse-by-artist/)
  - [Wiki Metal](https://www.wikimetal.com.br/)
  - [Bandcamp Daily - Ten Divine, Diabolical Feminine Artists Challenging Heavy Metal Machismo](https://daily.bandcamp.com/lists/feminine-expression-in-metal-guide)
  - [No Clean Singing - FEMALE GROWLERS](https://www.nocleansinging.com/2012/02/08/female-growlers/)
  - [Spinditty - 100 Best Female Heavy Metal Singers](https://spinditty.com/genres/100-Best-Female-Heavy-Metal-Singers)
  - [Alternative Press - 20 women vocalists in metal who are a driving force for the genre](https://www.altpress.com/best-current-women-metal-vocalists/)
  - [Loud Wire - Top 50 Hard Rock + Metal Frontwomen of All Time](https://loudwire.com/top-hard-rock-metal-frontwomen-of-all-time/)
  - [Metal Injection - Six Frontwomen That Are Tearing Up The Chinese Metal Scene](https://metalinjection.net/scene-report/six-frontwomen-that-are-tearing-up-the-chinese-metal-scene)
  - [Metal Kindgom](https://www.metalkingdom.net/band/flagitious-idiosyncrasy-in-the-dilapidation-8195)
  - [Discogs](https://www.discogs.com/artist/1313975-Flagitious-Idiosyncrasy-In-The-Dilapidation)
---
- Lists on Rate your Music
  - [Metal bands with women on vocals - A list by Eudus](https://rateyourmusic.com/list/Eudus/metal-bands-with-women-on-vocals/)
  - [The ladies of Black Metal - A list by drowned_scars](https://rateyourmusic.com/list/drowned_scars/the_ladies_of_black_metal/)
---
- Reddit
  - [Are there any good metalcore bands with a female vocalist? ](https://www.reddit.com/r/Metalcore/comments/17c8ka/are_there_any_good_metalcore_bands_with_a_female/)
  - [Recommendations for female fronted death metal bands ](https://www.reddit.com/r/Deathmetal/comments/pn4zos/recommendations_for_female_fronted_death_metal/)
---
- Playlists
  - Youtube
    - https://www.youtube.com/@femalemetalbands
  ---
  - Streaming
    - [Mulheres no Rock e Heavy metal](https://open.spotify.com/playlist/07oeFZ6ru3G8ltbLWgeOXy?go=1&sp_cid=eed76d07a2d4ebe4ded7ff943a8a9283&utm_source=embed_player_p&utm_medium=desktop&nd=1)
    - [Metal Queens](https://www.deezer.com/br/playlist/8825163122)
    - [Women of Metal](https://www.deezer.com/br/playlist/1159266401)


# Printscreen of site

![Printscreen](/printscreen-site.png "Header")
