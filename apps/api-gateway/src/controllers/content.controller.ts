import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { pool } from "../config/database";
import { fetchPopularMovies, tmdbMovieToContentItem } from "../services/tmdb.service";
import { fetchNearbyRestaurants, placeToContentItem } from "../services/googlePlaces.service";
import { AppError } from "../middleware/errorHandler.middleware";

export async function getContentItems(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category } = req.query as { category: string };
    if (!category) throw new AppError(400, "category query param required");

    // If TMDB key present and MOVIES requested, fetch live
    if (category === "MOVIES") {
      const movies = await fetchPopularMovies();
      if (movies.length > 0) {
        res.json(movies.map(tmdbMovieToContentItem));
        return;
      }
    }

    const result = await pool.query(
      `SELECT * FROM content_items WHERE category_type = $1 ORDER BY created_at LIMIT 30`,
      [category]
    );
    res.json(result.rows);
  } catch (err) { next(err); }
}

export async function getRestaurantsNearby(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { lat, lng } = req.query as { lat: string; lng: string };
    if (!lat || !lng) throw new AppError(400, "lat and lng required");
    const places = await fetchNearbyRestaurants(parseFloat(lat), parseFloat(lng));
    if (places.length > 0) {
      res.json(places.map(placeToContentItem));
      return;
    }
    const result = await pool.query(`SELECT * FROM content_items WHERE category_type = 'RESTAURANTS' LIMIT 20`);
    res.json(result.rows);
  } catch (err) { next(err); }
}