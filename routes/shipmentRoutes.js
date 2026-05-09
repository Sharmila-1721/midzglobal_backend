import express from 'express';

import {

  createShipment,
  updateShipmentStatus,
  getShipments

} from '../controllers/shipmentController.js';

import authMiddleware
from '../middleware/authMiddleware.js';

import roleMiddleware
from '../middleware/roleMiddleware.js';

const router = express.Router();


router.post(

  '/',

  authMiddleware,

  roleMiddleware('logistics'),

  createShipment

);


router.put(

  '/:id',

  authMiddleware,

  roleMiddleware('logistics'),

  updateShipmentStatus

);


router.get(

  '/',

  authMiddleware,

  getShipments

);

export default router;