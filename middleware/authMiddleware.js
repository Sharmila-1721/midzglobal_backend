import jwt from 'jsonwebtoken';

const authMiddleware = (

  req,
  res,
  next

) => {

  try {

    /* =========================
       GET AUTH HEADER
    ========================= */

    const authHeader =
      req.headers.authorization;

    /* =========================
       CHECK HEADER
    ========================= */

    if (!authHeader) {

      return res.status(401).json({

        message:
        'No Token Provided'

      });

    }

    /* =========================
       EXTRACT TOKEN
    ========================= */

    const token =
      authHeader.startsWith('Bearer ')

      ? authHeader.split(' ')[1]

      : authHeader;

    /* =========================
       VERIFY TOKEN
    ========================= */

    const decoded =
      jwt.verify(

        token,

        process.env.JWT_SECRET

      );

    /* =========================
       STORE USER
    ========================= */

    req.user = decoded;

    next();

  } catch (error) {

    res.status(401).json({

      message:
      'Invalid Token'

    });

  }

};

export default authMiddleware;