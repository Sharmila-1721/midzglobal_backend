import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({

  /* =========================
     PRODUCT NAME
  ========================= */

  productName: {

    type: String,

    required: true,

    trim: true

  },

  /* =========================
     DESCRIPTION
  ========================= */

  description: {

    type: String,

    required: true

  },

  /* =========================
     CATEGORY
  ========================= */

  category: {

    type: String,

    required: true

  },

  /* =========================
     SUBCATEGORY
  ========================= */

  subCategory: {

    type: String,

    default: ''

  },

  /* =========================
     PRICE
  ========================= */

  price: {

    type: Number,

    required: true

  },

  /* =========================
     MINIMUM ORDER QUANTITY
  ========================= */

  moq: {

    type: Number,

    required: true

  },

  /* =========================
     STOCK
  ========================= */

  stock: {

    type: Number,

    required: true

  },

  /* =========================
     COUNTRY OF ORIGIN
  ========================= */

  country: {

    type: String,

    required: true

  },

  /* =========================
     PRODUCT IMAGE
  ========================= */

  image: {

    type: String,

    default: ''

  },

  /* =========================
     EXPORTER REFERENCE
  ========================= */

  exporter: {

    type: mongoose.Schema.Types.ObjectId,

    ref: 'User',

    required: true

  },

  /* =========================
     PRODUCT STATUS
  ========================= */

  status: {

    type: String,

    enum: [

      'pending',
      'approved',
      'rejected'

    ],

    default: 'approved'

  },

  /* =========================
     PRODUCT RATING
  ========================= */

  rating: {

    type: Number,

    default: 0

  },

  /* =========================
     TOTAL REVIEWS
  ========================= */

  totalReviews: {

    type: Number,

    default: 0

  },

  /* =========================
     FEATURED PRODUCT
  ========================= */

  featured: {

    type: Boolean,

    default: false

  },

  /* =========================
     LEAD TIME
  ========================= */

  leadTime: {

    type: String,

    default: ''

  },

  /* =========================
     PRODUCTION CAPACITY
  ========================= */

  productionCapacity: {

    type: String,

    default: ''

  }

},

{

  timestamps: true

});

export default mongoose.model(

  'Product',

  productSchema

);