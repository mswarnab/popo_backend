const express = require('express');
const app = express();

const dotenv = require('dotenv').config();

const {customerRouter,purhaseOrderRouter,stockRouter} = require('./routes');
const connectMongo = require('./repository/connection')



// This middleware is used to decode the body data to JSON format, without this req.body will be undefined
app.use(express.json());


app.use('/stock',stockRouter);
app.use('/customer',customerRouter);
app.use('/purchaseorder',purhaseOrderRouter);



app.listen(process.env.PORT || 3000,()=>{
  console.log(`Listening on port ${process.env.PORT}`);
  connectMongo();
})
