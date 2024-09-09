export type Tntensity = 0 | 1 | 2 | 3;

export interface Band {
  growling: Tntensity;
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
  id: string;
  emptyPicture: boolean;
  deezerTrackInfo?: TrackInfo;
  deezerPicture: string;
}

export interface TrackInfo {
  album: { cover_medium: string };
  albumtitle: string;
}
