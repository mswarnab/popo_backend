const router = require("express").Router();
const supplierRepository = require("../repository/supplierRepository");
const Supplier = require("../static/classes/supplier");
const getCurrentDate = require("../static/functions/getCurrentDate");
const validateReqBody = require("../static/validation/validateSupplier");
const ResponseObject = require("../static/classes/ResponseObject");
const ErrorObject = require("../static/classes/errorObject");

const { httpCodes } = require("../static");

router.get("/search", async (req, res) => {
  try {
    const { pattern } = req.query;
    console.log(pattern);
    const { count, error, result } = await supplierRepository.getSearchResult(
      pattern
    );

    if (!count) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "SU014",
            "Supplier not found.",
            "supplier",
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
          "Supplier fetched successfully.",
          "supplier",
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
          "SU015",
          "Something went wrong - " + error.message,
          "supplier",
          req.url,
          req.method,
          null
        )
      );
  }
});

// router.get("/findsupplierwithname", async (req, res) => {
//   try {
//     const { pattern } = req.query;
//     const { count, error, result } =
//       await supplierRepository.getSuppliersOnRegex(pattern);

//     if (!count) {
//       return res
//         .status(httpCodes.NOT_FOUND)
//         .send(
//           new ErrorObject(
//             httpCodes.NOT_FOUND,
//             "SU012",
//             "Supplier not found.",
//             "supplier",
//             req.url,
//             req.method,
//             null
//           )
//         );
//     }

//     return res
//       .status(httpCodes.OK)
//       .send(
//         new ResponseObject(
//           httpCodes.OK,
//           req.method,
//           "Supplier fetched successfully.",
//           "supplier",
//           req.url,
//           { count, result }
//         )
//       );
//   } catch (error) {
//     return res
//       .status(httpCodes.INTERNAL_SERVER_ERROR)
//       .send(
//         new ErrorObject(
//           httpCodes.INTERNAL_SERVER_ERROR,
//           "SU013",
//           "Something went wrong - " + error.message,
//           "supplier",
//           req.url,
//           req.method,
//           null
//         )
//       );
//   }
// });

router.get("/creditamount", async (req, res) => {
  try {
    const { count, error, result } =
      await supplierRepository.getSuppliersHavingCredit();

    if (!count) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "SU010",
            "Supplier not found.",
            "supplier",
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
          "Supplier fetched successfully.",
          "supplier",
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
          "SU011",
          "Something went wrong - " + error.message,
          "supplier",
          req.url,
          req.method,
          null
        )
      );
  }
});

router.get("/", async (req, res) => {
  try {
    const { page } = req.params;
    const { count, error, result } = await supplierRepository.getAllSupplier(
      page
    );
    if (!count) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "SU009",
            "Supplier not found.",
            "supplier",
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
          "Supplier fetched successfully.",
          "supplier",
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
          "SU008",
          "Something went wrong - " + error.message,
          "supplier",
          req.url,
          req.method,
          null
        )
      );
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { count, result } = await supplierRepository.getSingleSupplier(id);
    if (!count) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "SU006",
            "Supplier not found.",
            "supplier",
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
          "Supplier fetched successfully.",
          "supplier",
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
          "SU007",
          "Something went wrong - " + error.message,
          "supplier",
          req.url,
          req.method,
          null
        )
      );
  }
});

router.post("/", async (req, res) => {
  try {
    const { supplierName, supplierContactNo, supplierEmail, supplierAddress } =
      req.body;

    const supplier = new Supplier(
      supplierName,
      supplierContactNo,
      supplierEmail || "dummy",
      supplierAddress || "Dummy",
      getCurrentDate,
      0,
      0
    );

    // Validate request body
    const { error, value, warning } = validateReqBody(supplier);

    // If there is error in request body, then it will throw BAD request
    if (error) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "SU001",
            "Provided details are not valid - " + error.message,
            "supplier",
            req.url,
            req.method,
            null
          )
        );
    }

    //otherwise purchase order Repository is invoked.
    const supplierObject = await supplierRepository.createSupplier(supplier);

    // Successful response
    return res
      .status(httpCodes.OK)
      .send(
        new ResponseObject(
          httpCodes.OK,
          req.method,
          "Supplier created successfully.",
          "supplier",
          req.url,
          { count: 1, result: supplierObject }
        )
      );
  } catch (error) {
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "SU002",
          "Something went wrong - " + error.message,
          "supplier",
          req.url,
          req.method,
          null
        )
      );
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      supplierName,
      supplierContactNo,
      supplierEmail,
      supplierAddress,
      lastPurchaseDate,
      totalCreditAmount,
      __v,
    } = req.body;

    const supplier = new Supplier(
      supplierName,
      supplierContactNo,
      supplierEmail,
      supplierAddress,
      lastPurchaseDate,
      totalCreditAmount,
      __v
    );

    // Validate request body
    const { error, value, warning } = validateReqBody(supplier);

    // If there is error in request body, then it will throw BAD request
    if (error) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "SU003",
            "Provided details are not valid - " + error.message,
            "supplier",
            req.url,
            req.method,
            null
          )
        );
    }

    supplier.__v += 1;

    //otherwise purchase order Repository is invoked.
    const supplierObject = await supplierRepository.updateSupplier(
      id,
      supplier
    );

    if (supplierObject.error) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "SU016",
            "Provided details are not valid - " + supplierObject.error.message,
            "supplier",
            req.url,
            req.method,
            null
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
          "Supplier updated successfully.",
          "supplier",
          req.url,
          { count: 1, result: supplierObject }
        )
      );
  } catch (error) {
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "SU004",
          "Something went wrong - " + error.message,
          "supplier",
          req.url,
          req.method,
          null
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
        "SU005",
        "METHOD NOT ALLOWED.",
        "supplier",
        req.url,
        req.method,
        null
      )
    );
});

module.exports = router;
