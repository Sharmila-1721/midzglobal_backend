import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({

  /* =========================
     IMPORTER REFERENCE
  ========================= */

  importer: {

    type: mongoose.Schema.Types.ObjectId,

    ref: 'User',

    required: true

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
     PRODUCT REFERENCE
  ========================= */

  product: {

    type: mongoose.Schema.Types.ObjectId,

    ref: 'Product',

    required: true

  },

  /* =========================
     MESSAGE
  ========================= */

  message: {

    type: String,

    required: true

  },

  /* =========================
     REQUIRED QUANTITY
  ========================= */

  quantity: {

    type: Number,

    required: true

  },

  /* =========================
     OFFER PRICE
  ========================= */

  offerPrice: {

    type: Number,

    default: 0

  },

  /* =========================
     INQUIRY STATUS
  ========================= */

  status: {

    type: String,

    enum: [

      'pending',
      'responded',
      'accepted',
      'rejected'

    ],

    default: 'pending'

  },

  /* =========================
     EXPORTER RESPONSE
  ========================= */

  exporterResponse: {

    type: String,

    default: ''

  },

  /* =========================
     RESPONSE DATE
  ========================= */

  respondedAt: {

    type: Date

  }

},

{

  timestamps: true

});

export default mongoose.model(

  'Inquiry',

  inquirySchema

);