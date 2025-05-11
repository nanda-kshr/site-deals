import mongoose from 'mongoose';

// Define a schema for order items
const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  fileId: {
    type: String,
    required: true
  },
  gallery: [{
    type: String
  }],
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  size: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  }
});

// Define the main Order schema
const OrderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  items: {
    type: [OrderItemSchema],
    required: true,
    validate: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validator: function(v: string | any[]) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'At least one item is required'
    }
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to update the updatedAt timestamp
OrderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Delete all existing models before creating a new one
// This is a workaround for development with hot reloading
// Remove this in production!
if (mongoose.models.Order) {
  delete mongoose.models.Order;
}

// Create and export the model
const Order = mongoose.model('Order', OrderSchema);
export default Order;