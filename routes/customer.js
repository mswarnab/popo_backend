const router = require("express").Router();
const customerRepository = require("../repository/customerRepository");
const Customer = require("../static/classes/customer");
const validateReqBody = require("../static/validation/validateCustomer");
const ResponseObject = require("../static/classes/ResponseObject");
const ErrorObject = require("../static/classes/errorObject");
const saleRepository = require("../repository/saleRepository");

const { httpCodes } = require("../static");
const dayjs = require("dayjs");

router.get("/monthlybill/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;

    const customerData = await customerRepository.getSingleCustomer(customerId);
    if (customerData.errorStatus) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .send(
          new ErrorObject(
            httpCodes.INTERNAL_SERVER_ERROR,
            "CU0711",
            "Something went wrong.",
            "customer",
            req.url,
            req.method,
            customerId
          )
        );
    }

    if (!customerData.result) {
      return res
        .status(httpCodes.UNAUTHORIZED)
        .send(
          new ErrorObject(
            httpCodes.UNAUTHORIZED,
            "CU0655",
            "You are not authorized to view this page.",
            "customer",
            req.url,
            req.method,
            null
          )
        );
    }

    let monthStartDate = "00000000";

    const monthEndDate = dayjs().format("YYYYMMDD");

    if (monthEndDate <= 15) {
      monthStartDate = dayjs()
        .subtract(1, "month")
        .startOf("month")
        .format("YYYYMMDD");
    } else {
      monthStartDate = dayjs().startOf("month").format("YYYYMMDD");
    }
    // console.log(monthStartDate, monthEndDate);
    let tempInv = "";
    const temp = customerData.result.customerName.split(" ");
    if (temp.length) {
      if (temp.length > 1) {
        tempInv =
          temp[0].substring(0, 2).toUpperCase() +
          temp[1].substring(0, 2).toUpperCase();
      } else {
        tempInv = temp[0].substring(0, 4).toUpperCase();
      }
    }

    const invoiceNumber = "TPS/" + monthEndDate.substring(0, 6) + "/" + tempInv;

    const saleDetails = await saleRepository.getCustomerMonthlyBills(
      customerId,
      monthStartDate,
      monthEndDate
    );

    // console.log(currentDate, monthStartingDate, saleDetails);
    if (saleDetails.errorStatus) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .send(
          new ErrorObject(
            httpCodes.INTERNAL_SERVER_ERROR,
            "CU071",
            "Something went wrong.",
            "customer",
            req.url,
            req.method,
            saleDetails.error?.message
          )
        );
    }

    if (!saleDetails.count) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "CU065",
            "No sale bills found for this customer.",
            "customer",
            req.url,
            req.method,
            customerData.result
          )
        );
    }
    return res.status(httpCodes.OK).send(
      new ResponseObject(
        httpCodes.OK,
        req.method,
        "Monthly bill is generated for the customer.",
        "customer",
        req.url,
        {
          saleDetails,
          invoiceNumber: invoiceNumber,
          customerDetails: customerData.result,
        }
      )
    );
  } catch (error) {
    // console.log(error);
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "CU072",
          "Something went wrong.",
          "customer",
          req.url,
          req.method,
          error.message
        )
      );
  }
});

router.get("/totaldue", async (req, res) => {
  try {
    const { count, error, result, errorStatus } =
      await customerRepository.getTotalCreditAmount();

    if (errorStatus) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .send(
          new ErrorObject(
            httpCodes.INTERNAL_SERVER_ERROR,
            "CU088",
            "Something went wrong.",
            "customer",
            req.url,
            req.method,
            error
          )
        );
    }

    return res
      .status(httpCodes.OK)
      .send(
        new ResponseObject(
          httpCodes.OK,
          req.method,
          "Customer details fetched successfully.",
          "customer",
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
          "CU077",
          "Something went wrong.",
          "customer",
          req.url,
          req.method,
          error
        )
      );
  }
});

router.get("/mobile/:mobileNo", async (req, res) => {
  try {
    const { mobileNo } = req.params;
    const { count, error, result } =
      await customerRepository.getSingleCustomerByMobileNo(mobileNo);
    if (!count) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "CU008",
            "Customer not found.",
            "customer",
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
          "Customer fetched successfully.",
          "customer",
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
          "CU007",
          "Something went wrong - " + error.message,
          "customer",
          req.url,
          req.method,
          error
        )
      );
  }
});

router.get("/search", async (req, res) => {
  try {
    const { pattern } = req.query;

    let customerResult;
    if (isNaN(pattern)) {
      customerResult = await customerRepository.getSearchResult(pattern);
    } else {
      customerResult = await customerRepository.getSearchResultByMobile(
        pattern
      );
    }

    const { count, result } = customerResult;

    if (!count) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "CU018",
            "Customer not found.",
            "customer",
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
          "Customer fetched successfully.",
          "customer",
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
          "CU017",
          "Something went wrong - " + error.message,
          "customer",
          req.url,
          req.method,
          error
        )
      );
  }
});

router.get("/findcustomerwithname", async (req, res) => {
  try {
    const { pattern } = req.query;
    const { count, error, result } =
      await customerRepository.getCustomersOnRegex(pattern);

    if (!count) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "CU016",
            "Customer not found.",
            "customer",
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
          "Customer fetched successfully.",
          "customer",
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
          "CU015",
          "Something went wrong - " + error.message,
          "customer",
          req.url,
          req.method,
          error
        )
      );
  }
});

router.get("/creditamount", async (req, res) => {
  try {
    const { page } = req.params;
    const { count, error, result } =
      await customerRepository.getCustomersHavingCredit(page);

    if (!count) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "CU014",
            "Customer not found.",
            "customer",
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
          "Customer fetched successfully.",
          "customer",
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
          "CU013",
          "Something went wrong - " + error.message,
          "customer",
          req.url,
          req.method,
          error
        )
      );
  }
});

router.get("/", async (req, res) => {
  try {
    const { sortByCreditAmount, filterByCustomer, filterByCreditAmount, page } =
      req.query;

    let sortObject = {};
    let filterObject = {};

    if (sortByCreditAmount) {
      if (sortByCreditAmount == "ASC") {
        sortObject.totalCreditAmount = 1;
      } else if (sortByCreditAmount == "DESC") {
        sortObject.totalCreditAmount = -1;
      }
    }

    const regexNumber = /^\d+$/;

    if (filterByCustomer && regexNumber.test(filterByCustomer)) {
      filterObject.customerContactNo = {
        $regex: filterByCustomer,
        $options: "i",
      };
    } else if (filterByCustomer) {
      filterObject.customerName = {
        $regex: filterByCustomer,
        $options: "i",
      };
    }

    if (filterByCreditAmount) {
      filterObject.totalCreditAmount = { $gt: 0 };
    }
    // if (filterByPhoneNumber) {
    //   filterObject.customerContactNo = {
    //     $regex: filterByPhoneNumber,
    //     $options: "i",
    //   };
    // }

    const { count, result, error } = await customerRepository.getAllCustomer(
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
            "CU012",
            "Customer not found.",
            "customer",
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
          "Customer fetched successfully.",
          "customer",
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
          "CU011",
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
    const { count, error, result } = await customerRepository.getSingleCustomer(
      id
    );
    if (!count) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "CU010",
            "Customer not found.",
            "customer",
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
          "Customer fetched successfully.",
          "customer",
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
          "CU009",
          "Something went wrong - " + error.message,
          "customer",
          req.url,
          req.method,
          error
        )
      );
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      customerContactNo,
      customerAddress,
      lastPurchaseDate,
    } = req.body;

    const customer = new Customer(
      customerName,
      customerContactNo,
      customerAddress || "dummy",
      lastPurchaseDate || "dummy",
      0,
      0
    );

    // Validate request body
    const { error } = validateReqBody(customer);

    // If there is error in request body, then it will throw BAD request
    if (error) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "CU001",
            "Provided details are not valid - " + error.message,
            "customer",
            req.url,
            req.method,
            null
          )
        );
    }

    const customerOnMobileNo =
      await customerRepository.getSingleCustomerByMobileNo(customerContactNo);

    if (customerOnMobileNo.result.length) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "CU002",
            "Another customer with this mobile number already exists - ",
            "customer",
            req.url,
            req.method,
            null
          )
        );
    }

    //otherwise purchase order Repository is invoked.
    const customerObject = await customerRepository.createCustomer(customer);

    // Successful response
    return res
      .status(httpCodes.OK)
      .send(
        new ResponseObject(
          httpCodes.OK,
          req.method,
          "Customer created successfully.",
          "customer",
          req.url,
          { count: 1, result: customerObject }
        )
      );
  } catch (error) {
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "CU003",
          "Something went wrong - " + error.message,
          "customer",
          req.url,
          req.method,
          error
        )
      );
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customerName,
      customerContactNo,
      customerAddress,
      lastPurchaseDate,
      totalCreditAmount,
      __v,
    } = req.body;

    const customer = new Customer(
      customerName,
      customerContactNo,
      customerAddress,
      lastPurchaseDate,
      totalCreditAmount,
      __v
    );

    // Validate request body
    const { error, value, warning } = validateReqBody(customer);

    // If there is error in request body, then it will throw BAD request
    if (error) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "CU005",
            "Provided details are not valid - " + error.message,
            "customer",
            req.url,
            req.method,
            null
          )
        );
    }

    const existingCustomer = await customerRepository.getSingleCustomer(id);

    if (!existingCustomer) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "CU067",
            "Customer does not exist",
            "customer",
            req.url,
            req.method,
            null
          )
        );
    }

    if (existingCustomer.customerContactNo != customerContactNo) {
      const customerBasedOnContractNo =
        await customerRepository.getSingleCustomerByMobileNo(customerContactNo);

      if (customerBasedOnContractNo.result[1]) {
        return res
          .status(httpCodes.BAD_REQUEST)
          .send(
            new ErrorObject(
              httpCodes.BAD_REQUEST,
              "CU097",
              "Another Customer with this mobile number already exists - " +
                customerContactNo,
              "customer",
              req.url,
              req.method,
              null
            )
          );
      }
    }
    customer.__v += 1;

    //otherwise purchase order Repository is invoked.
    const customerObject = await customerRepository.updateCustomer(
      id,
      customer
    );

    //Successful response
    return res
      .status(httpCodes.OK)
      .send(
        new ResponseObject(
          httpCodes.OK,
          req.method,
          "Customer updated successfully.",
          "customer",
          req.url,
          { count: 1, result: customerObject }
        )
      );
  } catch (error) {
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "CU004",
          "Something went wrong - " + error.message,
          "customer",
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
    const { result } = await customerRepository.getSingleCustomer(id);
    if (!result) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "CU055",
            "Customer does not exit",
            "customer",
            req.url,
            req.method,
            null
          )
        );
    }

    const { result: result2 } = await saleRepository.getSaleBasedOnCustomerId(
      0,
      id
    );

    if (result2.length) {
      return res
        .status(httpCodes.FORBIDDEN)
        .send(
          new ErrorObject(
            httpCodes.FORBIDDEN,
            "CU056",
            "METHOD NOT ALLOWED.",
            "customer",
            req.url,
            req.method,
            result2
          )
        );
    }

    const deletedCustomer = await customerRepository.deleteCustomer(id);

    //Successful response
    return res
      .status(httpCodes.OK)
      .send(
        new ResponseObject(
          httpCodes.OK,
          req.method,
          "Customer deleted successfully.",
          "customer",
          req.url,
          { count: 1, result2 }
        )
      );
  } catch (error) {
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "CU057",
          "Something Went Wrong.",
          "customer",
          req.url,
          req.method,
          error.message
        )
      );
  }
});

module.exports = router;
