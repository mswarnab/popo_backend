const Joi = require('joi');

const validateReqBody = (
    billNumber,
    customerId,
    dateOfSale,
    products,
    totalAmount,
    paidAmount,
    cerditAmount,
    dueDate,
    __V

)=>{
    const schema = Joi.object({
        billNumber:Joi.string().required(),
        customerId:Joi.string().required(),
        dateOfSale:Joi.date().required(),
        products:Joi.array().required(),
        totalAmount:Joi.string().required(),
        cerditAmount:Joi.number().required(),
        dueDate:Joi.date().required(),
        __v:Joi.number().required()
    })

    return {error,value,warning} = schema.validate(
        billNumber,
        customerId,
        dateOfSale,
        products,
        totalAmount,
        paidAmount,
        cerditAmount,
        dueDate,
        __V
    )
}

module.exports=validateReqBody;