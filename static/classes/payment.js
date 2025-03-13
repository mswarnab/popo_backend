class Payment {
  constructor(
    paymentPartner,
    id,
    paymentDate,
    title,
    paidAmount,
    paymentMode,
    updateTimestamp,
    __v
  ) {
    this.paymentPartner = paymentPartner;
    this.id = id;
    this.paymentDate = paymentDate;
    this.title = title;
    this.paidAmount = paidAmount;
    this.paymentMode = paymentMode;
    this.updateTimestamp = updateTimestamp;
    this.__v = __v;
  }
}

module.exports = Payment;
