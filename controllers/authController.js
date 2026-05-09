import User from '../models/User.js';

import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';

import sendEmail
from '../utils/sendEmail.js';

import { io }
from '../server.js';

/* =========================
   REGISTER USER
========================= */

export const register =
async (req, res) => {

  try {

    const {

      name,

      email,

      password,

      role,

      companyName,

      country,

      phone,

      profileImage,

      businessLicense

    } = req.body;

    /* =========================
       VALIDATION
    ========================= */

    if (

      !name ||
      !email ||
      !password ||
      !role

    ) {

      return res.status(400).json({

        message:
        'Please Fill All Required Fields'

      });

    }

    /* =========================
       CHECK EXISTING USER
    ========================= */

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({

        message:
        'User Already Exists'

      });

    }

    /* =========================
       HASH PASSWORD
    ========================= */

    const hashedPassword =
      await bcrypt.hash(password, 10);

    /* =========================
       CREATE USER
    ========================= */

    const user =
      await User.create({

        name,

        email,

        password: hashedPassword,

        role,

        companyName,

        country,

        phone,

        profileImage,

        businessLicense,

        status: 'pending'

      });

      console.log('User Saved:', user);

    /* =========================
       EMAIL TO ADMIN
    ========================= */

    await sendEmail(

      process.env.ADMIN_EMAIL,

      'New User Registration',

      `

      <h2>
        New User Registered
      </h2>

      <p>
        Name:
        ${user.name}
      </p>

      <p>
        Email:
        ${user.email}
      </p>

      <p>
        Role:
        ${user.role}
      </p>

      <p>
        Status:
        Pending Approval
      </p>

      `

    );

    /* =========================
       EMAIL TO USER
    ========================= */

    await sendEmail(

      user.email,

      'Registration Successful',

      `

      <h2>
        Welcome to MidzGlobal
      </h2>

      <p>
        Your registration was successful.
      </p>

      <p>
        Please wait for admin approval.
      </p>

      `

    );

    /* =========================
       REAL-TIME EVENT
    ========================= */

    io.emit(

      'new-user',

      {

        message:

        `${user.name} registered as ${user.role}`

      }

    );

    /* =========================
       RESPONSE
    ========================= */

    res.status(201).json({

      message:

      'Registration Successful. Wait for Admin Approval.',

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
   LOGIN USER
========================= */

export const login =
async (req, res) => {

  try {

    const {

      email,

      password

    } = req.body;

    /* =========================
       VALIDATION
    ========================= */

    if (!email || !password) {

      return res.status(400).json({

        message:
        'Please Enter Email and Password'

      });

    }

    /* =========================
       FIND USER
    ========================= */

    const user =
      await User.findOne({ email });

    if (!user) {

      return res.status(404).json({

        message:
        'User Not Found'

      });

    }

    /* =========================
       ACCOUNT STATUS
    ========================= */

    if (user.status === 'pending') {

      return res.status(401).json({

        message:
        'Wait for Admin Approval'

      });

    }

    if (user.status === 'rejected') {

      return res.status(401).json({

        message:
        'Your Account Was Rejected'

      });

    }

    /* =========================
       PASSWORD CHECK
    ========================= */

    const isMatch =
      await bcrypt.compare(

        password,

        user.password

      );

    if (!isMatch) {

      return res.status(400).json({

        message:
        'Invalid Credentials'

      });

    }

    /* =========================
       GENERATE TOKEN
    ========================= */

    const token =
      jwt.sign(

        {

          id: user._id,

          role: user.role

        },

        process.env.JWT_SECRET,

        {

          expiresIn: '7d'

        }

      );

    /* =========================
       UPDATE LAST LOGIN
    ========================= */

    user.lastLogin =
      new Date();

    await user.save();

    /* =========================
       RESPONSE
    ========================= */

    res.json({

      message:
      'Login Successful',

      token,

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
   GET CURRENT USER
========================= */

export const getCurrentUser =
async (req, res) => {

  try {

    const user =
      await User.findById(
        req.user.id
      )

      .select('-password');

    if (!user) {

      return res.status(404).json({

        message:
        'User Not Found'

      });

    }

    res.json(user);

  } catch (error) {

    res.status(500).json({

      message:
      error.message

    });

  }

};