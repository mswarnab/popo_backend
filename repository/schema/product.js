const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: String,
  category: String,
  supplierId: String,
  supplierName: String,
  purchaseOrderId: String,
  mfrCode: String,
  hsnCode: String,
  invoiceNumber: String,
  dateOfPruchase: String,
  mfgDate: String,
  expDate: String,
  purchaseQuantity: Number,
  quantity: Number,
  rate: Number,
  sgst: Number,
  cgst: Number,
  discount: Number,
  purchasePrice: Number,
  mrp: Number,
  batchNumber: String,
});

module.exports = mongoose.model("Product", productSchema);
