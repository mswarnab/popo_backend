const express = require('express');
const router = express.Router();
const {validateId,validateName,validateAge} = require('../methods/validation');

router.get('/',(req,res)=>{

    res.status(200).send({id:1001,name:"Swarnab",age:28});
})

router.get('/:id',(req,res)=>{
    const id= req.params.id;
    if(validateId(id)){
       return res.status(404).send({error:"id",message:"id is not a number"});
    }
    res.status(200).send({id,name:"Swarnab",age:28});
})

router.get('/:id/:name/:age',(req,res)=>{
    const {id,name,age}= req.params; 
    const p = new Promise((resolve,reject)=>{
        if(req.params.age > 18 ){
            resolve({id,name,age})
        }
        else reject(new Error("age is not valid"));
    });
    p
    .then((result)=>console.log(result))
    .catch((err)=> console.log(err));
    if(validateId(id) || validateName(name) || validateAge(age)){
        return res.status(404).send({error:"error occcurred",massage:"parameters provided is invalid"});
    }

    res.status(200).send({id,name,age});
})

router.post('/',(req,res)=>{
    console.log(req.body);
    res.send(req.body);    
})

module.exports=router;