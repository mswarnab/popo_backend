const app = require('./appExpress');

const dotenv = require('dotenv').config();

const {customerRouter,purhaseOrderRouter,stockRouter} = require('./routes');
const connectMongo = require('./repository/connection')

// app.on('demo',(result)=>{
//   console.log('result in event'+result)
// })





app.use('/stock',stockRouter);
app.use('/customer',customerRouter);
app.use('/purchaseorder',purhaseOrderRouter);



app.listen(process.env.PORT || 3000,()=>{
  console.log(`Listening on port ${process.env.PORT}`);
  connectMongo();
  app.emit('demo',{name:"swarnab"})
})
