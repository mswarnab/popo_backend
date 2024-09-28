const Joi = require('joi');

const validateReqBody = (
    customerName,
    customerContactNo,
    customerAddress,
    lastPurchaseDate,
    totalCreditAmount,
    __v, 
)=>{
    const schema = Joi.object({
        customerName:Joi.string().required(),
        customerContactNo:Joi.string().required().min(10).max(10),
        customerAddress:Joi.string().required(),
        lastPurchaseDate:Joi.date().required(),
        totalCreditAmount:Joi.number().required,
        __v:Joi.number().required()
    })

    return {error,value,warning} = schema.validate(
        customerName,
        customerContactNo,
        customerAddress,
        lastPurchaseDate,
        totalCreditAmount,
        __v 
    )
}

module.exports=validateReqBody;