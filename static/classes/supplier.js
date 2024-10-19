class Supplier {
  constructor(
    supplierName,
    mobileNo,
    supplierEmail,
    supplierAddress,
    lastPurchaseDate,
    totalCreditAmount,
    __v
  ) {
    this.supplierName = supplierName.trim();
    this.supplierContactNo = mobileNo.toString().trim();
    this.supplierEmail = supplierEmail.trim();
    this.supplierAddress = supplierAddress.trim();
    this.lastPurchaseDate = lastPurchaseDate.trim();
    this.totalCreditAmount = totalCreditAmount.toString().trim();
    this.__v = __v.toString().trim();
  }
}

module.exports = Supplier;
