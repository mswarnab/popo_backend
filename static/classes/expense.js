class Expense {
  constructor(expenseName, expenseAmount, expenseDate, expenseTitle, __v) {
    this.expenseName = expenseName.trim();
    this.expenseAmount = parseFloat(expenseAmount).toFixed(2);
    this.expenseDate = expenseDate.trim();
    this.expenseTitle = expenseTitle.trim();
    this.__v = __v;
  }
}

module.exports = Expense;
