import Order from '../models/Order.js';

import Inquiry from '../models/Inquiry.js';

import Product from '../models/Product.js';

import sendEmail
from '../utils/sendEmail.js';

import { io }
from '../server.js';

/* =========================
   CREATE ORDER
========================= */

export const createOrder =
async (req, res) => {

  try {

    const { inquiryId } = req.body;

    /* =========================
       FIND INQUIRY
    ========================= */

    const inquiry =
      await Inquiry.findById(
        inquiryId
      )

      .populate('product')

      .populate('importer')

      .populate('exporter');

    if (!inquiry) {

      return res.status(404).json({

        message:
        'Inquiry Not Found'

      });

    }

    /* =========================
       CHECK EXISTING ORDER
    ========================= */

    const existingOrder =
      await Order.findOne({

        inquiry: inquiry._id

      });

    if (existingOrder) {

      return res.status(400).json({

        message:
        'Order Already Exists'

      });

    }

    /* =========================
       CALCULATE TOTAL
    ========================= */

    const totalAmount =

      inquiry.quantity *

      inquiry.product.price;

    /* =========================
       CREATE ORDER
    ========================= */

    const order =
      await Order.create({

        importer:
        inquiry.importer._id,

        exporter:
        inquiry.exporter._id,

        product:
        inquiry.product._id,

        inquiry:
        inquiry._id,

        quantity:
        inquiry.quantity,

        totalAmount,

        paymentStatus:
        'pending',

        status:
        'confirmed'

      });

    /* =========================
       UPDATE INQUIRY STATUS
    ========================= */

    inquiry.status = 'accepted';

    await inquiry.save();

    /* =========================
       EMAIL TO IMPORTER
    ========================= */

    await sendEmail(

      inquiry.importer.email,

      'Order Created Successfully',

      `

      <h2>
        Order Confirmed
      </h2>

      <p>
        Product:
        ${inquiry.product.productName}
      </p>

      <p>
        Quantity:
        ${inquiry.quantity}
      </p>

      <p>
        Total Amount:
        ₹${totalAmount}
      </p>

      `

    );

    /* =========================
       REAL-TIME EVENT
    ========================= */

    io.emit(

      'new-order',

      {

        message:

        `New order created for ${inquiry.product.productName}`

      }

    );

    /* =========================
       RESPONSE
    ========================= */

    res.status(201).json({

      message:
      'Order Created Successfully',

      order

    });

  } catch (error) {

    res.status(500).json({

      message:
      error.message

    });

  }

};

/* =========================
   GET IMPORTER ORDERS
========================= */

export const getImporterOrders =
async (req, res) => {

  try {

    const orders =
      await Order.find({

        importer:
        req.params.id

      })

      .populate('product')

      .populate(

        'exporter',

        'name companyName email'

      )

      .sort({

        createdAt: -1

      });

    res.json(orders);

  } catch (error) {

    res.status(500).json({

      message:
      error.message

    });

  }

};

/* =========================
   GET EXPORTER ORDERS
========================= */

export const getExporterOrders =
async (req, res) => {

  try {

    const orders =
      await Order.find({

        exporter:
        req.params.id

      })

      .populate('product')

      .populate(

        'importer',

        'name companyName email'

      )

      .sort({

        createdAt: -1

      });

    res.json(orders);

  } catch (error) {

    res.status(500).json({

      message:
      error.message

    });

  }

};

/* =========================
   UPDATE ORDER STATUS
========================= */

export const updateOrderStatus =
async (req, res) => {

  try {

    const {

      status,
      paymentStatus

    } = req.body;

    const order =
      await Order.findByIdAndUpdate(

        req.params.id,

        {

          status,
          paymentStatus

        },

        { new: true }

      )

      .populate('importer')

      .populate('product');

    if (!order) {

      return res.status(404).json({

        message:
        'Order Not Found'

      });

    }

    /* =========================
       EMAIL UPDATE
    ========================= */

    await sendEmail(

      order.importer.email,

      'Order Status Updated',

      `

      <h2>
        Order Update
      </h2>

      <p>
        Product:
        ${order.product.productName}
      </p>

      <p>
        Order Status:
        ${status}
      </p>

      <p>
        Payment Status:
        ${paymentStatus}
      </p>

      `

    );

    /* =========================
       REAL-TIME EVENT
    ========================= */

    io.emit(

      'order-status-updated',

      {

        message:

        `Order status updated to ${status}`

      }

    );

    res.json({

      message:
      'Order Updated Successfully',

      order

    });

  } catch (error) {

    res.status(500).json({

      message:
      error.message

    });

  }

};

/* =========================
   GET SINGLE ORDER
========================= */

export const getSingleOrder =
async (req, res) => {

  try {

    const order =
      await Order.findById(
        req.params.id
      )

      .populate('product')

      .populate('importer')

      .populate('exporter')

      .populate('inquiry');

    if (!order) {

      return res.status(404).json({

        message:
        'Order Not Found'

      });

    }

    res.json(order);

  } catch (error) {

    res.status(500).json({

      message:
      error.message

    });

  }

};

export const getPendingShipmentOrders =
async (req, res) => {

  try {

    const orders =
      await Order.find({

        status: {

          $in: [

            'confirmed',

            'processing',

            'shipped'

          ]

        }

      })

      .populate('product')

      .populate('importer')

      .populate('exporter');

    res.status(200).json(
      orders
    );

  } catch (error) {

    res.status(500).json({

      message:
      error.message

    });

  }

};