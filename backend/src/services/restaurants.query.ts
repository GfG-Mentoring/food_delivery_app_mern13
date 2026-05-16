import type { PipelineStage } from 'mongoose';

import { logger } from '../logger.js';

import { Restaurant } from '../models/restaurant.model.js';
import { escapeRegExp } from '../utils/regexEscape.js';
import type {
  RestaurantDocLike,
  RestaurantResponse,
} from './restaurants.serializer.js';
import { restaurantDocToJSON } from './restaurants.serializer.js';

export type ListRestaurantsInput = {
  lat: number;
  lng: number;
  /** Clamped to backend max (50). */
  radiusKm: number;
  page: number;
  limit: number;
  minRating?: number;
  cuisine?: string;
  /** Tag tokens; ANY match on `tags`. */
  tagTokens?: string[];
  priceLevel?: number;
  q?: string;
};

export type ListRestaurantsResult = {
  items: RestaurantResponse[];
  page: number;
  limit: number;
  totalCount: number;
};

export async function listRestaurantsNear(
  input: ListRestaurantsInput,
): Promise<ListRestaurantsResult> {
  const {
    lat,
    lng,
    radiusKm,
    page,
    limit,
    minRating,
    cuisine,
    tagTokens,
    priceLevel,
    q,
  } = input;

  const queryFilter: Record<string, unknown> = {};

  if (minRating !== undefined) {
    queryFilter.rating = { $gte: minRating };
  }

  const cuisineTrimmed = cuisine?.trim();
  if (cuisineTrimmed) {
    queryFilter.cuisine = {
      $regex: escapeRegExp(cuisineTrimmed),
      $options: 'i',
    };
  }

  if (tagTokens && tagTokens.length > 0) {
    queryFilter.tags = { $in: tagTokens };
  }

  if (priceLevel !== undefined) {
    queryFilter.priceLevel = priceLevel;
  }

  const qTrimmed = q?.trim();
  if (qTrimmed) {
    queryFilter.name = {
      $regex: escapeRegExp(qTrimmed),
      $options: 'i',
    };
  }

  const skip = (page - 1) * limit;


  logger.info(`user location: [${lng}, ${lat}]`);

  const geoNearStage: PipelineStage = {
    $geoNear: {
      near: { type: 'Point', coordinates: [lng, lat] },
      distanceField: 'distance',
      spherical: true,
      maxDistance: radiusKm * 1000,
      query: queryFilter,
      key: 'location',
    },
  };

  const pipeline: PipelineStage[] = [
    geoNearStage,
    {
      $facet: {
        pageItems: [{ $skip: skip }, { $limit: limit }],
        totalDocs: [{ $count: 'totalCount' }],
      },
    },
  ];

  type AggRow = RestaurantDocLike & { distance: number };

  type FacetAgg = {
    pageItems: AggRow[];
    totalDocs: Array<{ totalCount: number }>;
  };

  const [facet] = await Restaurant.aggregate<FacetAgg>(pipeline);
  const pageItems = facet?.pageItems ?? [];
  const totalCount = facet?.totalDocs[0]?.totalCount ?? 0;

  logger.info(`total nearby restaurants found: ${totalCount}`);

  const items = pageItems.map((raw) => {
    const { distance: distanceMeters, ...restaurantFields } = raw;
    return restaurantDocToJSON(restaurantFields, { distanceMeters });
  });

  return { items, page, limit, totalCount };
}
