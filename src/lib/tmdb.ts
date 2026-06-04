export const TOKEN = `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`;

export const AUTH = { Authorization: TOKEN };

export const POSTER = "https://image.tmdb.org/t/p/w500";
export const BACKDROP = "https://image.tmdb.org/t/p/original";

export type Movie = {
  id: number;
  title: string;
  rating: number;
  image: string;
  backdrop: string;
  overview: string;
  genreIds: number[];
};

export type Genre = {
  id: number;
  name: string;
};

export type TmdbMovie = {
  id: number;
  title: string;
  vote_average: number;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  genre_ids?: number[];
};

// TMDB-ийн movie-г апп дотор ашиглах хэлбэрт хөрвүүлнэ
export function mapMovie(m: TmdbMovie): Movie {
  return {
    id: m.id,
    title: m.title,
    rating: m.vote_average,
    image: m.poster_path ? `${POSTER}${m.poster_path}` : "",
    backdrop: m.backdrop_path ? `${BACKDROP}${m.backdrop_path}` : "",
    overview: m.overview,
    genreIds: m.genre_ids ?? [],
  };
}

// ===== Дэлгэрэнгүй хуудасны type-ууд =====

export type CrewMember = { id: number; name: string; job: string };
export type CastMember = { id: number; name: string };
export type VideoItem = {
  key: string;
  type: string;
  site: string;
  name: string;
};
export type SimilarMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
};

export type MovieDetail = {
  title: string;
  release_date?: string;
  adult?: boolean;
  runtime?: number;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  vote_count?: number;
  genres?: Genre[];
  overview?: string;
  credits?: { crew: CrewMember[]; cast: CastMember[] };
  videos?: { results: VideoItem[] };
  similar?: { results: SimilarMovie[] };
  success?: boolean;
};
