const router = require("express").Router();
const supplierRepository = require("../repository/supplierRepository");
const purchaseOrderRepository = require("../repository/purchaseOrderRepository");

const Supplier = require("../static/classes/supplier");
const { getCurrentDate } = require("../static/functions/getDate");
const validateReqBody = require("../static/validation/validateSupplier");
const ResponseObject = require("../static/classes/ResponseObject");
const ErrorObject = require("../static/classes/errorObject");

const { httpCodes } = require("../static");

router.get("/totaldue", async (req, res) => {
  try {
    const { count, error, result, errorStatus } =
      await supplierRepository.getTotalCreditAmount();

    if (errorStatus) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .send(
          new ErrorObject(
            httpCodes.INTERNAL_SERVER_ERROR,
            "SU088",
            "Something went wrong.",
            "supplier",
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
          "Supplier details fetched successfully.",
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
          "SU077",
          "Something went wrong.",
          "supplier",
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
          error
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
//           error
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
          error
        )
      );
  }
});

router.get("/", async (req, res) => {
  try {
    const { filterBySupplierName, filterByPhoneNumber, page } = req.query;
    let sortObject = {};
    let filterObject = {};

    if (filterBySupplierName) {
      filterObject.supplierName = {
        $regex: filterBySupplierName,
        $options: "i",
      };
    }

    if (filterByPhoneNumber) {
      filterObject.supplierContactNo = filterByPhoneNumber;
    }

    const { count, error, result } = await supplierRepository.getAllSupplier(
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
          error
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
          error
        )
      );
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      supplierName,
      supplierContactNo,
      supplierEmail,
      supplierAddress,
      gstinNumber,
    } = req.body;
    const supplier = new Supplier(
      supplierName,
      supplierContactNo,
      supplierEmail || "dummy",
      supplierAddress || "Dummy",
      gstinNumber,
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
    const supplierOnMobileNo =
      await supplierRepository.getSingleSupplierByMobileNo(supplierContactNo);

    if (supplierOnMobileNo.result.length) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "SU099",
            "Another supplier with this mobile number already exists - ",
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
          error
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
      gstinNumber,
      lastPurchaseDate,
      totalCreditAmount,
      __v,
    } = req.body;

    const supplier = new Supplier(
      supplierName,
      supplierContactNo,
      supplierEmail,
      supplierAddress,
      gstinNumber,
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

    const existingSupplier = await supplierRepository.getSingleSupplier(id);

    if (!existingSupplier) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "SU067",
            "Supplier Does not exist",
            "supplier",
            req.url,
            req.method,
            null
          )
        );
    }

    if (existingSupplier.supplierContactNo != supplierContactNo) {
      const supplierOnMobileNo =
        await supplierRepository.getSingleSupplierByMobileNo(supplierContactNo);
      if (supplierOnMobileNo.result[1]) {
        return res
          .status(httpCodes.BAD_REQUEST)
          .send(
            new ErrorObject(
              httpCodes.BAD_REQUEST,
              "SU097",
              "Another supplier with this mobile number already exists - " +
                supplierContactNo,
              "supplier",
              req.url,
              req.method,
              null
            )
          );
      }
    }

    supplier.__v = parseInt(supplier.__v) + 1;

    //otherwise purchase order Repository is invoked.
    const supplierObject = await supplierRepository.updateSupplier(
      id,
      supplier
    );

    if (supplierObject?.error) {
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
            supplierObject?.error
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
          error
        )
      );
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { result } = await supplierRepository.getSingleSupplier(id);
    if (!result) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "SU055",
            "Supplier does not exit",
            "supplier",
            req.url,
            req.method,
            null
          )
        );
    }

    const { result: result2 } =
      await purchaseOrderRepository.getAllPurchaseOrder(
        "00000000",
        "99999999",
        {},
        { supplierId: id }
      );

    if (result2.length) {
      return res
        .status(httpCodes.FORBIDDEN)
        .send(
          new ErrorObject(
            httpCodes.FORBIDDEN,
            "SU056",
            "METHOD NOT ALLOWED.",
            "supplier",
            req.url,
            req.method,
            result2
          )
        );
    }

    const deletedSupplier = await supplierRepository.deleteSupplier(id);

    //Successful response
    return res
      .status(httpCodes.OK)
      .send(
        new ResponseObject(
          httpCodes.OK,
          req.method,
          "Supplier deleted successfully.",
          "supplier",
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
          "SU057",
          "Something Went Wrong.",
          "supplier",
          req.url,
          req.method,
          error.message
        )
      );
  }
});

module.exports = router;
