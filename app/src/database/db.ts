import Dexie, { type Table } from 'dexie';
import { TrackInfo } from '../models/Band';
import { populate } from './populate';

export interface BandDb {
  id: string;
  growling: number;
  deezerId: number;
  deezerRecommendationId: number;
  band: string;
  genre: string[];
  recommendationIsCover: boolean;
  // selected: boolean;
  blackWomen: boolean;
  allWomenBand: boolean;
  pastVocalists: string[];
  currentVocalists: string[];
  country: string;
  countryCode: string;
  yearStarted: number;
  yearEnded: number;
  // recommendation: string | null;
  links: string;
  sister: boolean;
  activeFor?: number;
  numberOfVocalists: number;
  emptyPicture?: boolean;
  deezerTrackInfo?: TrackInfo;
  deezerPicture?: string;
  myFavorites?: boolean;
}

const db = new Dexie('BandsDatabase') as Dexie & {
  bands: Table<
    BandDb,
    number
  >;
};

// Schema declaration:
db.version(1).stores({
  // primary key "id" (for the runtime!)
  bands: '++id, growling, band, country,countryCode, genre, blackWomen, allWomenBand, sister, yearEnded, yearStarted, [yearStarted+yearEnded], activeFor'
});


db.on('populate', populate);

export { db };
