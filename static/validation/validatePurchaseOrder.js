const Joi = require("joi");
const { modeOfPayment } = require("../../static");

const validateReqBody = (
  invoiceNumber,
  supplierId,
  dateOfPruchase,
  totalAmount,
  discount,
  sgst,
  cgst,
  paidAmount,
  modeOfPayment,
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
    dateOfPruchase: Joi.string().required(),
    totalAmount: Joi.number().required(),
    discount: Joi.number(),
    sgst: Joi.number(),
    cgst: Joi.number(),
    paidAmount: Joi.number().required(),
    modeOfPayment: Joi.string().required(),
    cerditAmount: Joi.number().required(),
    dueDate: Joi.string().required(),
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
    modeOfPayment,
    cerditAmount,
    dueDate,
    addLessAmount,
    crDrNote,
    grandTotalAmount,
    __v
  ));
};

module.exports = validateReqBody;
