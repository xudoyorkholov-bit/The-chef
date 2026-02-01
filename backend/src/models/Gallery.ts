import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  image_url: string;
  thumbnail_url: string;
  display_order: number;
  created_at: Date;
}

const GallerySchema = new Schema<IGallery>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  image_url: {
    type: String,
    required: true
  },
  thumbnail_url: {
    type: String,
    required: true
  },
  display_order: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IGallery>('Gallery', GallerySchema);
