const router = require("express").Router();
const expenseRepository = require("../repository/expenseRepository");
// const Customer = require("../static/classes/customer");
const validateReqBody = require("../static/validation/validateExpense");
const ResponseObject = require("../static/classes/ResponseObject");
const ErrorObject = require("../static/classes/errorObject");
// const saleRepository = require("../repository/saleRepository");

const { httpCodes } = require("../static");
const dayjs = require("dayjs");
const Expense = require("../static/classes/expense");

router.get("/", async (req, res) => {
  try {
    const { sortByExpenseDate, filterByStartDate, filterByEndDate, page } =
      req.query;

    let sortObject = {};
    let filterObject = {};

    let startDate = "00000000";
    let endDate = "99999999";

    if (filterByStartDate) {
      startDate = filterByStartDate;
    }
    if (filterByEndDate) {
      endDate = filterByEndDate;
    }

    filterObject.expenseDate = { $gt: startDate, $lt: endDate };
    // if (filterByPhoneNumber) {
    //   filterObject.customerContactNo = {
    //     $regex: filterByPhoneNumber,
    //     $options: "i",
    //   };
    // }

    const { count, result, error } = await expenseRepository.getAllExpense(
      sortObject,
      filterObject
    );
    if (!count) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "EX001",
            "Expense not found.",
            "expense",
            req.url,
            req.method,
            null
          )
        );
    }

    return res
      .status(httpCodes.OK)
      .send(
        new ResponseObject(
          httpCodes.OK,
          req.method,
          "Expense/s fetched successfully.",
          "expense",
          req.url,
          { count, result }
        )
      );
  } catch (error) {
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "EX002",
          "Something went wrong - " + error.message,
          "customer",
          req.url,
          req.method,
          error
        )
      );
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { count, error, result } = await expenseRepository.getSingleExpense(
      id
    );
    if (!count) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "EX003",
            "Expense not found.",
            "expense",
            req.url,
            req.method,
            null
          )
        );
    }
    return res
      .status(httpCodes.OK)
      .send(
        new ResponseObject(
          httpCodes.OK,
          req.method,
          "Expense fetched successfully.",
          "expense",
          req.url,
          { count, result }
        )
      );
  } catch (error) {
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "EX004",
          "Something went wrong - " + error.message,
          "expense",
          req.url,
          req.method,
          error
        )
      );
  }
});

router.post("/", async (req, res) => {
  try {
    const { expenseName, expenseAmount, expenseDate, expenseTitle } = req.body;

    const expense = new Expense(
      expenseName,
      expenseAmount,
      expenseDate,
      expenseTitle,
      0
    );

    // Validate request body
    const { error } = validateReqBody(expense);

    // If there is error in request body, then it will throw BAD request
    if (error) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "EX005",
            "Provided details are not valid - " + error.message,
            "expense",
            req.url,
            req.method,
            null
          )
        );
    }

    //otherwise purchase order Repository is invoked.
    const expenseObject = await expenseRepository.createExpense(expense);

    // Successful response
    return res
      .status(httpCodes.OK)
      .send(
        new ResponseObject(
          httpCodes.OK,
          req.method,
          "Expense created successfully.",
          "expense",
          req.url,
          { count: 1, result: expenseObject }
        )
      );
  } catch (error) {
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "EX006",
          "Something went wrong - " + error.message,
          "expense",
          req.url,
          req.method,
          error
        )
      );
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { result } = await expenseRepository.getSingleExpense(id);
    if (!result) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "EX007",
            "Expense does not exit",
            "expense",
            req.url,
            req.method,
            null
          )
        );
    }

    const deletedExpense = await expenseRepository.deleteExpense(id);

    return res
      .status(httpCodes.OK)
      .send(
        new ResponseObject(
          httpCodes.OK,
          req.method,
          "Expense deleted successfully.",
          "expense",
          req.url,
          { count: 1, deletedExpense }
        )
      );
  } catch (error) {
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "EX008",
          "Something Went Wrong.",
          "expense",
          req.url,
          req.method,
          error.message
        )
      );
  }
});

module.exports = router;
