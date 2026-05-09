import express from 'express';

import {

  getPendingUsers,
  approveUser,
  rejectUser

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

export default router;