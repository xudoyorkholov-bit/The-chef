import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  id: string;
  user_id: mongoose.Types.ObjectId;
  user_name: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: Date;
  updated_at: Date;
}

const TestimonialSchema = new Schema<ITestimonial>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user_name: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
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

// Virtual for id
TestimonialSchema.virtual('id').get(function(this: ITestimonial) {
  return this._id.toString();
});

// Ensure virtuals are included in JSON
TestimonialSchema.set('toJSON', { virtuals: true });
TestimonialSchema.set('toObject', { virtuals: true });

// Update the updated_at timestamp before saving
TestimonialSchema.pre('save', function() {
  this.updated_at = new Date();
});

export default mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
