const express = require('express');
const app = express();


const dataRouter = require('./routes/data');
const stockRouter = require('./routes/stock');

const connectMongo = require('./repository/connection')

connectMongo();

// This middleware is used to decode the body data to JSON format, without this req.body will be undefined
app.use(express.json());

app.get('/',(req,res)=>{
  console.log(req);
  res.status(404).send({id:1,name:"Pintu"});
})

app.use('/data',dataRouter);
app.use('/managestock',stockRouter);


app.listen(3000,()=>{
  console.log(`Listening on port ${3000}`);

})

// const getUser = (id)=>{
//   return new Promise((resolve,rejeect)=>{
//     setTimeout(()=>{
//       if(id == 5) rejeect(new Error("Invalid number"));
//       resolve(id)
//     },5000)
//   })
// }
// console.log("before")
// // getUser(2)
// // .then((result)=> console.log(result))
// // .then(()=> console.log("after"));
// // console.log("after")

// const func1 = async ()=>{
//   try {
//     const p = await getUser(6);
//     console.log(p);
//     console.log("after");
//   } catch (error) {
//     console.log(error);
//   } 
// }

// func1();
// console.log("after 2")
