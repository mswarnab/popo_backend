const router = require("express").Router();
const paymentRepository = require("../repository/paymentRepository");
const customerRepository = require("../repository/customerRepository");
const supplierRepository = require("../repository/supplierRepository");
const Payment = require("../static/classes/payment");
const validateReqBody = require("../static/validation/validatePayment");
const ResponseObject = require("../static/classes/ResponseObject");
const ErrorObject = require("../static/classes/errorObject");
const { httpCodes, paymentPartner: PP } = require("../static");
const dayjs = require("dayjs");

router.get("/", async (req, res) => {
  try {
    const {
      sortByDate,
      sortByAmount,
      filterByStartingAmount,
      filterByEndingAmount,
      filterByStartDate,
      filterByEndDate,
      filterByCustomerSupplier,
      page,
    } = req.query;

    let sortObject = {};
    let filterObject = {};

    if (sortByDate) {
      if (sortByDate == "ASC") {
        sortObject.paymentDate = 1;
      } else if (sortByDate == "DESC") {
        sortObject.paymentDate = -1;
      }
    } else {
      sortObject.paymentDate = -1; // Default sorting by date in descending order
    }

    if (sortByAmount) {
      if (sortByAmount == "ASC") {
        sortObject.paidAmount = 1;
      } else if (sortByAmount == "DESC") {
        sortObject.paidAmount = -1;
      }
    }

    if (filterByStartingAmount) {
      filterObject.paidAmount = {
        $gte: filterByStartingAmount,
        $lte: filterByEndingAmount,
      };
    }

    if (filterByStartDate) {
      filterObject.paymentDate = {
        $gte: filterByStartDate,
        $lte: filterByEndDate,
      };
    }

    if (filterByCustomerSupplier) {
      filterObject.id = filterByCustomerSupplier;
    }

    const { count, result, error } = await paymentRepository.getAllPayment(
      sortObject,
      filterObject,
      page
    );
    if (!count) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "PA012",
            "Payment not found.",
            "payment",
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
          "Payment fetched successfully.",
          "payment",
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
          "PA011",
          "Something went wrong - " + error.message,
          "payment",
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
    const { count, error, result } = await paymentRepository.getSinglePayment(
      id
    );
    if (!count) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "PA010",
            "Payment not found.",
            "payment",
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
          "Payment fetched successfully.",
          "payment",
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
          "PA009",
          "Something went wrong - " + error.message,
          "payment",
          req.url,
          req.method,
          error
        )
      );
  }
});

router.post("/", async (req, res) => {
  try {
    const { paymentPartner, id, paymentDate, title, paidAmount, paymentMode } =
      req.body;

    const payment = new Payment(
      paymentPartner,
      id,
      paymentDate,
      title,
      paidAmount,
      paymentMode,
      dayjs().format("YYYYMMDD"),
      0
    );

    // Validate request body
    const { error } = validateReqBody(payment);

    // If there is error in request body, then it will throw BAD request
    if (error) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "PA001",
            "Provided details are not valid - " + error.message,
            "payment",
            req.url,
            req.method,
            null
          )
        );
    }
    payment.paymentDate = dayjs(paymentDate).format("YYYYMMDD");
    let paymentObject = undefined;
    if (paymentPartner == PP[0]) {
      const {
        count,
        result: customer,
        error,
        errorStatus,
      } = await customerRepository.getSingleCustomer(id);
      if (!count) {
        return res
          .status(httpCodes.BAD_REQUEST)
          .send(
            new ErrorObject(
              httpCodes.BAD_REQUEST,
              "PA007",
              "Customer does not exist - " + id,
              "payment",
              req.url,
              req.method,
              id
            )
          );
      }
      customer.totalCreditAmount = parseFloat(
        customer.totalCreditAmount - parseFloat(paidAmount)
      ).toFixed(2);
      const customerObject = await customerRepository.updateCustomer(
        id,
        customer
      );

      if (customerObject) {
        paymentObject = await paymentRepository.createPayment(payment);
      } else throw Error("Customer update is unsuccessful" + customer);
    }

    if (paymentPartner == PP[1]) {
      const {
        count,
        result: supplier,
        error,
        errorStatus,
      } = await supplierRepository.getSingleSupplier(id);
      if (!count) {
        return res
          .status(httpCodes.BAD_REQUEST)
          .send(
            new ErrorObject(
              httpCodes.BAD_REQUEST,
              "PA007",
              "Supplier does not exist - " + id,
              "payment",
              req.url,
              req.method,
              id
            )
          );
      }
      supplier.totalCreditAmount = parseFloat(
        supplier.totalCreditAmount - paidAmount
      ).toFixed(2);
      const supplierObject = await supplierRepository.updateSupplier(
        id,
        supplier
      );
      if (supplierObject) {
        paymentObject = await paymentRepository.createPayment(payment);
      } else throw Error("Supplier update is unsuccessful" + supplier);
    }

    // Successful response
    return res
      .status(httpCodes.OK)
      .send(
        new ResponseObject(
          httpCodes.OK,
          req.method,
          "Payment created successfully.",
          "payment",
          req.url,
          { count: 1, result: paymentObject }
        )
      );
  } catch (error) {
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "PA003",
          "Something went wrong - " + error.message,
          "payment",
          req.url,
          req.method,
          error.message
        )
      );
  }
});

router.delete("/:paymentId", async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { result } = await paymentRepository.getSinglePayment(paymentId);
    if (!result) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "PA055",
            "Payment does not exit",
            "payment",
            req.url,
            req.method,
            null
          )
        );
    }

    const { paymentPartner, id } = result;

    if (paymentPartner == PP[0]) {
      const { count, result: customer } =
        await customerRepository.getSingleCustomer(id);
      if (!count) {
        return res
          .status(httpCodes.BAD_REQUEST)
          .send(
            new ErrorObject(
              httpCodes.BAD_REQUEST,
              "PA059",
              "Customer not found.",
              "payment",
              req.url,
              req.method,
              id
            )
          );
      }
      customer.totalCreditAmount = parseFloat(
        customer.totalCreditAmount + result.paidAmount
      ).toFixed(2);
      const customerUpdated = await customerRepository.updateCustomer(
        id,
        customer
      );
      if (!customerUpdated) {
        return res
          .status(httpCodes.BAD_REQUEST)
          .send(
            new ErrorObject(
              httpCodes.BAD_REQUEST,
              "PA060",
              "Customer update failed.",
              "payment",
              req.url,
              req.method,
              result
            )
          );
      }
    }

    if (paymentPartner == PP[1]) {
      const { count, result: supplier } =
        await supplierRepository.getSingleSupplier(id);
      if (!count) {
        return res
          .status(httpCodes.BAD_REQUEST)
          .send(
            new ErrorObject(
              httpCodes.BAD_REQUEST,
              "PA061",
              "Supplier not found.",
              "payment",
              req.url,
              req.method,
              id
            )
          );
      }
      supplier.totalCreditAmount = parseFloat(
        supplier.totalCreditAmount + result.paidAmount
      ).toFixed(2);
      const supplierUpdated = await supplierRepository.updateSupplier(
        id,
        supplier
      );
      if (!supplierUpdated) {
        return res
          .status(httpCodes.BAD_REQUEST)
          .send(
            new ErrorObject(
              httpCodes.BAD_REQUEST,
              "PA062",
              "Supplier could not be updated.",
              "payment",
              req.url,
              req.method,
              result
            )
          );
      }
    }

    const deletedPayment = await paymentRepository.deletePayment(paymentId);
    if (!deletedPayment) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .send(
          new ErrorObject(
            httpCodes.INTERNAL_SERVER_ERROR,
            "PA063",
            "Something Went Wrong.",
            "payment",
            req.url,
            req.method,
            deletedPayment
          )
        );
    }

    //Successful response
    return res
      .status(httpCodes.OK)
      .send(
        new ResponseObject(
          httpCodes.OK,
          req.method,
          "Payment deleted successfully.",
          "payment",
          req.url,
          { count: 1, deletedPayment }
        )
      );
  } catch (error) {
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "PA057",
          "Something Went Wrong.",
          "payment",
          req.url,
          req.method,
          error.message
        )
      );
  }
});

module.exports = router;
