const router = require("express").Router();
const customerRepository = require("../repository/customerRepository");
const Customer = require("../static/classes/customer");
const validateReqBody = require("../static/validation/validateCustomer");
const ResponseObject = require("../static/classes/ResponseObject");
const ErrorObject = require("../static/classes/errorObject");

const { httpCodes } = require("../static");

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
    const { page } = req.query;
    const { count, result, error } = await customerRepository.getAllCustomer(
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
  return res
    .status(httpCodes.FORBIDDEN)
    .send(
      new ErrorObject(
        httpCodes.FORBIDDEN,
        "CU006",
        "METHOD NOT ALLOWED.",
        "customer",
        req.url,
        req.method,
        null
      )
    );
});

module.exports = router;
