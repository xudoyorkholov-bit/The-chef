import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuItem extends Document {
  name: string;
  name_ru?: string;
  description: string;
  description_ru?: string;
  price: number;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage';
  image_url: string;
  available: boolean;
  created_at: Date;
  updated_at: Date;
}

const MenuItemSchema = new Schema<IMenuItem>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  name_ru: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  description_ru: {
    type: String
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['appetizer', 'main', 'dessert', 'beverage']
  },
  image_url: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update updated_at on save
MenuItemSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export default mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
