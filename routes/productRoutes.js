import express from 'express';

import {

  addProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct

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

/* =========================
   GET SINGLE PRODUCT
========================= */

router.get(

  '/:id',

  authMiddleware,

  getSingleProduct

);

/* =========================
   UPDATE PRODUCT
   ONLY EXPORTERS
========================= */

router.put(

  '/:id',

  authMiddleware,

  roleMiddleware('exporter'),

  updateProduct

);

/* =========================
   DELETE PRODUCT
   ONLY EXPORTERS
========================= */

router.delete(

  '/:id',

  authMiddleware,

  roleMiddleware('exporter'),

  deleteProduct

);

export default router;