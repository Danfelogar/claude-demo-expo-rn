/** Location reference returned by the Rick & Morty API */
export interface CharacterLocation {
  name: string;
  url: string;
}

/** Status values the API returns */
export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';

/** Gender values the API returns */
export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown';

/** A single character from the Rick & Morty API */
export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  type: string;
  gender: CharacterGender;
  origin: CharacterLocation;
  location: CharacterLocation;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

/** Pagination metadata returned alongside results */
export interface CharacterPageInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

/** Full response from GET /character */
export interface CharacterPage {
  info: CharacterPageInfo;
  results: Character[];
}
