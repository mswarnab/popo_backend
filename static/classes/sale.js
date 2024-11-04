const validateReqBody = require("../validation/validateSale");

class Sale {
  constructor(
    billNumber,
    customerId,
    customerMobileNo,
    customerName,
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
    totalProfit,
    __v
  ) {
    this.billNumber = billNumber.toString().trim();
    this.customerId = customerId.toString().trim();
    this.customerMobileNo = customerMobileNo.toString().trim();
    this.customerName = customerName.toString().trim();
    this.dateOfSale = dateOfSale.toString().trim();
    this.products = products;
    this.totalAmount = totalAmount.toString().trim();
    this.cgst = cgst.toString().trim();
    this.sgst = sgst.toString().trim();
    this.discountedAmount = discountedAmount.toString().trim();
    this.paidAmount = paidAmount.toString().trim();
    this.cerditAmount = cerditAmount.toString().trim();
    this.dueDate = dueDate.toString().trim();
    this.grandTotalAmount = grandTotalAmount.toString().trim();
    this.totalProfit = totalProfit.trim();
    this.__v = __v.toString().trim();
  }
}

module.exports = Sale;
