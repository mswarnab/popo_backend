const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  paymentPartner: String,
  id: String,
  paymentDate: String,
  title: String,
  paidAmount: Number,
  paymentMode: String,
  updateTimestamp: String,
});

module.exports = mongoose.model("Payment", paymentSchema);
