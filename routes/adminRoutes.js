import express from 'express';

import {

  getPendingUsers,
  approveUser,
  rejectUser,
  getAllUsers,
  deleteUser,
  getAdminAnalytics

} from '../controllers/adminController.js';

import authMiddleware
from '../middleware/authMiddleware.js';

import roleMiddleware
from '../middleware/roleMiddleware.js';

const router = express.Router();

/* =========================
   GET PENDING USERS
   ONLY ADMIN
========================= */

router.get(

  '/pending-users',

  authMiddleware,

  roleMiddleware('admin'),

  getPendingUsers

);

/* =========================
   APPROVE USER
   ONLY ADMIN
========================= */

router.put(

  '/approve/:id',

  authMiddleware,

  roleMiddleware('admin'),

  approveUser

);

/* =========================
   REJECT USER
   ONLY ADMIN
========================= */

router.put(

  '/reject/:id',

  authMiddleware,

  roleMiddleware('admin'),

  rejectUser

);

/* =========================
   GET ALL USERS
   ONLY ADMIN
========================= */

router.get(

  '/users',

  authMiddleware,

  roleMiddleware('admin'),

  getAllUsers

);

/* =========================
   DELETE USER
   ONLY ADMIN
========================= */

router.delete(

  '/users/:id',

  authMiddleware,

  roleMiddleware('admin'),

  deleteUser

);

/* =========================
   ADMIN ANALYTICS
   ONLY ADMIN
========================= */

router.get(

  '/analytics',

  authMiddleware,

  roleMiddleware('admin'),

  getAdminAnalytics

);

export default router;