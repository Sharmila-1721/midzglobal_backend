import express from 'express';

import {

  register,
  login,
  getCurrentUser

} from '../controllers/authController.js';

import authMiddleware
from '../middleware/authMiddleware.js';

const router = express.Router();

/* =========================
   REGISTER USER
========================= */

router.post(

  '/register',

  register

);

/* =========================
   LOGIN USER
========================= */

router.post(

  '/login',

  login

);

/* =========================
   GET CURRENT USER
========================= */

router.get(

  '/me',

  authMiddleware,

  getCurrentUser

);

export default router;