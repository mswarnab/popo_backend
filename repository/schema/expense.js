const mongoose = require("mongoose");

const expeseSchema = new mongoose.Schema({
  expenseName: String,
  expenseAmount: Number,
  expenseDate: String,
  expenseTitle: String,
});

module.exports = mongoose.model("Expense", expeseSchema);
