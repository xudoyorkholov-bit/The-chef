import mongoose, { Schema, Document } from 'mongoose';

export interface IReservation extends Document {
  user_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  reservation_date: Date;
  reservation_time: string;
  party_size: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  special_requests?: string;
  created_at: Date;
  updated_at: Date;
}

const ReservationSchema = new Schema<IReservation>({
  user_id: {
    type: String,
    index: true
  },
  customer_name: {
    type: String,
    required: true,
    trim: true
  },
  customer_email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  customer_phone: {
    type: String,
    required: true,
    trim: true
  },
  reservation_date: {
    type: Date,
    required: true
  },
  reservation_time: {
    type: String,
    required: true
  },
  party_size: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  special_requests: {
    type: String
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

ReservationSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export default mongoose.model<IReservation>('Reservation', ReservationSchema);
