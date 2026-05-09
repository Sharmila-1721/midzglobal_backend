const roleMiddleware = (...roles) => {

  return (req, res, next) => {

    try {

      /* =========================
         CHECK USER EXISTENCE
      ========================= */

      if (!req.user) {

        return res.status(401).json({

          message:
          'Unauthorized Access'

        });

      }

      /* =========================
         CHECK ROLE PERMISSION
      ========================= */

      if (

        !roles.includes(
          req.user.role
        )

      ) {

        return res.status(403).json({

          message:
          'Access Denied'

        });

      }

      /* =========================
         ACCESS GRANTED
      ========================= */

      next();

    } catch (error) {

      res.status(500).json({

        message:
        error.message

      });

    }

  };

};

export default roleMiddleware;