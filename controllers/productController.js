import Product from '../models/Product.js';

import { io }
from '../server.js';

/* =========================
   ADD PRODUCT
========================= */

export const addProduct =
async (req, res) => {

  try {

    const {

      productName,

      description,

      category,

      subCategory,

      price,

      moq,

      stock,

      country,

      image,

      exporter,

      leadTime,

      productionCapacity

    } = req.body;

    /* =========================
       VALIDATION
    ========================= */

    if (

      !productName ||
      !description ||
      !category ||
      !price ||
      !moq ||
      !stock ||
      !country ||
      !exporter

    ) {

      return res.status(400).json({

        message:
        'Please Fill All Required Fields'

      });

    }

    /* =========================
       CREATE PRODUCT
    ========================= */

    const product =
      await Product.create({

        productName,

        description,

        category,

        subCategory,

        price,

        moq,

        stock,

        country,

        image,

        exporter,

        leadTime,

        productionCapacity

      });

    /* =========================
       REAL-TIME EVENT
    ========================= */

    io.emit(

      'new-product',

      {

        message:

        `${product.productName} added successfully`

      }

    );

    /* =========================
       RESPONSE
    ========================= */

    res.status(201).json({

      message:
      'Product Added Successfully',

      product

    });

  } catch (error) {

    res.status(500).json({

      message:
      error.message

    });

  }

};

/* =========================
   GET ALL PRODUCTS
========================= */

export const getProducts =
async (req, res) => {

  try {

    const products =
      await Product.find()

      .populate(

        'exporter',

        'name companyName country'

      )

      .sort({

        createdAt: -1

      });

    res.json(products);

  } catch (error) {

    res.status(500).json({

      message:
      error.message

    });

  }

};

/* =========================
   GET SINGLE PRODUCT
========================= */

export const getSingleProduct =
async (req, res) => {

  try {

    const product =
      await Product.findById(
        req.params.id
      )

      .populate(

        'exporter',

        'name companyName country email phone'

      );

    if (!product) {

      return res.status(404).json({

        message:
        'Product Not Found'

      });

    }

    res.json(product);

  } catch (error) {

    res.status(500).json({

      message:
      error.message

    });

  }

};

/* =========================
   UPDATE PRODUCT
========================= */

export const updateProduct =
async (req, res) => {

  try {

    const updatedProduct =
      await Product.findByIdAndUpdate(

        req.params.id,

        req.body,

        { new: true }

      );

    if (!updatedProduct) {

      return res.status(404).json({

        message:
        'Product Not Found'

      });

    }

    io.emit(

      'product-updated',

      {

        message:

        `${updatedProduct.productName} updated`

      }

    );

    res.json({

      message:
      'Product Updated Successfully',

      updatedProduct

    });

  } catch (error) {

    res.status(500).json({

      message:
      error.message

    });

  }

};

/* =========================
   DELETE PRODUCT
========================= */

export const deleteProduct =
async (req, res) => {

  try {

    const deletedProduct =
      await Product.findByIdAndDelete(
        req.params.id
      );

    if (!deletedProduct) {

      return res.status(404).json({

        message:
        'Product Not Found'

      });

    }

    io.emit(

      'product-deleted',

      {

        message:

        `${deletedProduct.productName} deleted`

      }

    );

    res.json({

      message:
      'Product Deleted Successfully'

    });

  } catch (error) {

    res.status(500).json({

      message:
      error.message

    });

  }

};