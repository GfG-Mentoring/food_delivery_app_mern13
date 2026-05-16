import express from 'express';

import { Restaurant } from '../models/restaurant.model.js';
import { listRestaurantsNear } from '../services/restaurants.query.js';
import { restaurantDocToJSON } from '../services/restaurants.serializer.js';
import { AppError } from '../utils/errors.js';
import { isValidObjectIdString } from '../utils/objectId.js';

const router = express.Router();

const MIN_LAT = -90;
const MAX_LAT = 90;
const MIN_LNG = -180;
const MAX_LNG = 180;
const DEFAULT_RADIUS_KM = 15;
const MAX_RADIUS_KM = 50;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function parseCommaSeparatedTags(raw: string | undefined): string[] {
  if (raw === undefined || raw.trim() === '') {
    return [];
  }
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

router.get('/', async (req, res, next) => {
  try {
    const latRaw = req.query.lat;
    const lngRaw = req.query.lng;
    if (
      latRaw === undefined ||
      latRaw === '' ||
      lngRaw === undefined ||
      lngRaw === ''
    ) {
      throw new AppError(400, 'lat and lng query parameters are required');
    }

    const lat = Number.parseFloat(String(latRaw));
    const lng = Number.parseFloat(String(lngRaw));
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw new AppError(
        400,
        'lat and lng must be finite numbers',
      );
    }
    if (lat < MIN_LAT || lat > MAX_LAT || lng < MIN_LNG || lng > MAX_LNG) {
      throw new AppError(
        400,
        'lat or lng outside valid WGS84 bounds',
      );
    }

    let radiusKm = DEFAULT_RADIUS_KM;
    if (
      req.query.radiusKm !== undefined &&
      req.query.radiusKm !== ''
    ) {
      const r = Number.parseFloat(String(req.query.radiusKm));
      if (!Number.isFinite(r) || r <= 0) {
        throw new AppError(
          400,
          'radiusKm must be a positive number',
        );
      }
      radiusKm = Math.min(r, MAX_RADIUS_KM);
    }

    let page = DEFAULT_PAGE;
    if (req.query.page !== undefined && req.query.page !== '') {
      const p = Number.parseInt(String(req.query.page), 10);
      if (!Number.isInteger(p) || p < 1) {
        throw new AppError(
          400,
          'page must be an integer greater than or equal to 1',
        );
      }
      page = p;
    }

    let limit = DEFAULT_LIMIT;
    if (req.query.limit !== undefined && req.query.limit !== '') {
      const l = Number.parseInt(String(req.query.limit), 10);
      if (!Number.isInteger(l) || l < 1 || l > MAX_LIMIT) {
        throw new AppError(
          400,
          `limit must be an integer between 1 and ${MAX_LIMIT}`,
        );
      }
      limit = l;
    }

    let minRating: number | undefined;
    if (
      req.query.minRating !== undefined &&
      req.query.minRating !== ''
    ) {
      const m = Number.parseFloat(String(req.query.minRating));
      if (!Number.isFinite(m)) {
        throw new AppError(400, 'minRating must be a number');
      }
      minRating = m;
    }

    const cuisineRaw = req.query.cuisine;
    const cuisine =
      cuisineRaw !== undefined ? String(cuisineRaw) : undefined;

    let priceLevel: number | undefined;
    if (
      req.query.priceLevel !== undefined &&
      req.query.priceLevel !== ''
    ) {
      const pl = Number.parseInt(String(req.query.priceLevel), 10);
      if (
        !Number.isInteger(pl) ||
        pl < 1 ||
        pl > 4
      ) {
        throw new AppError(
          400,
          'priceLevel must be an integer between 1 and 4',
        );
      }
      priceLevel = pl;
    }

    const tagsRaw =
      typeof req.query.tags === 'string' ? req.query.tags : undefined;
    const tagTokens = parseCommaSeparatedTags(tagsRaw);

    const qRaw = req.query.q;
    const q = qRaw !== undefined ? String(qRaw) : undefined;

    const result = await listRestaurantsNear({
      lat,
      lng,
      radiusKm,
      page,
      limit,
      minRating,
      cuisine,
      tagTokens: tagTokens.length > 0 ? tagTokens : undefined,
      priceLevel,
      q,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectIdString(id)) {
      throw new AppError(404, 'Restaurant not found');
    }

    const doc = await Restaurant.findById(id).lean().exec();
    if (!doc) {
      throw new AppError(404, 'Restaurant not found');
    }

    res.json(restaurantDocToJSON(doc));
  } catch (err) {
    next(err);
  }
});

export default router;
