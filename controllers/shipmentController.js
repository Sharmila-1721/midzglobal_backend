import Shipment from '../models/Shipment.js';

import Order from '../models/Order.js';

import User from '../models/User.js';

import sendEmail
from '../utils/sendEmail.js';

import { io }
from '../server.js';




/* =========================
   CREATE SHIPMENT
========================= */

export const createShipment =
async (req, res) => {

  try {

    const {

      order: orderId,

      logisticsProvider,

      shippingMethod,

      estimatedDelivery,

      shippingCost

    } = req.body;

    /* =========================
       FIND ORDER
    ========================= */

    const order =
      await Order.findById(orderId)

      .populate('importer')

      .populate('product');

    if (!order) {

      return res.status(404).json({

        message:
        'Order Not Found'

      });

    }

    const existingShipment =
      await Shipment.findOne({

        order: req.body.order

      });

    if (existingShipment) {

      return res.status(400).json({

        message:
        'Shipment Already Exists'

      });

    }

    /* =========================
       GENERATE TRACKING ID
    ========================= */

    const trackingId =

      'MIDZ-' +

      Math.floor(
        100000 + Math.random() * 900000
      );



    /* =========================
       CREATE SHIPMENT
    ========================= */

    const shipment =
      await Shipment.create({

        order: orderId,

        logisticsProvider,

        trackingId,

        shippingMethod,

        estimatedDelivery,

        shippingCost

      });

    /* =========================
       UPDATE ORDER STATUS
    ========================= */

    order.status = 'shipped';

    await order.save();

    /* =========================
       SEND EMAIL TO IMPORTER
    ========================= */

    await sendEmail(

      order.importer.email,

      'Shipment Created Successfully',

      `

      <h2>
        Shipment Created
      </h2>

      <p>
        Product:
        ${order.product.productName}
      </p>

      <p>
        Tracking ID:
        ${trackingId}
      </p>

      <p>
        Shipping Method:
        ${shippingMethod}
      </p>

      <p>
        Estimated Delivery:
        ${estimatedDelivery}
      </p>

      `

    );

    /* =========================
       REAL-TIME NOTIFICATION
    ========================= */

    io.emit(

      'shipment-created',

      {

        message:

        `Shipment ${trackingId} created successfully`

      }

    );

    /* =========================
       RESPONSE
    ========================= */

    res.status(201).json({

      message:
      'Shipment Created Successfully',

      shipment

    });

  } catch (error) {

    res.status(500).json({

      message:
      error.message

    });

  }

};

/* =========================
   UPDATE SHIPMENT STATUS
========================= */

export const updateShipmentStatus =
async (req, res) => {

  try {

    const {

      shipmentStatus,

      currentLocation

    } = req.body;

    /* =========================
       UPDATE SHIPMENT
    ========================= */

    const shipment =
      await Shipment.findByIdAndUpdate(

        req.params.id,

        {

          shipmentStatus,

          currentLocation

        },

        { new: true }

      )

      .populate({

        path: 'order',

        populate: {

          path: 'importer'

        }

      });

    if (!shipment) {

      return res.status(404).json({

        message:
        'Shipment Not Found'

      });

    }

    /* =========================
       DELIVERY COMPLETED
    ========================= */

    if (

      shipmentStatus === 'delivered'

    ) {

      shipment.deliveredAt =
        new Date();

      await shipment.save();

      shipment.order.status =
        'delivered';

      await shipment.order.save();

    }

    /* =========================
       EMAIL UPDATE
    ========================= */

    await sendEmail(

      shipment.order.importer.email,

      'Shipment Status Updated',

      `

      <h2>
        Shipment Update
      </h2>

      <p>
        Tracking ID:
        ${shipment.trackingId}
      </p>

      <p>
        New Status:
        ${shipmentStatus}
      </p>

      <p>
        Current Location:
        ${currentLocation}
      </p>

      `

    );

    /* =========================
       REAL-TIME UPDATE
    ========================= */

    io.emit(

      'shipment-status-updated',

      {

        message:

        `Shipment ${shipment.trackingId} updated to ${shipmentStatus}`

      }

    );

    /* =========================
       RESPONSE
    ========================= */

    res.json({

      message:
      'Shipment Updated Successfully',

      shipment

    });

  } catch (error) {

    res.status(500).json({

      message:
      error.message

    });

  }

};

/* =========================
   GET ALL SHIPMENTS
========================= */

export const getShipments =
async (req, res) => {

  try {

    const shipments =
      await Shipment.find()

      .populate({

        path: 'order',

        populate: [

          {

            path: 'product'

          },

          {

            path: 'importer'

          },

          {

            path: 'exporter'

          }

        ]

      })

      .populate(

        'logisticsProvider',

        'name email companyName'

      );

    res.json(shipments);

  } catch (error) {

    res.status(500).json({

      message:
      error.message

    });

  }

};