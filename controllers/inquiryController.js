import Inquiry from '../models/Inquiry.js';

import Product from '../models/Product.js';

import User from '../models/User.js';

import sendEmail
from '../utils/sendEmail.js';

import { io }
from '../server.js';

/* =========================
   SEND INQUIRY
========================= */

export const sendInquiry =
async (req, res) => {

  try {

    const {

      importer,

      exporter,

      product,

      message,

      quantity,

      offerPrice

    } = req.body;

    /* =========================
       VALIDATION
    ========================= */

    if (

      !importer ||
      !exporter ||
      !product ||
      !message ||
      !quantity

    ) {

      return res.status(400).json({

        message:
        'Please Fill All Required Fields'

      });

    }

    /* =========================
       CHECK PRODUCT
    ========================= */

    const existingProduct =
      await Product.findById(product);

    if (!existingProduct) {

      return res.status(404).json({

        message:
        'Product Not Found'

      });

    }

    /* =========================
       CREATE INQUIRY
    ========================= */

    const inquiry =
      await Inquiry.create({

        importer,

        exporter,

        product,

        message,

        quantity,

        offerPrice

      });

    /* =========================
       GET IMPORTER DETAILS
    ========================= */

    const importerUser =
      await User.findById(importer);

    /* =========================
       GET EXPORTER DETAILS
    ========================= */

    const exporterUser =
      await User.findById(exporter);

    /* =========================
       SEND EMAIL TO EXPORTER
    ========================= */

    await sendEmail(

      exporterUser.email,

      'New Inquiry Received',

      `

      <h2>
        New Product Inquiry
      </h2>

      <p>
        Product:
        ${existingProduct.productName}
      </p>

      <p>
        Importer:
        ${importerUser.name}
      </p>

      <p>
        Quantity:
        ${quantity}
      </p>

      <p>
        Message:
        ${message}
      </p>

      `

    );

    /* =========================
       REAL-TIME EVENT
    ========================= */

    io.emit(

      'new-inquiry',

      {

        message:

        `New inquiry for ${existingProduct.productName}`

      }

    );

    /* =========================
       RESPONSE
    ========================= */

    res.status(201).json({

      message:
      'Inquiry Sent Successfully',

      inquiry

    });

  } catch (error) {

    res.status(500).json({

      message:
      error.message

    });

  }

};

/* =========================
   GET EXPORTER INQUIRIES
========================= */

export const getExporterInquiries =
async (req, res) => {

  try {

    const inquiries =
      await Inquiry.find({

        exporter:
        req.params.id

      })

      .populate(

        'importer',

        'name email companyName country'

      )

      .populate(

        'product'

      )

      .sort({

        createdAt: -1

      });

    res.json(inquiries);

  } catch (error) {

    res.status(500).json({

      message:
      error.message

    });

  }

};

/* =========================
   GET IMPORTER INQUIRIES
========================= */

export const getImporterInquiries =
async (req, res) => {

  try {

    const inquiries =
      await Inquiry.find({

        importer:
        req.params.id

      })

      .populate(

        'exporter',

        'name email companyName country'

      )

      .populate(

        'product'

      )

      .sort({

        createdAt: -1

      });

    res.json(inquiries);

  } catch (error) {

    res.status(500).json({

      message:
      error.message

    });

  }

};

/* =========================
   RESPOND TO INQUIRY
========================= */

export const respondToInquiry =
async (req, res) => {

  try {

    const {

      exporterResponse,

      status

    } = req.body;

    const inquiry =
      await Inquiry.findByIdAndUpdate(

        req.params.id,

        {

          exporterResponse,

          status,

          respondedAt:
          new Date()

        },

        { new: true }

      )

      .populate('importer')

      .populate('product');

    if (!inquiry) {

      return res.status(404).json({

        message:
        'Inquiry Not Found'

      });

    }

    /* =========================
       SEND EMAIL TO IMPORTER
    ========================= */

    await sendEmail(

      inquiry.importer.email,

      'Inquiry Response Received',

      `

      <h2>
        Inquiry Response
      </h2>

      <p>
        Product:
        ${inquiry.product.productName}
      </p>

      <p>
        Status:
        ${status}
      </p>

      <p>
        Exporter Response:
        ${exporterResponse}
      </p>

      `

    );

    /* =========================
       REAL-TIME EVENT
    ========================= */

    io.emit(

      'inquiry-responded',

      {

        message:

        `Inquiry response received for ${inquiry.product.productName}`

      }

    );

    res.json({

      message:
      'Inquiry Responded Successfully',

      inquiry

    });

  } catch (error) {

    res.status(500).json({

      message:
      error.message

    });

  }

};

/* =========================
   GET SINGLE INQUIRY
========================= */

export const getSingleInquiry =
async (req, res) => {

  try {

    const inquiry =
      await Inquiry.findById(
        req.params.id
      )

      .populate('importer')

      .populate('exporter')

      .populate('product');

    if (!inquiry) {

      return res.status(404).json({

        message:
        'Inquiry Not Found'

      });

    }

    res.json(inquiry);

  } catch (error) {

    res.status(500).json({

      message:
      error.message

    });

  }

};