import User from '../models/User.js';

import Product from '../models/Product.js';

import Order from '../models/Order.js';

import Inquiry from '../models/Inquiry.js';

import sendEmail
from '../utils/sendEmail.js';

import { io }
from '../server.js';

/* =========================
   GET PENDING USERS
========================= */

export const getPendingUsers =
async (req, res) => {

  try {

    const users =
      await User.find({

        status: 'pending'

      })

      .select('-password')

      .sort({

        createdAt: -1

      });

    res.json(users);

  } catch (error) {

    res.status(500).json({

      message:
      error.message

    });

  }

};

/* =========================
   APPROVE USER
========================= */

export const approveUser =
async (req, res) => {

  try {

    const user =
      await User.findByIdAndUpdate(

        req.params.id,

        {

          status: 'approved'

        },

        { new: true }

      );

    if (!user) {

      return res.status(404).json({

        message:
        'User Not Found'

      });

    }

    /* =========================
       EMAIL TO USER
    ========================= */

    await sendEmail(

      user.email,

      'Account Approved',

      `

      <h2>
        Account Approved
      </h2>

      <p>
        Congratulations ${user.name},
      </p>

      <p>
        Your MidzGlobal account
        has been approved successfully.
      </p>

      <p>
        You can now login
        and access the platform.
      </p>

      `

    );

    /* =========================
       REAL-TIME EVENT
    ========================= */

    io.emit(

      'user-approved',

      {

        message:

        `${user.name} has been approved`

      }

    );

    res.json({

      message:
      'User Approved Successfully',

      user

    });

  } catch (error) {

    res.status(500).json({

      message:
      error.message

    });

  }

};

/* =========================
   REJECT USER
========================= */

export const rejectUser =
async (req, res) => {

  try {

    const user =
      await User.findByIdAndUpdate(

        req.params.id,

        {

          status: 'rejected'

        },

        { new: true }

      );

    if (!user) {

      return res.status(404).json({

        message:
        'User Not Found'

      });

    }

    /* =========================
       EMAIL TO USER
    ========================= */

    await sendEmail(

      user.email,

      'Account Rejected',

      `

      <h2>
        Account Rejected
      </h2>

      <p>
        Hello ${user.name},
      </p>

      <p>
        Your registration request
        was rejected by admin.
      </p>

      <p>
        Contact support for more details.
      </p>

      `

    );

    /* =========================
       REAL-TIME EVENT
    ========================= */

    io.emit(

      'user-rejected',

      {

        message:

        `${user.name} has been rejected`

      }

    );

    res.json({

      message:
      'User Rejected Successfully',

      user

    });

  } catch (error) {

    res.status(500).json({

      message:
      error.message

    });

  }

};

/* =========================
   GET ALL USERS
========================= */

export const getAllUsers =
async (req, res) => {

  try {

    const users =
      await User.find()

      .select('-password')

      .sort({

        createdAt: -1

      });

    res.json(users);

  } catch (error) {

    res.status(500).json({

      message:
      error.message

    });

  }

};

/* =========================
   DELETE USER
========================= */

export const deleteUser =
async (req, res) => {

  try {

    const user =
      await User.findByIdAndDelete(
        req.params.id
      );

    if (!user) {

      return res.status(404).json({

        message:
        'User Not Found'

      });

    }

    io.emit(

      'user-deleted',

      {

        message:

        `${user.name} deleted`

      }

    );

    res.json({

      message:
      'User Deleted Successfully'

    });

  } catch (error) {

    res.status(500).json({

      message:
      error.message

    });

  }

};

/* =========================
   ADMIN ANALYTICS
========================= */

export const getAdminAnalytics =
async (req, res) => {

  try {

    const totalUsers =
      await User.countDocuments();

    const totalProducts =
      await Product.countDocuments();

    const totalOrders =
      await Order.countDocuments();

    const totalInquiries =
      await Inquiry.countDocuments();

    const approvedUsers =
      await User.countDocuments({

        status: 'approved'

      });

    const pendingUsers =
      await User.countDocuments({

        status: 'pending'

      });

    res.json({

      totalUsers,

      totalProducts,

      totalOrders,

      totalInquiries,

      approvedUsers,

      pendingUsers

    });

  } catch (error) {

    res.status(500).json({

      message:
      error.message

    });

  }

};