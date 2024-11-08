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
    this.customerContactNo = mobileNo.toString().trim();
    this.customerAddress = address.trim();
    this.lastPurchaseDate = lastPurchaseDate.trim();
    this.totalCreditAmount = parseFloat(totalCreditAmount).toFixed(2);
    this.__v = __v;
  }
}

module.exports = Customer;
