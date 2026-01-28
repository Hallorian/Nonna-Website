export type Language = 'en' | 'de';

export interface Quote {
  author: string;
  source: string;
  text: string[];
}

export interface EventItem {
  title: string;
  subtitle?: string;
  date?: string;
}

export interface ScreeningItem {
  city: string;
  cinema: string;
  date: string;
  time: string;
  link?: string;
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
  festivals: string[]; // Keep for legacy or synopsis modal usage if needed, or sync with new events
  filmography: string[];
  
  // New Fields
  pastEvents: EventItem[];
  upcomingEvents: EventItem[];
  screenings: ScreeningItem[];
}

export interface Content {
  en: FilmData;
  de: FilmData;
}