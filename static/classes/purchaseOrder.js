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
    this.discount = parseFloat(discount).toFixed(2).trim();
    this.sgst = sgst.toString().trim();
    this.cgst = cgst.toString().trim();
    this.paidAmount = parseFloat(paidAmount).toFixed(2).toString().trim();
    this.modeOfPayment = modeOfPayment.toString().toUpperCase().trim();
    this.cerditAmount = parseFloat(cerditAmount).toFixed(2).toString().trim();
    this.dueDate = dueDate.toString().trim();
    this.addLessAmount = addLessAmount.toString().trim();
    this.crDrNote = crDrNote.toString().trim();
    this.grandTotalAmount = parseFloat(grandTotalAmount)
      .toFixed(2)
      .toString()
      .trim();
    this.__v = __v;
  }
}

module.exports = PurchaseOrder;
