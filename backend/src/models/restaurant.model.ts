import mongoose from 'mongoose';

/** Aligns with frontend `FoodItemCategory`. */
export const foodItemCategories = ['veg', 'non-veg', 'contains-egg'] as const;

export type FoodItemCategory = (typeof foodItemCategories)[number];

const foodItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    description: { type: String },
    imageUrl: { type: String },
    category: { type: String, enum: foodItemCategories },
    avg_rating: { type: Number, required: true },
  },
  { _id: false },
);

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cuisine: { type: String },
    rating: { type: Number },
    imageUrl: { type: String },
    tagline: { type: String },
    deliveryMinutes: { type: Number },
    priceLevel: { type: Number, min: 1, max: 4 },
    tags: { type: [String], default: [] },
    foodItems: { type: [foodItemSchema], default: [] },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        validate(v: unknown): boolean {
          return Array.isArray(v) && v.length === 2;
        },
      },
    },
  },
  { timestamps: false },
);

restaurantSchema.index({ location: '2dsphere' });

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);
