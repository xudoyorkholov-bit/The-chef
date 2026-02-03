import mongoose, { Schema } from 'mongoose';
const GallerySchema = new Schema({
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
// Virtual for id
GallerySchema.virtual('id').get(function () {
    return this._id.toString();
});
// Ensure virtuals are included in JSON
GallerySchema.set('toJSON', { virtuals: true });
GallerySchema.set('toObject', { virtuals: true });
export default mongoose.model('Gallery', GallerySchema);
