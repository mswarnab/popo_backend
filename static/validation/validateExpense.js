const Joi = require("joi");

const validateReqBody = (
  expenseName,
  expenseAmount,
  expenseDate,
  expenseTitle,
  __v
) => {
  const schema = Joi.object({
    expenseName: Joi.string().required(),
    expenseAmount: Joi.number().required(),
    expenseDate: Joi.string().required(),
    expenseTitle: Joi.any(),
    __v: Joi.number(),
  });

  return ({ error, value, warning } = schema.validate(
    expenseName,
    expenseAmount,
    expenseDate,
    expenseTitle,
    __v
  ));
};

module.exports = validateReqBody;
