import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({

  /* =========================
     IMPORTER
  ========================= */

  importer: {

    type: mongoose.Schema.Types.ObjectId,

    ref: 'User',

    required: true

  },

  /* =========================
     EXPORTER
  ========================= */

  exporter: {

    type: mongoose.Schema.Types.ObjectId,

    ref: 'User',

    required: true

  },

  /* =========================
     PRODUCT
  ========================= */

  product: {

    type: mongoose.Schema.Types.ObjectId,

    ref: 'Product',

    required: true

  },

  /* =========================
     INQUIRY REFERENCE
  ========================= */

  inquiry: {

    type: mongoose.Schema.Types.ObjectId,

    ref: 'Inquiry'

  },

  /* =========================
     ORDER QUANTITY
  ========================= */

  quantity: {

    type: Number,

    required: true

  },

  /* =========================
     TOTAL AMOUNT
  ========================= */

  totalAmount: {

    type: Number,

    required: true

  },

  /* =========================
     PAYMENT STATUS
  ========================= */

  paymentStatus: {

    type: String,

    enum: [

      'pending',
      'paid',
      'failed',
      'refunded'

    ],

    default: 'pending'

  },

  /* =========================
     ORDER STATUS
  ========================= */

  status: {

    type: String,

    enum: [

      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled'

    ],

    default: 'pending'

  },

  /* =========================
     SHIPPING ADDRESS
  ========================= */

  shippingAddress: {

    type: String,

    default: ''

  },

  /* =========================
     PAYMENT METHOD
  ========================= */

  paymentMethod: {

    type: String,

    enum: [

      'bank-transfer',
      'stripe',
      'razorpay',
      'paypal'

    ],

    default: 'bank-transfer'

  },

  /* =========================
     ORDER NOTES
  ========================= */

  notes: {

    type: String,

    default: ''

  }

},

{

  timestamps: true

});

export default mongoose.model(

  'Order',

  orderSchema

);