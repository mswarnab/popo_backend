const Joi = require("joi");

const validateReqBody = (
  supplierName,
  supplierContactNo,
  supplierEmail,
  supplierAddress,
  lastPurchaseDate,
  totalCreditAmount,
  __v
) => {
  const schema = Joi.object({
    supplierName: Joi.string().required(),
    supplierContactNo: Joi.string().required().min(10).max(10),
    supplierEmail: Joi.string().required(),
    supplierAddress: Joi.string().required(),
    lastPurchaseDate: Joi.date().required(),
    totalCreditAmount: Joi.number().required(),
    __v: Joi.number().required(),
  });

  return ({ error, value, warning } = schema.validate(
    supplierName,
    supplierContactNo,
    supplierEmail,
    supplierAddress,
    lastPurchaseDate,
    totalCreditAmount,
    __v
  ));
};

module.exports = validateReqBody;
