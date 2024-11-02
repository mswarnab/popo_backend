const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  billNumber: { type: String, required: true },
  customerId: { type: String, required: true },
  customerMobileNo: { type: String, required: true },
  dateOfSale: { type: String, required: true },
  products: [
    {
      productId: String,
      quantity: Number,
      sellingPrice: Number,
      discountedAmount: Number,
    },
  ],
  totalAmount: { type: Number, required: true },
  cgst: Number,
  sgst: Number,
  discountedAmount: { type: Number, required: true },
  paidAmount: { type: Number, required: true },
  cerditAmount: { type: Number, default: 0 },
  dueDate: { type: String, default: "99999999" },
  grandTotalAmount: { type: Number, required: true },
  totalProfit: Number,
});

module.exports = mongoose.model("Sale", saleSchema);
