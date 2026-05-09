import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

  /* =========================
     BASIC INFORMATION
  ========================= */

  name: {

    type: String,

    required: true,

    trim: true

  },

  email: {

    type: String,

    required: true,

    unique: true,

    trim: true,

    lowercase: true

  },

  password: {

    type: String,

    required: true

  },

  /* =========================
     ROLE MANAGEMENT
  ========================= */

  role: {

    type: String,

    enum: [

      'admin',
      'importer',
      'exporter',
      'logistics'

    ],

    required: true

  },

  /* =========================
     ACCOUNT STATUS
  ========================= */

  status: {

    type: String,

    enum: [

      'pending',
      'approved',
      'rejected'

    ],

    default: 'pending'

  },

  /* =========================
     BUSINESS DETAILS
  ========================= */

  companyName: {

    type: String,

    trim: true

  },

  country: {

    type: String,

    trim: true

  },

  phone: {

    type: String,

    trim: true

  },

  /* =========================
     PROFILE IMAGE
  ========================= */

  profileImage: {

    type: String,

    default: ''

  },

  /* =========================
     BUSINESS LICENSE
  ========================= */

  businessLicense: {

    type: String,

    default: ''

  },

  /* =========================
     EMAIL VERIFICATION
  ========================= */

  isVerified: {

    type: Boolean,

    default: false

  },

  /* =========================
     LAST LOGIN
  ========================= */

  lastLogin: {

    type: Date

  }

},

{

  timestamps: true

});

export default mongoose.model(
  'User',
  userSchema
);