import { env } from "../config/env";
import { logger } from "../utils/logger";

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export async function fetchPopularMovies(page = 1): Promise<TMDBMovie[]> {
  if (!env.TMDB_API_KEY) {
    logger.warn("[TMDB] No API key — returning empty list");
    return [];
  }
  const url = `${TMDB_BASE}/movie/popular?api_key=${env.TMDB_API_KEY}&page=${page}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  const data = await res.json() as { results: TMDBMovie[] };
  return data.results;
}

export function tmdbMovieToContentItem(movie: TMDBMovie) {
  return {
    id: `tt_tmdb_${movie.id}`,
    category_type: "MOVIES",
    title: movie.title,
    image_url: movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : null,
    meta_data: {
      overview: movie.overview,
      release_date: movie.release_date,
      rating: movie.vote_average,
    },
  };
}