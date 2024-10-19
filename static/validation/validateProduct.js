const Joi = require("joi");
const { productCategory } = require("../../static");
const validateReqBody = (
  productName,
  category,
  supplierName,
  purchaseOrderId,
  invoiceNumber,
  dateOfPruchase,
  mfgDate,
  expDate,
  purchaseQuantity,
  quantity,
  rate,
  sgst,
  cgst,
  mrp,
  batchNumber,
  discount,
  __v
) => {
  const schema = Joi.object({
    productName: Joi.string().min(3).max(100).required(),
    category: Joi.string()
      .valid(...productCategory)
      .required(),
    supplierName: Joi.string().min(3).max(100).required(),
    purchaseOrderId: Joi.string().required(),
    invoiceNumber: Joi.string().required(),
    dateOfPruchase: Joi.date().required(),
    mfgDate: Joi.date().required(),
    expDate: Joi.date().required(),
    purchaseQuantity: Joi.number().required().min(1),
    quantity: Joi.number().required().min(1),
    mrp: Joi.number().required(),
    batchNumber: Joi.string(),
    rate: Joi.number().required(),
    sgst: Joi.number().required(),
    cgst: Joi.number().required(),
    discount: Joi.number().required(),
    __v: Joi.number(),
  });

  return ({ error, value, warning } = schema.validate(
    productName,
    category,
    supplierName,
    purchaseOrderId,
    invoiceNumber,
    dateOfPruchase,
    mfgDate,
    expDate,
    purchaseQuantity,
    quantity,
    rate,
    sgst,
    cgst,
    mrp,
    batchNumber,
    discount,
    __v
  ));
};

module.exports = validateReqBody;
