import express from 'express';

import {

  createOrder,
  getImporterOrders,
  getExporterOrders,
  getPendingShipmentOrders

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

export default router;