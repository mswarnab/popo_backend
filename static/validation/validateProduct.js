const Joi = require("joi");
const { productCategory } = require("../../static");
const validateReqBody = (
  productName,
  category,
  supplierId,
  supplierName,
  purchaseOrderId,
  mfrCode,
  hsnCode,
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
  purchasePrice,
  discount,
  schemeDiscount,
  __v
) => {
  const schema = Joi.object({
    productName: Joi.string().min(3).max(100).required(),
    category: Joi.string()
      .valid(...productCategory)
      .required(),
    supplierId: Joi.string().required(),
    supplierName: Joi.string().min(3).max(100).required(),
    purchaseOrderId: Joi.string().required(),
    mfrCode: Joi.string().required(),
    hsnCode: Joi.string().required(),
    invoiceNumber: Joi.string().required(),
    dateOfPruchase: Joi.string().required(),
    mfgDate: Joi.string().required(),
    expDate: Joi.string().required(),
    purchaseQuantity: Joi.number().required().min(1),
    quantity: Joi.number().required().min(1),
    mrp: Joi.number().required(),
    batchNumber: Joi.string(),
    rate: Joi.number().required(),
    sgst: Joi.number().required(),
    cgst: Joi.number().required(),
    purchasePrice: Joi.number().required(),
    discount: Joi.number().required(),
    schemeDiscount: Joi.number().required(),
    __v: Joi.number(),
  });

  return ({ error, value, warning } = schema.validate(
    productName,
    category,
    supplierId,
    supplierName,
    purchaseOrderId,
    mfrCode,
    hsnCode,
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
    purchasePrice,
    discount,
    schemeDiscount,
    __v
  ));
};

module.exports = validateReqBody;
