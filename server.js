import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config(
  {
    path: './.env'
  }
);

console.log(
  'EMAIL USER:',
  process.env.EMAIL_USER
);

console.log(
  'EMAIL PASS:',
  process.env.EMAIL_PASS
);

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import shipmentRoutes from './routes/shipmentRoutes.js';





const app = express();



const server = http.createServer(app);


const io = new Server(server, {

  cors: {

    origin: 'http://localhost:5173',

    methods: ['GET', 'POST', 'PUT', 'DELETE']

  }

});

export { io };



io.on('connection', (socket) => {

  console.log(
    `User Connected: ${socket.id}`
  );

  socket.on('disconnect', () => {

    console.log(
      `User Disconnected: ${socket.id}`
    );

  });

});



app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));



app.use('/api/auth', authRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/products', productRoutes);

app.use('/api/inquiries', inquiryRoutes);

app.use('/api/orders', orderRoutes);

app.use('/api/shipments', shipmentRoutes);



app.get('/', (req, res) => {

  res.send(
    'MidzGlobal Backend Running Successfully'
  );

});



mongoose.connect(
  process.env.MONGO_URI
)

.then(() => {

  console.log(
    'MongoDB Connected Successfully'
  );



  server.listen(
    process.env.PORT || 5000,
    () => {

      console.log(

        `Server Running on Port ${process.env.PORT || 5000}`

      );

    }
  );

})

.catch((error) => {

  console.log(

    'MongoDB Connection Error:',
    error.message

  );

});