import type { Restaurant } from './types'

/** Sample catalog for UI and Redux smoke tests until a real API is wired. */
export const mockRestaurants: Restaurant[] = [
  {
    id: 'r-midtown-diner',
    name: 'Midtown Diner',
    cuisine: 'American',
    tagline: 'Neighborhood classics since ’09',
    rating: 4.6,
    distanceInKm: 1.2,
    deliveryMinutes: 28,
    priceLevel: 2,
    imageUrl:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    tags: ['Breakfast', 'Comfort food', 'Coffee', 'Gluten-free options'],
    foodItems: [
      {
        id: 'r-midtown-diner-1',
        name: 'Breakfast skillet',
        description: 'Eggs, potatoes, cheddar, scallions.',
        unitPrice: 12.99,
        category: 'contains-egg',
        avg_rating: 4.7,
        imageUrl:
          'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'r-midtown-diner-2',
        name: 'Clubsandwich combo',
        description: 'Turkey, bacon, tomato, fries on the side.',
        unitPrice: 15.49,
        category: 'non-veg',
        avg_rating: 4.5,
        imageUrl:
          'https://images.unsplash.com/photo-1550507992-eb63fbee4957?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'r-midtown-diner-3',
        name: 'House salad',
        description: 'Greens, balsamic, goat cheese crumble.',
        unitPrice: 9.99,
        category: 'veg',
        avg_rating: 4.3,
        imageUrl:
          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'r-bamboo-garden',
    name: 'Bamboo Garden',
    cuisine: 'Pan-Asian',
    tagline: 'Steam, spice, and night-market energy',
    rating: 4.8,
    distanceInKm: 2.4,
    deliveryMinutes: 35,
    priceLevel: 3,
    imageUrl:
      'https://images.unsplash.com/photo-1552566626-52f8ddbf320e?auto=format&fit=crop&w=1200&q=80',
    tags: ['Noodles', 'Dumplings', 'Curries', 'Vegetarian-friendly'],
    foodItems: [
      {
        id: 'r-bamboo-garden-1',
        name: 'Pad thai',
        description: 'Rice noodles, peanuts, lime.',
        unitPrice: 16.5,
        category: 'contains-egg',
        avg_rating: 4.9,
        imageUrl:
          'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'r-bamboo-garden-2',
        name: 'Veg dumplings (8)',
        description: 'Steamed, soy-ginger dip.',
        unitPrice: 8.99,
        category: 'veg',
        avg_rating: 4.6,
        imageUrl:
          'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'r-bamboo-garden-3',
        name: 'Tonkatsu ramen',
        description: 'Rich broth, pork, soft egg.',
        unitPrice: 18.99,
        category: 'non-veg',
        avg_rating: 4.8,
        imageUrl:
          'https://images.unsplash.com/photo-1569718212169-503a72889345?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'r-bamboo-garden-4',
        name: 'Mango sticky rice',
        description: 'Sweet coconut glaze.',
        unitPrice: 7.5,
        category: 'veg',
        avg_rating: 4.9,
        imageUrl:
          'https://images.unsplash.com/photo-1596798150876-f06190155376?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'r-corner-pizza',
    name: 'Corner Pizza Co.',
    cuisine: 'Italian',
    tagline: 'Wood-fired pies & porch tables',
    rating: 4.4,
    distanceInKm: 0.8,
    deliveryMinutes: 22,
    priceLevel: 2,
    imageUrl:
      'https://images.unsplash.com/photo-1513104890138-7ceb74363fce?auto=format&fit=crop&w=1200&q=80',
    tags: ['Pizza', 'Pasta', 'Salads', 'Family combos'],
    foodItems: [
      {
        id: 'r-corner-pizza-1',
        name: 'Margherita',
        description: 'San marzano, mozzarella, basil.',
        unitPrice: 16.99,
        category: 'veg',
        avg_rating: 4.5,
        imageUrl:
          'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'r-corner-pizza-2',
        name: 'Pepperoni classic',
        description: 'Cup-and-char pepperoni.',
        unitPrice: 17.99,
        category: 'non-veg',
        avg_rating: 4.6,
        imageUrl:
          'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'r-corner-pizza-3',
        name: 'Caesar wedge',
        description: 'Anchovy-ish dressing optional.',
        unitPrice: 8.5,
        category: 'contains-egg',
        avg_rating: 4.2,
        imageUrl:
          'https://images.unsplash.com/photo-1546793665-746bbd47f241?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
]
