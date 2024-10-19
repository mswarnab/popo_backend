module.exports = class Product {
  constructor(
    productName,
    category,
    supplierName,
    purchaseOrderId,
    invoiceNumber,
    dateOfPruchase,
    mfgDate,
    expDate,
    purchaseQuantity,
    quantity,
    rate,
    sgst,
    cgst,
    mrp,
    batchNumber,
    discount,
    __v
  ) {
    this.productName = productName.trim();
    this.category = category.trim();
    this.supplierName = supplierName.trim();
    this.purchaseOrderId = purchaseOrderId;
    this.invoiceNumber = invoiceNumber.trim();
    this.dateOfPruchase = dateOfPruchase.trim();
    this.mfgDate = mfgDate.trim();
    this.expDate = expDate.trim();
    this.purchaseQuantity = parseInt(purchaseQuantity);
    this.quantity = parseInt(quantity);
    this.rate = rate.trim();
    this.sgst = sgst.trim();
    this.cgst = cgst.trim();
    // this.purchasePrice = parseInt(rate) * 1 + (parseInt(sgst) +parseInt(cgst)) ;
    this.discount = parseInt(discount);
    this.mrp = parseInt(mrp);
    this.batchNumber = batchNumber.trim();
    this.__v = __v;
  }
};
