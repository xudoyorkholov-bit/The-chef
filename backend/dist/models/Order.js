import mongoose, { Schema } from 'mongoose';
const OrderItemSchema = new Schema({
    menu_item_id: {
        type: String,
        required: true
    },
    menu_item_name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false });
const OrderSchema = new Schema({
    user_id: {
        type: String,
        index: true
    },
    order_number: {
        type: String,
        required: true,
        unique: true
    },
    customer_name: {
        type: String,
        trim: true
    },
    customer_phone: {
        type: String,
        trim: true
    },
    customer_email: {
        type: String,
        lowercase: true,
        trim: true
    },
    items: {
        type: [OrderItemSchema],
        required: true,
        validate: {
            validator: function (items) {
                return items.length > 0;
            },
            message: 'Order must have at least one item'
        }
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
        default: 'pending'
    },
    notes: {
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
OrderSchema.virtual('id').get(function () {
    return this._id.toString();
});
// Ensure virtuals are included in JSON
OrderSchema.set('toJSON', { virtuals: true });
OrderSchema.set('toObject', { virtuals: true });
OrderSchema.pre('save', function () {
    this.updated_at = new Date();
});
export default mongoose.model('Order', OrderSchema);
