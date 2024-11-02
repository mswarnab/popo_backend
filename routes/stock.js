const router = require("express").Router();
const { httpCodes } = require("../static");

const productRepository = require("../repository/productRepository");
const ResponseObject = require("../static/classes/ResponseObject");
const ErrorObject = require("../static/classes/errorObject");
const Product = require("../static/classes/product");
const validateReqBody = require("../static/validation/validateProduct");

router.get("/getexpiredproducts", async (req, res) => {
  try {
    const { category, duration, page } = req.query;
    const { count, error, result } = await productRepository.getExpiredProducts(
      category,
      duration,
      page
    );

    if (!count) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "ST001",
            "Stock not found.",
            "stock",
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
          "Stock details fetched successfully.",
          "stock",
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
          "ST002",
          "Something Went Wrong",
          "stock",
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
    const { count, error, result } = await productRepository.getSearchResult(
      pattern
    );

    if (!count) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "ST003",
            "Stock not found.",
            "stock",
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
          "Stock details fetched successfully.",
          "stock",
          req.url,
          { count, result }
        )
      );
  } catch (error) {
    return res.status(
      httpCodes.INTERNAL_SERVER_ERROR.send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "ST004",
          "Something Went Wrong",
          "stock",
          req.url,
          req.method,
          error
        )
      )
    );
  }
});

router.get("/searchfullproduct", async (req, res) => {
  try {
    const { pattern } = req.query;
    const { count, error, result } =
      await productRepository.getSearchResultFull(pattern);

    if (!count) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "ST003",
            "Stock not found.",
            "stock",
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
          "Stock details fetched successfully.",
          "stock",
          req.url,
          { count, result }
        )
      );
  } catch (error) {
    return res.status(
      httpCodes.INTERNAL_SERVER_ERROR.send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "ST004",
          "Something Went Wrong",
          "stock",
          req.url,
          req.method,
          error
        )
      )
    );
  }
});

router.get("/findproductwithname", async (req, res) => {
  try {
    const { pattern, page } = req.query;
    const { count, error, result } = await productRepository.getProductsOnRegex(
      pattern,
      page
    );

    if (!count) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "ST005",
            "Stock not found.",
            "stock",
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
          "Stock details fetched successfully.",
          "stock",
          req.url,
          { count, result }
        )
      );
  } catch (error) {
    return res.status(
      httpCodes.INTERNAL_SERVER_ERROR.send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "ST006",
          "Something Went Wrong",
          "stock",
          req.url,
          req.method,
          error
        )
      )
    );
  }
});

router.get("/", async (req, res) => {
  try {
    const {
      sortByDateOfPurchase,
      sortByExpDate,
      sortByQuantity,
      sortByMrp,
      sortByPurchasePrice,
      filterByCategory,
      filterBySupplierName,
      filterByPurchaseOrderId,
      filterByInvoiceNumber,
      page,
    } = req.query;

    let sortObject = {};
    let filterObject = {};

    if (sortByDateOfPurchase) {
      sortObject.dateOfPurchase = parseFloat(sortByDateOfPurchase);
    }

    if (sortByExpDate) {
      sortObject.expDate = parseFloat(sortByExpDate);
    }

    if (sortByQuantity) {
      sortObject.quantity = parseFloat(sortByQuantity);
    }

    if (sortByMrp) {
      sortObject.mrp = parseFloat(sortByMrp);
    }

    if (sortByPurchasePrice) {
      sortObject.purchasePrice = parseFloat(sortByPurchasePrice);
    }

    if (filterByCategory) {
      filterObject.category = filterByCategory;
    }
    if (filterBySupplierName) {
      filterObject.supplierName = filterBySupplierName;
    }

    if (filterByPurchaseOrderId) {
      filterObject.purchaseOrderId = filterByPurchaseOrderId;
    }

    if (filterByInvoiceNumber) {
      filterObject.invoiceNumber = filterByInvoiceNumber;
    }

    const { count, result } = await productRepository.getAllProducts(
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
            "ST007",
            "Stock not found.",
            "stock",
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
          "Stock details fetched successfully.",
          "stock",
          req.url,
          { count, result }
        )
      );
  } catch (error) {
    return res.status(
      httpCodes.INTERNAL_SERVER_ERROR.send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "ST008",
          "Something Went Wrong",
          "stock",
          req.url,
          req.method,
          error
        )
      )
    );
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productRepository.getSingleProduct(id);
    if (!product.count) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "ST009",
            "Stock not found.",
            "stock",
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
          "Stock details fetched successfully.",
          "stock",
          req.url,
          { count: product.count, result: product.result }
        )
      );
  } catch (error) {
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "ST010",
          "Something Went Wrong - " + error.message,
          "stock",
          req.url,
          req.method,
          error
        )
      );
  }
});

router.post("/", async (req, res) => {
  return res
    .status(httpCodes.BAD_REQUEST)
    .send(
      new ErrorObject(
        httpCodes.BAD_REQUEST,
        "ST011",
        "Please add a purchase order.",
        "stock",
        req.url,
        req.method,
        null
      )
    );
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      productName,
      category,
      supplierName,
      invoiceNumber,
      dateOfPruchase,
      mfgDate,
      expDate,
      quantity,
      rate,
      sgst,
      cgst,
      mrp,
      batchNumber,
      discount,
      purchaseOrderId,
      __v,
    } = req.body;
    const product = new Product(
      productName,
      category,
      supplierId,
      supplierName,
      purchaseOrderId,
      invoiceNumber,
      dateOfPruchase,
      mfgDate,
      expDate,
      quantity.toString(),
      quantity.toString(),
      rate.toString(),
      sgst.toString(),
      cgst.toString(),
      mrp.toString(),
      batchNumber,
      discount.toString(),
      __v.toString()
    );

    // Validate request body
    const { error, value, warning } = validateReqBody(product);

    // If there is error in request body, then it will throw BAD request
    if (error) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "ST012",
            "Invalid Stock details provided - " + error.message,
            "stock",
            req.url,
            req.method,
            null
          )
        );
    }

    product.__v += 1;

    //otherwise create product Repository is invoked.
    const productObject = await productRepository.updateProduct(id, product);

    //Successful response
    return res
      .status(httpCodes.OK)
      .send(
        new ResponseObject(
          httpCodes.OK,
          req.method,
          "Stock details updated successfully.",
          "stock",
          req.url,
          { count: 1, result: productObject }
        )
      );
  } catch (error) {
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "ST013",
          "Something Went Wrong + " + error.message,
          "stock",
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
    const product = await productRepository.deleteProduct(id);
    return res
      .status(httpCodes.OK)
      .send(
        new ResponseObject(
          httpCodes.OK,
          req.method,
          "Stock details deleted successfully.",
          "stock",
          req.url,
          { count: 1, result: product }
        )
      );
  } catch (error) {
    return res.status(
      httpCodes.INTERNAL_SERVER_ERROR.send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "ST014",
          "Something Went Wrong",
          "stock",
          req.url,
          req.method,
          error
        )
      )
    );
  }
});

module.exports = router;
