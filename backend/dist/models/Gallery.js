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
export default mongoose.model('Gallery', GallerySchema);
