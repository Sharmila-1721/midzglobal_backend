import express from 'express';

import {

  createOrder,
  getImporterOrders,
  getExporterOrders,
  getPendingShipmentOrders,
  getSingleOrder,
  updateOrderStatus

} from '../controllers/orderController.js';

import authMiddleware
from '../middleware/authMiddleware.js';

import roleMiddleware
from '../middleware/roleMiddleware.js';

const router = express.Router();

/* =========================
   CREATE ORDER
   EXPORTER ACCEPTS INQUIRY
========================= */

router.post(

  '/',

  authMiddleware,

  roleMiddleware('exporter'),

  createOrder

);

/* =========================
   GET IMPORTER ORDERS
========================= */

router.get(

  '/importer/:id',

  authMiddleware,

  roleMiddleware('importer'),

  getImporterOrders

);

/* =========================
   GET EXPORTER ORDERS
========================= */

router.get(

  '/exporter/:id',

  authMiddleware,

  roleMiddleware('exporter'),

  getExporterOrders

);

router.get(

  '/pending-shipments',

  authMiddleware,

  getPendingShipmentOrders

);

/* =========================
   GET SINGLE ORDER
========================= */

router.get(

  '/:id',

  authMiddleware,

  getSingleOrder

);

/* =========================
   UPDATE ORDER STATUS
   ADMIN OR EXPORTER
========================= */

router.put(

  '/:id',

  authMiddleware,

  roleMiddleware('admin', 'exporter'),

  updateOrderStatus

);

export default router;