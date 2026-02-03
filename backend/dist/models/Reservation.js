import mongoose, { Schema } from 'mongoose';
const ReservationSchema = new Schema({
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
// Virtual for id
ReservationSchema.virtual('id').get(function () {
    return this._id.toString();
});
// Ensure virtuals are included in JSON
ReservationSchema.set('toJSON', { virtuals: true });
ReservationSchema.set('toObject', { virtuals: true });
ReservationSchema.pre('save', function () {
    this.updated_at = new Date();
});
export default mongoose.model('Reservation', ReservationSchema);
