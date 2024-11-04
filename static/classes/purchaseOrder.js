class PurchaseOrder {
  constructor(
    invoiceNumber,
    supplierId,
    supplierName,
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
  ) {
    this.invoiceNumber = invoiceNumber.toString().trim();
    this.supplierId = supplierId.toString().trim();
    this.supplierName = supplierName.toString().trim();
    this.dateOfPruchase = dateOfPruchase.toString().trim();
    this.totalAmount = totalAmount.toString().trim();
    this.discount = discount.trim();
    this.sgst = sgst.toString().trim();
    this.cgst = cgst.toString().trim();
    this.paidAmount = paidAmount.toString().trim();
    this.modeOfPayment = modeOfPayment.toString().toUpperCase().trim();
    this.cerditAmount = cerditAmount.toString().trim();
    this.dueDate = dueDate.toString().trim();
    this.addLessAmount = addLessAmount.toString().trim();
    this.crDrNote = crDrNote.toString().trim();
    this.grandTotalAmount = grandTotalAmount.toString().trim();
    this.__v = __v;
  }
}

module.exports = PurchaseOrder;
