const Joi = require('joi');

const validateReqBody = (
    orderNumber,
    supplierId,
    dateOfPruchase,
    products,
    totalAmount,
    paidAmount,
    cerditAmount,
    dueDate,
    __v 
)=>{
    const schema = Joi.object({
        orderNumber:Joi.string().required(),
        supplierId:Joi.string().required(),
        dateOfPruchase: Joi.date().required(),
        products:Joi.array().required(),
        totalAmount:Joi.number().required(),
        paidAmount:Joi.number().required(),
        cerditAmount:Joi.number().required(),
        dueDate:Joi.date().required(),
        __v: Joi.number().required()
    })

    return {error,value,warning} = schema.validate(
        orderNumber,
        supplierId,
        dateOfPruchase,
        products,
        totalAmount,
        paidAmount,
        cerditAmount,
        dueDate,
        __v 
    )
}

module.exports=validateReqBody;