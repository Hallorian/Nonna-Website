export type Language = 'en' | 'de';

export interface Quote {
  author: string;
  source: string;
  text: string[];
}

export interface FilmData {
  logline: string;
  synopsis: string;
  directorStatement: string;
  bio: string;
  quotes: Quote[];
  specs: {
    duration: string;
    resolution: string;
    framerate: string;
    aspectRatio: string;
    sound: string;
    language: string;
    subtitles: string;
  };
  festivals: string[];
  filmography: string[];
}

export interface Content {
  en: FilmData;
  de: FilmData;
}