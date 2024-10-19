const Joi = require("joi");

const validateReqBody = (
  customerName,
  customerContactNo,
  customerAddress,
  lastPurchaseDate,
  totalCreditAmount,
  __v
) => {
  const schema = Joi.object({
    customerName: Joi.string(),
    customerContactNo: Joi.string().required().length(10).not("0000000000"),
    customerAddress: Joi.string(),
    lastPurchaseDate: Joi.string().required(),
    totalCreditAmount: Joi.number().required(),
    __v: Joi.number(),
  });

  return ({ error, value, warning } = schema.validate(
    customerName,
    customerContactNo,
    customerAddress,
    lastPurchaseDate,
    totalCreditAmount,
    __v
  ));
};

module.exports = validateReqBody;
