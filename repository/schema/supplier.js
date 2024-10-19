const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  supplierName: String,
  supplierContactNo: Number,
  supplierEmail: String,
  supplierAddress: String,
  lastPurchaseDate: String,
  totalCreditAmount: Number,
});

module.exports = mongoose.model("Supplier", supplierSchema);
