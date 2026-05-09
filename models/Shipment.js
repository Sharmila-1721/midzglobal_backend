import mongoose from 'mongoose';

const shipmentSchema = new mongoose.Schema({

  /* =========================
     ORDER REFERENCE
  ========================= */

  order: {

    type: mongoose.Schema.Types.ObjectId,

    ref: 'Order',

    required: true

  },

  /* =========================
     LOGISTICS PROVIDER
  ========================= */

  logisticsProvider: {

    type: mongoose.Schema.Types.ObjectId,

    ref: 'User',

    required: true

  },

  /* =========================
     TRACKING INFORMATION
  ========================= */

  trackingId: {

    type: String,

    required: true,

    unique: true

  },

  /* =========================
     SHIPPING METHOD
  ========================= */

  shippingMethod: {

    type: String,

    enum: [

      'Air Cargo',
      'Sea Freight',
      'Road Transport',
      'Rail Transport'

    ],

    required: true

  },

  /* =========================
     CURRENT LOCATION
  ========================= */

  currentLocation: {

    type: String,

    default: 'Warehouse'

  },

  /* =========================
     ESTIMATED DELIVERY
  ========================= */

  estimatedDelivery: {

    type: String

  },

  /* =========================
     SHIPMENT STATUS
  ========================= */

  shipmentStatus: {

    type: String,

    enum: [

      'created',
      'picked-up',
      'in-transit',
      'customs-clearance',
      'out-for-delivery',
      'delivered'

    ],

    default: 'created'

  },

  /* =========================
     SHIPPING COST
  ========================= */

  shippingCost: {

    type: Number,

    default: 0

  },

  /* =========================
     DELIVERY DATE
  ========================= */

  deliveredAt: {

    type: Date

  }

},

{

  timestamps: true

});

export default mongoose.model(

  'Shipment',

  shipmentSchema

);