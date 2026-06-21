import { env } from "../config/env";
import { logger } from "../utils/logger";

export interface PlaceResult {
  place_id: string;
  name: string;
  rating?: number;
  price_level?: number;
  vicinity?: string;
  photos?: Array<{ photo_reference: string }>;
}

export async function fetchNearbyRestaurants(lat: number, lng: number, radius = 1500): Promise<PlaceResult[]> {
  if (!env.GOOGLE_PLACES_API_KEY) {
    logger.warn("[Places] No API key — returning empty list");
    return [];
  }
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&key=${env.GOOGLE_PLACES_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Places error: ${res.status}`);
  const data = await res.json() as { results: PlaceResult[] };
  return data.results;
}

export function placeToContentItem(place: PlaceResult) {
  return {
    id: place.place_id,
    category_type: "RESTAURANTS",
    title: place.name,
    image_url: null,
    meta_data: {
      rating: place.rating,
      price_level: place.price_level,
      vicinity: place.vicinity,
    },
  };
}