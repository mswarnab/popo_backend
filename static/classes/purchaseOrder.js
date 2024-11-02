class PurchaseOrder {
  constructor(
    invoiceNumber,
    supplierId,
    suppplierName,
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
    this.invoiceNumber = invoiceNumber.trim();
    this.supplierId = supplierId.trim();
    this.suppplierName = suppplierName.trim();
    this.dateOfPruchase = dateOfPruchase.trim();
    this.totalAmount = totalAmount.toString().trim();
    this.discount = discount.trim();
    this.sgst = sgst.toString().trim();
    this.cgst = cgst.toString().trim();
    this.paidAmount = paidAmount.toString().trim();
    this.modeOfPayment = modeOfPayment.toString().toUpperCase().trim();
    this.cerditAmount = cerditAmount.toString().trim();
    this.dueDate = dueDate.trim();
    this.addLessAmount = addLessAmount.trim();
    this.crDrNote = crDrNote.trim();
    this.grandTotalAmount = grandTotalAmount.toString().trim();
    this.__v = __v;
  }
}

module.exports = PurchaseOrder;
