const mongoose = require("mongoose");

const purchaseOrdertSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true },
  supplierId: String,
  dateOfPruchase: String,
  totalAmount: Number,
  discount: Number,
  sgst: String,
  cgst: String,
  paidAmount: Number,
  modeOfPayment: String,
  cerditAmount: Number,
  dueDate: String,
  addLessAmount: String,
  crDrNote: String,
  grandTotalAmount: Number,
});

module.exports = mongoose.model("PurchaseOrder", purchaseOrdertSchema);
