import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password_hash: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    full_name: {
        type: String,
        trim: true
    },
    profile_picture_url: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer'
    },
    payment_methods: [{
            id: {
                type: String,
                required: true
            },
            cardNumber: {
                type: String,
                required: true
            },
            cardHolder: {
                type: String,
                required: true
            },
            expiryDate: {
                type: String,
                required: true
            },
            isDefault: {
                type: Boolean,
                default: false
            }
        }],
    created_at: {
        type: Date,
        default: Date.now
    },
    last_login: {
        type: Date
    }
});
// Virtual for id
UserSchema.virtual('id').get(function () {
    return this._id.toString();
});
// Ensure virtuals are included in JSON
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });
export default mongoose.model('User', UserSchema);
