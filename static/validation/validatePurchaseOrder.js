const Joi = require("joi");

const validateReqBody = (
  invoiceNumber,
  supplierId,
  dateOfPruchase,
  totalAmount,
  discount,
  sgst,
  cgst,
  paidAmount,
  cerditAmount,
  dueDate,
  addLessAmount,
  crDrNote,
  grandTotalAmount,
  __v
) => {
  const schema = Joi.object({
    invoiceNumber: Joi.string().required(),
    supplierId: Joi.string().required(),
    dateOfPruchase: Joi.date().required(),
    totalAmount: Joi.number().required(),
    discount: Joi.number(),
    sgst: Joi.number(),
    cgst: Joi.number(),
    paidAmount: Joi.number().required(),
    cerditAmount: Joi.number().required(),
    dueDate: Joi.date().required(),
    grandTotalAmount: Joi.number().required(),
    addLessAmount: Joi.string(),
    crDrNote: Joi.string(),
    __v: Joi.number().required(),
  });

  return ({ error, value, warning } = schema.validate(
    invoiceNumber,
    supplierId,
    dateOfPruchase,
    totalAmount,
    discount,
    sgst,
    cgst,
    paidAmount,
    cerditAmount,
    dueDate,
    addLessAmount,
    crDrNote,
    grandTotalAmount,
    __v
  ));
};

module.exports = validateReqBody;
