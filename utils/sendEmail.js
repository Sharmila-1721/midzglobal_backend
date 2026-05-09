import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({

  path: './.env'

});

/* =========================
   SEND EMAIL FUNCTION
========================= */

const sendEmail = async (

  to,
  subject,
  html

) => {

  try {

    console.log(

      'EMAIL USER:',
      process.env.EMAIL_USER

    );

    console.log(

      'EMAIL PASS:',
      process.env.EMAIL_PASS

    );

    /* =========================
       CREATE TRANSPORTER
    ========================= */

    const transporter =
      nodemailer.createTransport({

        service: 'gmail',

        auth: {

          user:
          process.env.EMAIL_USER,

          pass:
          process.env.EMAIL_PASS

        }

      });

    /* =========================
       SEND MAIL
    ========================= */

    const info =
      await transporter.sendMail({

        from:
        `MidzGlobal <${process.env.EMAIL_USER}>`,

        to,

        subject,

        html

      });

    console.log(

      'Email Sent Successfully:',

      info.response

    );

  } catch (error) {

    console.log(

      'Email Sending Error:',

      error.message

    );

  }

};

export default sendEmail;