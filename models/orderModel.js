import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderType: {
    type: String,
    enum: ["dine-in", "takeaway", "delivery"],
    default: "dine-in",
    required: true
  },

  tableNumber: {
    type: Number,
    required: function() {
      return this.orderType === "dine-in";
    }
  },

  customerName: {
    type: String
  },

  customerPhone: {
    type: String
  },

  deliveryAddress: {
    type: String
  },

  items: [
    {
      menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem"
      },

      itemName: {
        type: String,
        required: true
      },

      price: {
        type: Number,
        required: true
      },

      quantity: {
        type: Number,
        required: true
      }
    }
  ],

  totalAmount: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    default: "pending"
  },
  paidAt: {
    type: Date
  },
}, {
  timestamps: true
});

const Order = mongoose.model("Order", orderSchema);

export default Order;