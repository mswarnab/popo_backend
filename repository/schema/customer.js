const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  customerName: String,
  customerContactNo: String,
  customerAddress: String,
  lastPurchaseDate: String,
  totalCreditAmount: Number,
});

module.exports = mongoose.model("Customer", customerSchema);
