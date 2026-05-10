import express from 'express';

import {

  sendInquiry,
  getExporterInquiries,
  getImporterInquiries,
  respondToInquiry,
  getSingleInquiry

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

/* =========================
   GET IMPORTER INQUIRIES
   ONLY IMPORTERS
========================= */

router.get(

  '/importer/:id',

  authMiddleware,

  roleMiddleware('importer'),

  getImporterInquiries

);

/* =========================
   RESPOND TO INQUIRY
   ONLY EXPORTERS
========================= */

router.put(

  '/:id',

  authMiddleware,

  roleMiddleware('exporter'),

  respondToInquiry

);

/* =========================
   GET SINGLE INQUIRY
========================= */

router.get(

  '/:id',

  authMiddleware,

  getSingleInquiry

);

export default router;