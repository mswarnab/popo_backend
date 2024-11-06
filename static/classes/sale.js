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
    this.totalAmount = parseFloat(totalAmount).toFixed(2).toString().trim();
    this.cgst = parseFloat(cgst).toFixed(2).toString().trim();
    this.sgst = parseFloat(sgst).toFixed(2).toString().trim();
    this.discountedAmount = parseFloat(discountedAmount)
      .toFixed(2)
      .toString()
      .trim();
    this.paidAmount = parseFloat(paidAmount).toFixed(2).toString().trim();
    this.cerditAmount = parseFloat(cerditAmount).toFixed(2).toString().trim();
    this.dueDate = dueDate.toString().trim();
    this.grandTotalAmount = parseFloat(grandTotalAmount)
      .toFixed(2)
      .toString()
      .trim();
    this.totalProfit = parseFloat(totalProfit).toFixed(2).toString().trim();
    this.__v = __v.toString().trim();
  }
}

module.exports = Sale;
