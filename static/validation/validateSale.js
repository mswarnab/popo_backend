const Joi = require("joi");

const validateReqBody = (
  billNumber,
  customerId,
  customerMobileNo,
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
  __v
) => {
  const schema = Joi.object({
    billNumber: Joi.string().required(),
    customerId: Joi.string().required(),
    customerMobileNo: Joi.string().required(),
    dateOfSale: Joi.date().required(),
    products: Joi.array().required(),
    totalAmount: Joi.number().required(),
    cerditAmount: Joi.number().required(),
    cgst: Joi.number().required(),
    sgst: Joi.number().required(),
    paidAmount: Joi.number().required(),
    discountedAmount: Joi.number().required(),
    grandTotalAmount: Joi.number().required(),
    dueDate: Joi.string().required(),
    __v: Joi.number().required(),
  });

  return ({ error, value, warning } = schema.validate(
    billNumber,
    customerId,
    customerMobileNo,
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
    __v
  ));
};

module.exports = validateReqBody;
