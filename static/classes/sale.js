const validateReqBody = require("../validation/validateSale");

class Sale {
  constructor(
    billNumber,
    customerId,
    customerMobileNo,
    dateOfSale,
    products,
    totalAmount,
    cgst,
    sgst,
    discountedAmount,
    paidAmount,
    cerditAmount,
    dueDate,
    grandTotalAmount,
    __v
  ) {
    this.billNumber = billNumber.trim();
    this.customerId = customerId.trim();
    this.customerMobileNo = customerMobileNo.trim();
    this.dateOfSale = dateOfSale.trim();
    this.products = products;
    this.totalAmount = totalAmount.toString().trim();
    (this.cgst = cgst.toString().trim()),
      (this.sgst = sgst.toString().trim()),
      (this.discountedAmount = discountedAmount.toString().trim());
    this.paidAmount = paidAmount.toString().trim();
    this.cerditAmount = cerditAmount.toString().trim();
    this.dueDate = dueDate.trim();
    this.grandTotalAmount = grandTotalAmount.toString().trim();
    this.__v = __v.toString().trim();
  }
}

module.exports = Sale;
