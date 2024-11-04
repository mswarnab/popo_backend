class Customer {
  constructor(
    customerName,
    mobileNo,
    address,
    lastPurchaseDate,
    totalCreditAmount,
    __v
  ) {
    this.customerName = customerName.trim();
    this.customerContactNo = parseFloat(mobileNo.trim());
    this.customerAddress = address.trim();
    (this.lastPurchaseDate = lastPurchaseDate.trim()),
      (this.totalCreditAmount = totalCreditAmount.toString().trim());
    this.__v = __v;
  }
}

module.exports = Customer;
