const router = require("express").Router();
const expenseRepository = require("../repository/expenseRepository");
const Customer = require("../static/classes/customer");
const validateReqBody = require("../static/validation/validateExpense");
const ResponseObject = require("../static/classes/ResponseObject");
const ErrorObject = require("../static/classes/errorObject");
const saleRepository = require("../repository/saleRepository");
const purchaseOrderRepository = require("../repository/purchaseOrderRepository");
const paymentRepository = require("../repository/paymentRepository");
const customerRepository = require("../repository/customerRepository");
const supplierRepository = require("../repository/supplierRepository");

const { httpCodes } = require("../static");
const dayjs = require("dayjs");
const Expense = require("../static/classes/expense");

router.get("/", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "RE001",
            "Please provide correct dates in querystring",
            "report",
            req.url,
            req.method,
            startDate,
            endDate
          )
        );
    }

    const formattedStartDate = dayjs(startDate).format("YYYYMMDD");
    const formattedEndDate = dayjs(endDate).format("YYYYMMDD");

    // Get purchase order data

    const purchaseOrderData = await purchaseOrderRepository.getAllPurchaseOrder(
      formattedStartDate,
      formattedEndDate,
      { dateOfPruchase: 1 },
      {},
      "NA"
    );

    if (!purchaseOrderData.count) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "RE002",
            "No purchase order found within following dates - " +
              startDate +
              " and " +
              endDate,
            "report",
            req.url,
            req.method,
            purchaseOrderData
          )
        );
    }

    if (purchaseOrderData.errorStatus) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .send(
          new ErrorObject(
            httpCodes.INTERNAL_SERVER_ERROR,
            "RE003",
            "Something went wrong - " + purchaseOrderData.error,
            "report",
            req.url,
            req.method,
            { startDate, endDate, purchaseOrderData }
          )
        );
    }

    console.log(purchaseOrderData.count);

    // Get Sale data

    console.log(formattedStartDate, formattedEndDate);

    const saleData = await saleRepository.getAllSale(
      "NA",
      { dateOfSale: 1 },
      {
        dateOfSale: {
          $gte: formattedStartDate.toString(),
          $lte: formattedEndDate.toString(),
        },
      }
    );

    if (!saleData.count) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "RE004",
            "No Sale invoice found within following dates - " +
              startDate +
              " and " +
              endDate,
            "report",
            req.url,
            req.method,
            { startDate, endDate }
          )
        );
    }

    if (saleData.errorStatus) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .send(
          new ErrorObject(
            httpCodes.INTERNAL_SERVER_ERROR,
            "RE005",
            "Something went wrong - " + saleData.error,
            "report",
            req.url,
            req.method,
            { startDate, endDate, saleData }
          )
        );
    }

    // Get payment Data
    const paymentData = await paymentRepository.getAllPayment(
      { paymentDate: 1 },
      { paymentDate: { $gte: formattedStartDate, $lte: formattedEndDate } },
      "NA"
    );

    if (!paymentData.count) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "RE006",
            "No Payement entry found within following dates - " +
              startDate +
              " and " +
              endDate,
            "report",
            req.url,
            req.method,
            { startDate, endDate }
          )
        );
    }

    if (paymentData.errorStatus) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .send(
          new ErrorObject(
            httpCodes.INTERNAL_SERVER_ERROR,
            "RE007",
            "Something went wrong - " + paymentData.error,
            "report",
            req.url,
            req.method,
            { startDate, endDate, paymentData }
          )
        );
    }

    // Get Expense Data

    const expenseData = await expenseRepository.getAllExpense(
      { expenseDate: 1 },
      { expenseDate: { $gte: formattedStartDate, $lte: formattedEndDate } }
    );

    if (!expenseData.count) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "RE006",
            "No Expense entry found within following dates - " +
              startDate +
              " and " +
              endDate,
            "report",
            req.url,
            req.method,
            { startDate, endDate }
          )
        );
    }

    if (expenseData.errorStatus) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .send(
          new ErrorObject(
            httpCodes.INTERNAL_SERVER_ERROR,
            "RE007",
            "Something went wrong - " + expenseData.error,
            "report",
            req.url,
            req.method,
            { startDate, endDate, expenseData }
          )
        );
    }
    // Get customer Data
    const customerData = await customerRepository.getTotalCreditAmount();

    if (!customerData.count) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "RE008",
            "No Customer entry found within following dates - " +
              startDate +
              " and " +
              endDate,
            "report",
            req.url,
            req.method,
            { startDate, endDate }
          )
        );
    }

    if (customerData.errorStatus) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .send(
          new ErrorObject(
            httpCodes.INTERNAL_SERVER_ERROR,
            "RE009",
            "Something went wrong - " + customerData.error,
            "report",
            req.url,
            req.method,
            { startDate, endDate, customerData }
          )
        );
    }

    // Get Supplier Data
    const supplierData = await supplierRepository.getTotalCreditAmount();

    if (!supplierData.count) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "RE008",
            "No Supplier entry found within following dates - " +
              startDate +
              " and " +
              endDate,
            "report",
            req.url,
            req.method,
            { startDate, endDate }
          )
        );
    }

    if (supplierData.errorStatus) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .send(
          new ErrorObject(
            httpCodes.INTERNAL_SERVER_ERROR,
            "RE009",
            "Something went wrong - " + supplierData.error,
            "report",
            req.url,
            req.method,
            { startDate, endDate, supplierData }
          )
        );
    }

    //Opening Stock
    //Total Sale history
    //Total Purchase history
    //Total Expense History
    //Total Payement History
    //Total due for Supplier
    //Total due from Customer
    //Closing Stock

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

module.exports = router;
