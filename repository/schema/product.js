const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: String,
  category: String,
  supplierName: String,
  purchaseOrderId: String,
  invoiceNumner: String,
  dateOfPruchase: String,
  mfgDate: String,
  expDate: String,
  purcahseQuantity: Number,
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
