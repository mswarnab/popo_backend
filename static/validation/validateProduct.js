const Joi = require('joi');
const {productCategory} = require('../../static');
const validateReqBody = (productName,category,supplierName,purchaseOrderId,purchaseDate, mfgDate, expDate, quantity, purchasePrice, mrp, batchNumber,__v)=>{
    const schema = Joi.object({
        productName:Joi.string().min(3).max(100).required(),
        category:Joi.string().valid(...productCategory).required(),
        supplierName: Joi.string().min(3).max(100).required(),
        purchaseOrderId: Joi.string().required(),
        purchaseDate: Joi.date().required(),
        mfgDate: Joi.date().required(),
        expDate:Joi.date().required(),
        quantity: Joi.number().required().min(1),
        purchasePrice: Joi.number().required(),
        mrp: Joi.number().required(),
        batchNumber: Joi.string(),
        __v: Joi.number().required()
    })

    return {error,value,warning} = schema.validate(productName,category,supplierName,purchaseOrderId,purchaseDate, mfgDate, expDate, quantity, purchasePrice, mrp, batchNumber,_v)
}

module.exports=validateReqBody;