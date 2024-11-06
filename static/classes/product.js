module.exports = class Product {
  constructor(
    productName,
    category,
    supplierId,
    supplierName,
    purchaseOrderId,
    mfrCode,
    hsnCode,
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
    this.category = category.toString().toUpperCase().trim();
    this.supplierId = supplierId.trim();
    this.supplierName = supplierName.trim();
    this.purchaseOrderId = purchaseOrderId;
    this.mfrCode = mfrCode.trim();
    this.hsnCode = hsnCode.trim();
    this.invoiceNumber = invoiceNumber.trim();
    this.dateOfPruchase = dateOfPruchase.trim();
    this.mfgDate = mfgDate.trim();
    this.expDate = expDate.trim();
    this.purchaseQuantity = parseInt(purchaseQuantity);
    this.quantity = parseInt(quantity);
    this.rate = parseFloat(rate).toFixed(2).toString().trim();
    this.sgst = sgst.toString().trim();
    this.cgst = cgst.toString().trim();
    this.discount = parseFloat(discount).toFixed(2);
    this.mrp = parseFloat(mrp).toFixed(2);
    this.batchNumber = batchNumber.toString().trim();
    this.__v = __v;
  }
};
