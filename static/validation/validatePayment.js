const Joi = require("joi");
const { modeOfPayment, paymentPartner: PP } = require("..");

const validateReqBody = (
  paymentPartner,
  id,
  paymentDate,
  title,
  paidAmount,
  paymentMode,
  updateTimestamp,
  __v
) => {
  const schema = Joi.object({
    paymentPartner: Joi.string()
      .valid(...PP)
      .required(),
    id: Joi.string().required(),
    title: Joi.string(),
    paidAmount: Joi.number().required(),
    paymentMode: Joi.string()
      .valid(...modeOfPayment)
      .required(),
    updateTimestamp: Joi.string().required(),
    __v: Joi.number(),
  });

  return ({ error, value, warning } = schema.validate(
    paymentPartner,
    id,
    paymentDate,
    title,
    paidAmount,
    paymentMode,
    updateTimestamp,
    __v
  ));
};

module.exports = validateReqBody;
