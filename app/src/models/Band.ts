export type Intensity = 0 | 1 | 2 | 3;

export interface Band {
  id: string;
  growling: Intensity;
  deezerId: number;
  deezerRecommendationId: number;
  band: string;
  genre: string[];
  recommendationIsCover: boolean;
  selected: boolean;
  blackWomen: boolean;
  allWomenBand: boolean;
  pastVocalists: string[];
  currentVocalists: string[];
  country: string;
  countryCode: string;
  yearStarted: number;
  yearEnded: number;
  recommendation: string;
  links: string;
  sister: boolean;
  activeFor: number;
  numberOfVocalists: number;
  emptyPicture: boolean;
  deezerTrackInfo?: TrackInfo;
  deezerPicture: string;
}

export interface TrackInfo {
  id: string;
  link: string;
  title: string;
  artist: { name: string};
  album: { cover_medium: string; title: string };
  albumtitle: string;
  release_date: string;
}
