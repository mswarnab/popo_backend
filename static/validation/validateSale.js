const Joi = require("joi");

const validateReqBody = (
  billNumber,
  customerId,
  customerMobileNo,
  customerName,
  dateOfSale,
  products,
  totalAmount,
  cgst,
  sgst,
  discountedAmount,
  paidAmount,
  cerditAmount,
  dueDate,
  grandTotalAmount,
  totalProfit,
  __v
) => {
  const schema = Joi.object({
    billNumber: Joi.string().required(),
    customerId: Joi.string().required(),
    customerMobileNo: Joi.string().required(),
    customerName: Joi.string().required(),
    dateOfSale: Joi.string().required(),
    products: Joi.array().required(),
    totalAmount: Joi.number().required(),
    cerditAmount: Joi.number().required(),
    cgst: Joi.number().required(),
    sgst: Joi.number().required(),
    paidAmount: Joi.number().required(),
    discountedAmount: Joi.number().required(),
    grandTotalAmount: Joi.number().required(),
    dueDate: Joi.string().required(),
    totalProfit: Joi.number().required(),
    __v: Joi.number().required(),
  });

  return ({ error, value, warning } = schema.validate(
    billNumber,
    customerId,
    customerMobileNo,
    customerName,
    dateOfSale,
    products,
    totalAmount,
    cgst,
    sgst,
    discountedAmount,
    paidAmount,
    cerditAmount,
    dueDate,
    grandTotalAmount,
    totalProfit,
    __v
  ));
};

module.exports = validateReqBody;
