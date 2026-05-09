import express from 'express';

import {

  addProduct,
  getProducts

} from '../controllers/productController.js';

import authMiddleware
from '../middleware/authMiddleware.js';

import roleMiddleware
from '../middleware/roleMiddleware.js';

const router = express.Router();

/* =========================
   ADD PRODUCT
   ONLY EXPORTERS
========================= */

router.post(

  '/',

  authMiddleware,

  roleMiddleware('exporter'),

  addProduct

);

/* =========================
   GET ALL PRODUCTS
   ALL AUTHORIZED USERS
========================= */

router.get(

  '/',

  authMiddleware,

  getProducts

);

export default router;