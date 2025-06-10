const router = require("express").Router();
const { httpCodes, productCategory } = require("../static");

const productRepository = require("../repository/productRepository");
const purchaseOrderRepository = require("../repository/purchaseOrderRepository");

const ResponseObject = require("../static/classes/ResponseObject");
const ErrorObject = require("../static/classes/errorObject");
const Product = require("../static/classes/product");
const validateReqBody = require("../static/validation/validateProduct");
// const purchaseOrderRepository = require("../repository/purchaseOrderRepository");

// router.get("/updateall", async (req, res) => {
//   try {
//     const { result } = await productRepository.getAllProducts();
//     result.forEach(async (e) => {
//       // const {
//       //   productName,
//       //   category,
//       //   supplierId,
//       //   supplierName,
//       //   purchaseOrderId,
//       //   mfrCode,
//       //   hsnCode,
//       //   invoiceNumber,
//       //   dateOfPruchase,
//       //   mfgDate,
//       //   expDate,
//       //   purchaseQuantity,
//       //   quantity,
//       //   rate,
//       //   sgst,
//       //   cgst,
//       //   mrp,
//       //   batchNumber,
//       //   discount,
//       //   __v,
//       // } = e;

//       const product = e;
//       product.purchasePrice = e.rate;
//       product.schemeDiscount = 0;
//       // const product = new Product(
//       //   productName,
//       //   category,
//       //   supplierId,
//       //   supplierName,
//       //   purchaseOrderId,
//       //   mfrCode,
//       //   hsnCode,
//       //   invoiceNumberPurchaseOrder,
//       //   dateOfPruchase,
//       //   mfgDate,
//       //   expDate,
//       //   purchaseQuantity,
//       //   quantity,
//       //   rate,
//       //   sgst,
//       //   cgst,
//       //   mrp,
//       //   batchNumber,
//       //   discount,
//       //   __v
//       // );

//       const updatedProduct = await productRepository.updateProduct(
//         e._id,
//         product
//       );
//     });
//     res.send("Update Done");
//   } catch (error) {
//     console.log(error);
//     res.send("Error");
//   }
// });

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

router.get("/group", async (req, res) => {
  try {
    const { page, category } = req.query;
    let productCategory = undefined;
    if (typeof category == "object") {
      productCategory = category;
    }
    if (typeof category == "string") {
      productCategory = [category];
    }

    const products = await productRepository.getGroupProducts(
      page,
      productCategory
    );

    return res
      .status(httpCodes.OK)
      .send(
        new ResponseObject(
          httpCodes.OK,
          req.method,
          "Stock details fetched successfully.",
          "stock",
          req.url,
          products
        )
      );
  } catch (error) {
    return res.status(
      httpCodes.INTERNAL_SERVER_ERROR.send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "ST074",
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

router.get("/productid/:mfr", async (req, res) => {
  try {
    const { mfr } = req.params;
    const product = await productRepository.getProductByMFR(mfr);
    if (!product.count) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "ST019",
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
          { count: product.count, result: product.result[0] }
        )
      );
  } catch (error) {
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "ST020",
          "Something Went Wrong - " + error.message,
          "stock",
          req.url,
          req.method,
          error
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
      filterByHsnCode,
      filterByProductName,
      filterByMfrCode,
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
      filterObject.supplierName = {
        $regex: filterBySupplierName,
        $options: "i",
      };
    }

    if (filterByPurchaseOrderId) {
      filterObject.purchaseOrderId = filterByPurchaseOrderId;
    }

    if (filterByInvoiceNumber) {
      filterObject.invoiceNumber = filterByInvoiceNumber;
    }

    if (filterByHsnCode) {
      filterObject.hsnCode = filterByHsnCode;
    }

    if (filterByProductName) {
      filterObject.productName = { $regex: filterByProductName, $options: "i" };
    }

    if (filterByMfrCode) {
      filterObject.mfrCode = filterByMfrCode;
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
    // console.log(error);
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "ST008",
          "Something Went Wrong",
          "stock",
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

    // Fetch the purchase order ID
    // Check if quantity,
    const {
      productName,
      category,
      supplierId,
      supplierName,
      purchaseOrderId,
      mfrCode,
      hsnCode,
      invoiceNumber,
      dateOfPruchase,
      mfgDate,
      expDate,
      purchaseQuantity,
      quantity,
      rate,
      sgst,
      cgst,
      discount,
      purchasePrice,
      mrp,
      batchNumber,
      schemeDiscount,
      __v,
    } = req.body;

    // Fetch old product
    const oldProductResult = await productRepository.getSingleProduct(id);
    if (oldProductResult?.errorStatus) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "ST062",
            "Product not found - " + id,
            "stock",
            req.url,
            req.method,
            null
          )
        );
    }

    const oldProduct = oldProductResult?.result;

    if (oldProduct.mfrCode != mfrCode) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "ST061",
            "MFR code does not match - " + mfrCode,
            "stock",
            req.url,
            req.method,
            null
          )
        );
    }

    if (oldProduct.productName != productName) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "ST060",
            "Product Name can't be changed - " + productName,
            "stock",
            req.url,
            req.method,
            null
          )
        );
    }

    if (
      oldProduct.purchaseQuantity != oldProduct.quantity &&
      quantity < oldProduct.quantity
    ) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "ST063",
            oldProduct.quantity + "Quantity already sold. ",
            "stock",
            req.url,
            req.method,
            null
          )
        );
    }

    // Fetch purchase order
    const purchaseOrder = await purchaseOrderRepository.getSinglePurchaseOrder(
      purchaseOrderId
    );

    if (!purchaseOrder || purchaseOrder?.errorStatus) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "ST062",
            "Purchase invoice not found - " + invoiceNumber,
            "stock",
            req.url,
            req.method,
            null
          )
        );
    }

    let productObject = undefined;
    let purchaseOrderObject = undefined;

    //Validate new product
    const product = new Product(
      productName,
      category,
      supplierId,
      supplierName,
      purchaseOrderId,
      mfrCode,
      hsnCode,
      invoiceNumber,
      dateOfPruchase,
      mfgDate,
      expDate,
      purchaseQuantity,
      quantity,
      rate,
      sgst,
      cgst,
      mrp,
      batchNumber,
      purchasePrice,
      discount,
      schemeDiscount,
      __v
    );

    const { error, value, warning } = validateReqBody(product);

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

    let updatedTotalAmount = purchaseOrder.grandTotalAmount;
    let updatedCreditAmount = purchaseOrder.cerditAmount;
    let updatedAmount = purchaseOrder.totalAmount;
    // console.log(updatedCreditAmount);

    if (
      quantity != oldProduct.quantity ||
      rate != oldProduct.rate ||
      cgst != oldProduct.cgst ||
      sgst != oldProduct.sgst ||
      discount != oldProduct.discount ||
      schemeDiscount != oldProduct.schemeDiscount
    ) {
      const { grandTotalAmount } = purchaseOrder;

      //Subtract old product total from the purchase order total
      let oldGrandTotal =
        (parseFloat(oldProduct?.purchasePrice) +
          parseFloat(oldProduct?.sgst) +
          parseFloat(oldProduct?.cgst)) *
        oldProduct.purchaseQuantity;
      updatedTotalAmount = parseFloat(grandTotalAmount) - oldGrandTotal;

      //Calculate new product total from the purchase order total

      let newPurchasePrice = parseFloat(rate);
      if (discount) {
        newPurchasePrice = newPurchasePrice * (1 - parseFloat(discount) / 100);
      }

      if (schemeDiscount) {
        newPurchasePrice =
          newPurchasePrice * (1 - parseFloat(schemeDiscount) / 100);
      }

      product.purchasePrice = newPurchasePrice;

      product.quantity =
        parseInt(quantity) -
        (parseInt(oldProduct.purchaseQuantity) - parseInt(oldProduct.quantity));

      product.purchaseQuantity = parseInt(quantity);

      product.__v += 1;

      updatedAmount =
        parseFloat(updatedAmount) -
        parseFloat(oldProduct.purchasePrice) *
          parseInt(oldProduct.purchaseQuantity);

      updatedAmount =
        parseFloat(updatedAmount) + newPurchasePrice * parseInt(quantity);

      updatedTotalAmount =
        updatedTotalAmount +
        (newPurchasePrice + parseFloat(cgst) + parseFloat(sgst)) *
          parseInt(quantity);

      updatedCreditAmount =
        parseFloat(updatedCreditAmount) -
        parseFloat(purchaseOrder.grandTotalAmount);

      updatedCreditAmount =
        parseFloat(updatedCreditAmount) + parseFloat(updatedTotalAmount);
    }

    productObject = await productRepository.updateProduct(id, product);

    if (!productObject || productObject?.errorStatus) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "ST064",
            "Product not updated - " + productObject?.error,
            "stock",
            req.url,
            req.method,
            null
          )
        );
    }

    // console.log(updatedAmount);
    // console.log(updatedCreditAmount);
    // console.log(updatedTotalAmount);

    purchaseOrderObject = await purchaseOrderRepository.updatePurchaseOrder(
      purchaseOrderId,
      {
        grandTotalAmount: updatedTotalAmount,
        totalAmount: updatedAmount,
        cerditAmount: updatedCreditAmount,
      }
    );

    if (!purchaseOrderObject || purchaseOrderObject?.errorStatus) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "ST065",
            "Purchase Order not updated - " + purchaseOrderObject?.error,
            "stock",
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
          "Stock details updated successfully.",
          "stock",
          req.url,
          { count: 1, productObject, purchaseOrderObject }
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
    const oldProduct = await productRepository.getSingleProduct(id);

    if (oldProduct.errorStatus) {
      return res.status(
        httpCodes.INTERNAL_SERVER_ERROR.send(
          new ErrorObject(
            httpCodes.INTERNAL_SERVER_ERROR,
            "ST024",
            "Product does not exist",
            "stock",
            req.url,
            req.method,
            error
          )
        )
      );
    }

    if (oldProduct?.result?.purchaseQuantity != oldProduct?.result?.quantity) {
      return res.status(
        httpCodes.INTERNAL_SERVER_ERROR.send(
          new ErrorObject(
            httpCodes.INTERNAL_SERVER_ERROR,
            "ST025",
            "Product already sold",
            "stock",
            req.url,
            req.method,
            error
          )
        )
      );
    }

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
