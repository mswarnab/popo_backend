class Supplier {
  constructor(
    supplierName,
    mobileNo,
    supplierEmail,
    supplierAddress,
    gstinNumber,
    lastPurchaseDate,
    totalCreditAmount,
    __v
  ) {
    this.supplierName = supplierName.trim();
    this.supplierContactNo = mobileNo.toString().trim();
    this.supplierEmail = supplierEmail.trim();
    this.supplierAddress = supplierAddress.trim();
    this.gstinNumber = gstinNumber.trim();
    this.lastPurchaseDate = lastPurchaseDate.toString().trim();
    this.totalCreditAmount = totalCreditAmount.toString().trim();
    this.__v = __v.toString().trim();
  }
}

module.exports = Supplier;
