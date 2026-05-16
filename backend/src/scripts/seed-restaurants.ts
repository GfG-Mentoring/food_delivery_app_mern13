import 'dotenv/config';

import { env } from '../config/env.js';
import { connectDb, disconnectDb } from '../lib/db.js';
import { logger } from '../logger.js';
import { Restaurant } from '../models/restaurant.model.js';

type SeedRestaurant = {
  name: string;
  cuisine?: string;
  rating?: number;
  imageUrl?: string;
  tagline?: string;
  deliveryMinutes?: number;
  priceLevel?: 1 | 2 | 3 | 4;
  tags: string[];
  foodItems: Array<{
    id: string;
    name: string;
    unitPrice: number;
    description?: string;
    imageUrl?: string;
    category?: 'veg' | 'non-veg' | 'contains-egg';
    avg_rating: number;
  }>;
  /** GeoJSON: `[lng, lat]` */
  location: { type: 'Point'; coordinates: [number, number] };
};

/**
 * Predictable Bangalore dev data: wipes **all** documents in `restaurants`
 * each run (`deleteMany`), then inserts the bundle below for repeatable local setups.
 */

const bangaloreSeed: SeedRestaurant[] = [
  {
    name: 'Truffles — Koramangala',
    cuisine: 'American',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349',
    tagline: 'Legendary steaks and cheesy overload burgers.',
    deliveryMinutes: 32,
    priceLevel: 2,
    tags: ['burgers', 'comfort-food', 'late-night'],
    location: {
      type: 'Point',
      coordinates: [77.62711, 12.92792],
    },
    foodItems: [
      {
        id: 'tru-kr-001',
        name: 'Chicken Steak Sizzler',
        unitPrice: 429,
        avg_rating: 4.7,
        category: 'non-veg',
      },
      {
        id: 'tru-kr-002',
        name: 'Chocolate Milkshake',
        unitPrice: 199,
        description: 'Thick malted cocoa shake.',
        avg_rating: 4.6,
        category: 'veg',
      },
      {
        id: 'tru-kr-003',
        name: 'Egg Fried Rice Bowl',
        unitPrice: 299,
        avg_rating: 4.4,
        category: 'contains-egg',
      },
    ],
  },
  {
    name: 'The Filter Coffee House — Indiranagar',
    cuisine: 'South Indian',
    rating: 4.5,
    imageUrl:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950',
    tagline: 'Crisp dosas + traditional filter kaapi.',
    deliveryMinutes: 28,
    priceLevel: 1,
    tags: ['breakfast', 'south-indian', 'coffee'],
    location: {
      type: 'Point',
      coordinates: [77.64081, 12.97835],
    },
    foodItems: [
      {
        id: 'fc-in-001',
        name: 'Masala Dosa Meal',
        unitPrice: 189,
        avg_rating: 4.8,
        category: 'veg',
      },
      {
        id: 'fc-in-002',
        name: 'Mini Idli Bucket',
        unitPrice: 129,
        avg_rating: 4.5,
        category: 'veg',
      },
      {
        id: 'fc-in-003',
        name: 'Chicken Chettinad Combo',
        unitPrice: 329,
        avg_rating: 4.4,
        category: 'non-veg',
      },
    ],
  },
  {
    name: 'Big Brewsky — Electronic City Phase 2',
    cuisine: 'Contemporary Indian',
    rating: 4.3,
    imageUrl:
      'https://images.unsplash.com/photo-1572116469696-31de0f17cc73',
    tagline: 'Rooftop brewpub with live grills.',
    deliveryMinutes: 52,
    priceLevel: 3,
    tags: ['craft-beer', 'bbq', 'weekend-brunch'],
    location: {
      type: 'Point',
      coordinates: [77.68324, 12.84951],
    },
    foodItems: [
      {
        id: 'bb-ec-001',
        name: 'Beer-Battered Fish Tacos',
        unitPrice: 349,
        avg_rating: 4.3,
        category: 'non-veg',
      },
      {
        id: 'bb-ec-002',
        name: 'Paneer Tikka Slider Platter',
        unitPrice: 319,
        avg_rating: 4.4,
        category: 'veg',
      },
      {
        id: 'bb-ec-003',
        name: 'Tandoor Veg Platter',
        unitPrice: 389,
        avg_rating: 4.2,
        category: 'veg',
      },
    ],
  },
  {
    name: 'Vidyarthi Bhavan — Malleshwaram',
    cuisine: 'South Indian',
    rating: 4.8,
    imageUrl:
      'https://images.unsplash.com/photo-1576402187878-974f7006e982',
    tagline: 'Heritage breakfasts since 1938.',
    deliveryMinutes: 36,
    priceLevel: 1,
    tags: ['heritage', 'benne-masala', 'family'],
    location: {
      type: 'Point',
      coordinates: [77.56971, 13.00918],
    },
    foodItems: [
      {
        id: 'vb-ml-001',
        name: 'Benne Masala Dosa',
        unitPrice: 95,
        avg_rating: 4.9,
        category: 'veg',
      },
      {
        id: 'vb-ml-002',
        name: 'Khara Bath + Kesari Combo',
        unitPrice: 85,
        avg_rating: 4.7,
        category: 'veg',
      },
    ],
  },
  {
    name: 'Smoor Chocolatiers — Brigade Road',
    cuisine: 'Desserts',
    rating: 4.4,
    imageUrl:
      'https://images.unsplash.com/photo-1551024506-0bccd828d307',
    tagline: 'Bean-to-bar desserts and viennoiserie.',
    deliveryMinutes: 24,
    priceLevel: 2,
    tags: ['chocolate', 'pastry', 'desserts'],
    location: {
      type: 'Point',
      coordinates: [77.60735, 12.97492],
    },
    foodItems: [
      {
        id: 'sm-br-001',
        name: 'Single-Origin Dome Cake',
        unitPrice: 245,
        avg_rating: 4.6,
        category: 'veg',
      },
      {
        id: 'sm-br-002',
        name: 'Pain au chocolat',
        unitPrice: 149,
        avg_rating: 4.3,
        category: 'veg',
      },
      {
        id: 'sm-br-003',
        name: 'Salted caramel tart',
        unitPrice: 199,
        avg_rating: 4.5,
        category: 'contains-egg',
      },
    ],
  },
  {
    name: 'Meghana Foods — BTM',
    cuisine: 'Andhra',
    rating: 4.7,
    imageUrl:
      'https://images.unsplash.com/photo-1694849784454-3c6d5d5c3346',
    tagline: 'Fiery Nellore-style biryanis and natu kodi.',
    deliveryMinutes: 41,
    priceLevel: 2,
    tags: ['biryani', 'andhra-spicy'],
    location: {
      type: 'Point',
      coordinates: [77.61071, 12.91693],
    },
    foodItems: [
      {
        id: 'mg-bt-001',
        name: 'Mutton Hydrabadi Dum Biryani',
        unitPrice: 389,
        avg_rating: 4.8,
        category: 'non-veg',
      },
      {
        id: 'mg-bt-002',
        name: 'Royyala Iguru Meal',
        unitPrice: 429,
        avg_rating: 4.6,
        category: 'non-veg',
      },
      {
        id: 'mg-bt-003',
        name: 'Bhindi Peanut Fry Meal',
        unitPrice: 219,
        avg_rating: 4.5,
        category: 'veg',
      },
    ],
  },
  {
    name: 'Nasi and Mee Asian Canteen — Whitefield',
    cuisine: 'Pan-Asian',
    rating: 4.5,
    imageUrl:
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
    tagline: 'Ramen bowls, Thai curries & baos.',
    deliveryMinutes: 44,
    priceLevel: 3,
    tags: ['ramen', 'stir-fry', 'vegetarian-options'],
    location: {
      type: 'Point',
      coordinates: [77.72777, 12.95747],
    },
    foodItems: [
      {
        id: 'nm-wf-001',
        name: 'Tokyo Soy Ramen Bowl',
        unitPrice: 399,
        avg_rating: 4.6,
        category: 'contains-egg',
      },
      {
        id: 'nm-wf-002',
        name: 'Tofu Jungle Curry Rice',
        unitPrice: 329,
        avg_rating: 4.4,
        category: 'veg',
      },
    ],
  },
  {
    name: 'Kobe Sizzlers — MG Road Trinity',
    cuisine: 'Continental',
    rating: 4.2,
    imageUrl:
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
    tagline: 'Sizzlers with cheese pulls for days.',
    deliveryMinutes: 33,
    priceLevel: 3,
    tags: ['sizzlers', 'steakhouse'],
    location: {
      type: 'Point',
      coordinates: [77.59642, 12.97411],
    },
    foodItems: [
      {
        id: 'ks-mg-001',
        name: 'Exotic Vegetable Sizzler',
        unitPrice: 379,
        avg_rating: 4.2,
        category: 'veg',
      },
      {
        id: 'ks-mg-002',
        name: 'Lamb Pepper Steak Sizzler',
        unitPrice: 569,
        avg_rating: 4.4,
        category: 'non-veg',
      },
      {
        id: 'ks-mg-003',
        name: 'Chocolate Brownie Ala Mode',
        unitPrice: 219,
        avg_rating: 4.1,
        category: 'contains-egg',
      },
    ],
  },
  {
    name: 'Halli Mane Jayanagar',
    cuisine: 'Karnataka veg',
    rating: 4.5,
    imageUrl:
      'https://images.unsplash.com/photo-1694849784725-7469bdcff7d3',
    tagline: 'Oota on banana leaf with heirloom recipes.',
    deliveryMinutes: 30,
    priceLevel: 1,
    tags: ['thali', 'traditional', 'budget'],
    location: {
      type: 'Point',
      coordinates: [77.59384, 12.92498],
    },
    foodItems: [
      {
        id: 'hm-jy-001',
        name: 'North Karnataka Meals',
        unitPrice: 199,
        avg_rating: 4.6,
        category: 'veg',
      },
      {
        id: 'hm-jy-002',
        name: 'Jolada Rotti Oota Platte',
        unitPrice: 189,
        avg_rating: 4.5,
        category: 'veg',
      },
    ],
  },
  {
    name: 'Smoke House Deli — Lavelle Road',
    cuisine: 'European',
    rating: 4.4,
    imageUrl:
      'https://images.unsplash.com/photo-1572441713132-51c75654db73',
    tagline: 'All-day deli plates on a quiet lane.',
    deliveryMinutes: 27,
    priceLevel: 3,
    tags: ['all-day-breakfast', 'salads'],
    location: {
      type: 'Point',
      coordinates: [77.59327, 12.97468],
    },
    foodItems: [
      {
        id: 'sh-lv-001',
        name: 'Harvest Grain Bowl',
        unitPrice: 349,
        avg_rating: 4.3,
        category: 'veg',
      },
      {
        id: 'sh-lv-002',
        name: 'Pesto Chicken Panini',
        unitPrice: 369,
        avg_rating: 4.4,
        category: 'non-veg',
      },
      {
        id: 'sh-lv-003',
        name: 'Belgian waffles with maple',
        unitPrice: 279,
        avg_rating: 4.2,
        category: 'contains-egg',
      },
    ],
  },
  {
    name: 'Karaköy Börekleri — UB City',
    cuisine: 'Turkish',
    rating: 4.1,
    imageUrl:
      'https://images.unsplash.com/photo-1626082929524-087d02b843b9',
    tagline: 'Buttery börek twists + Turkish tea.',
    deliveryMinutes: 22,
    priceLevel: 2,
    tags: ['baked-savories', 'snacks'],
    location: {
      type: 'Point',
      coordinates: [77.59589, 12.97186],
    },
    foodItems: [
      {
        id: 'kb-ub-001',
        name: 'Spinach + Feta Borek',
        unitPrice: 249,
        avg_rating: 4.3,
        category: 'veg',
      },
    ],
  },
];

async function seed(): Promise<void> {
  await connectDb(env.mongodbUri);
  try {
    logger.info(
      'Deleting existing restaurants collection documents (predictable seed).',
    );
    await Restaurant.deleteMany({});
    await Restaurant.insertMany(bangaloreSeed);
    logger.info(`Inserted ${bangaloreSeed.length} Bangalore restaurants`);
  } finally {
    await disconnectDb();
    logger.info('Disconnected from MongoDB');
  }
}

void seed().catch((err: unknown) => {
  logger.error(err);
  process.exit(1);
});
