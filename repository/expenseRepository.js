const Expense = require("./schema/expense");

const createExpense = async (expenseObject) => {
  try {
    const expense = new Expense(expenseObject);
    return await expense.save();
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const updateExpense = async (id, expenseObject) => {
  try {
    return await Expense.findByIdAndUpdate(id, expenseObject);
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getSingleExpense = async (id) => {
  try {
    const result = await Expense.findById(id);
    return { count: result ? 1 : 0, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getAllExpense = async (sortObject, filterObject) => {
  try {
    const count = await Expense.find(filterObject).countDocuments();

    const result = await Expense.find(filterObject).sort({
      ...sortObject,
      expenseDate: -1,
    });
    return { count, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const deleteExpense = async (id) => {
  try {
    return await Expense.findByIdAndDelete(id);
  } catch (error) {
    return { errorStatus: true, error };
  }
};

module.exports = {
  getAllExpense,
  getSingleExpense,
  createExpense,
  updateExpense,
  deleteExpense,
};
