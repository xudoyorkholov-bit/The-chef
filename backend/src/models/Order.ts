import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  menu_item_id: string;
  menu_item_name: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user_id?: string;
  order_number: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  items: IOrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
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

const OrderSchema = new Schema<IOrder>({
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
      validator: function(items: IOrderItem[]) {
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

OrderSchema.pre('save', function() {
  this.updated_at = new Date();
});

export default mongoose.model<IOrder>('Order', OrderSchema);
