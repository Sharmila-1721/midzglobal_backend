import express from 'express';

import {

  sendInquiry,
  getExporterInquiries

} from '../controllers/inquiryController.js';

import authMiddleware
from '../middleware/authMiddleware.js';

import roleMiddleware
from '../middleware/roleMiddleware.js';

const router = express.Router();

/* =========================
   SEND INQUIRY
   ONLY IMPORTERS
========================= */

router.post(

  '/',

  authMiddleware,

  roleMiddleware('importer'),

  sendInquiry

);

/* =========================
   GET EXPORTER INQUIRIES
   ONLY EXPORTERS
========================= */

router.get(

  '/exporter/:id',

  authMiddleware,

  roleMiddleware('exporter'),

  getExporterInquiries

);

export default router;