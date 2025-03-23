const router = require("express").Router();
const purchaseOrderRepository = require("../repository/purchaseOrderRepository");
const supplierRepository = require("../repository/supplierRepository");
const productRepository = require("../repository/productRepository");

const Product = require("../static/classes/product");
const PurchaseOrder = require("../static/classes/purchaseOrder");
const ErrorObject = require("../static/classes/errorObject");
const ResponseObject = require("../static/classes/ResponseObject");

const { httpCodes } = require("../static");
const validateReqBodyProduct = require("../static/validation/validateProduct");
const validateReqBodyPurchaseOrder = require("../static/validation/validatePurchaseOrder");

router.get("/total", async (req, res) => {
  try {
    const { count, error, result, errorStatus } =
      await purchaseOrderRepository.getTotalPurchaseAmountInLastMonth();

    if (errorStatus) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .send(
          new ErrorObject(
            httpCodes.INTERNAL_SERVER_ERROR,
            "PO054",
            "Something went wrong.",
            "purchase",
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
          "Purchase Order detail fetched successfully.",
          "purchase",
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
          "PO084",
          "Something went wrong.",
          "sale",
          req.url,
          req.method,
          error
        )
      );
  }
});

// Get All purchase Orders (Filters, sort)
router.get("/", async (req, res) => {
  try {
    const {
      filterByStartDate,
      filterByEndDate,
      sortByDate = "DESC",
      sortByGrandTotalAmount,
      filterByInvoiceNumber,
      filterBySupplierName,
      filterByCreditAmount,
      sortByCreditAmount,
      filterBySupplierId,
      filterByGrandTotalLte,
      filterByGrandTotalGte,
      filterByCreditAmountLte,
      filterByCreditAmountGte,
      page = 0,
    } = req.query;
    let sortObject = {};
    let filterObject = {};

    if (sortByDate) {
      if (sortByDate == "ASC") {
        sortObject.dateOfPruchase = 1;
      } else if (sortByDate == "DESC") {
        sortObject.dateOfPruchase = -1;
      }
    }

    if (sortByGrandTotalAmount) {
      if (sortByGrandTotalAmount == "ASC") {
        sortObject.grandTotalAmount = 1;
      } else if (sortByGrandTotalAmount == "DESC") {
        sortObject.grandTotalAmount = -1;
      }
    }

    if (sortByCreditAmount) {
      if (sortByCreditAmount == "ASC") {
        sortObject.cerditAmount = 1;
      } else if (sortByCreditAmount) {
        sortObject.cerditAmount = -1;
      }
    }

    if (filterByInvoiceNumber) {
      filterObject.invoiceNumber = filterByInvoiceNumber;
    }

    if (filterBySupplierName) {
      filterObject.supplierName = {
        $regex: filterBySupplierName,
        $options: "i",
      };
    }
    if (filterByCreditAmount) {
      filterObject.cerditAmount = {
        $gt: 0,
      };
    }

    if (filterBySupplierId) {
      filterObject.supplierId = filterBySupplierId;
    }

    // if (filterByCreditAmountGte && filterByCreditAmountLte) {
    //   filterObject.cerditAmount = {
    //     $gte: filterByCreditAmountGte,
    //     $lte: filterByCreditAmountLte,
    //   };
    // }

    // if (filterByGrandTotalGte && filterByGrandTotalLte) {
    //   filterObject.grandTotalAmount = {
    //     $gte: filterByGrandTotalGte,
    //     $lte: filterByGrandTotalLte,
    //   };
    // }

    const purchaseOrder = await purchaseOrderRepository.getAllPurchaseOrder(
      filterByStartDate,
      filterByEndDate,
      sortObject,
      filterObject,
      page
    );
    const { error, result, count } = purchaseOrder;
    if (!count) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "PO001",
            "Purchase order not found.",
            "purchaseOrder",
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
          "Purchase order fetched successfully.",
          "purchaseOrder",
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
          "PO002",
          "Something Went Wrong.",
          "purchaseOrder",
          req.url,
          req.method,
          error
        )
      );
  }
});

// Get Single Purchase Order
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await purchaseOrderRepository.getSinglePurchaseOrder(id);
    if (!result) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "PO003",
            "Purchase order not found.",
            "purchaseOrder",
            req.url,
            req.method,
            null
          )
        );
    }

    const productArray = await productRepository.getAllProductsOnPurchaseOrder(
      id
    );

    return res.status(httpCodes.OK).send(
      new ResponseObject(
        httpCodes.OK,
        req.method,
        "Purchase order fetched successfully.",
        "purchaseOrder",
        req.url,
        {
          count: 1,
          result: {
            purchaseOrderDetails: result,
            products: productArray.result,
          },
        }
      )
    );
  } catch (error) {
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "PO004",
          "Something Went Wrong.",
          "purchaseOrder",
          req.url,
          req.method,
          error
        )
      );
  }
});

//Create new purchase Order
//Add stock
router.post("/", async (req, res) => {
  try {
    // First check if the Supplier exists
    //Add products first
    const { purchaseOrderBody, stockBody } = req.body;
    const {
      invoiceNumber,
      supplierId,
      dateOfPruchase,
      paidAmount,
      modeOfPayment,
      dueDate,
      addLessAmount,
      crDrNote,
      finalAmount,
    } = purchaseOrderBody;

    if (!supplierId) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "PO014",
            "Invalid Supplier Id provided.",
            "purchaseOrder",
            req.url,
            req.method,
            null
          )
        );
    }

    const supplierDetails = await supplierRepository.getSingleSupplier(
      supplierId
    );

    if (!supplierDetails.result) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "PO005",
            "Supplier not created.",
            "purchaseOrder",
            req.url,
            req.method,
            null
          )
        );
    }

    //Check
    const existingPurchaseOrderDetails =
      await purchaseOrderRepository.getAllPurchaseOrder(
        undefined,
        undefined,
        undefined,
        { invoiceNumber },
        0
      );
    let productArary = [];
    let totalAmount = 0;
    let grandTotalAmount = 0;
    let haveError = false;
    let sgstPO = 0;
    let cgstPO = 0;
    const purchaseOrderIdExisting =
      existingPurchaseOrderDetails.result[0]?._id.toString() || "dummy";
    let discountPO = 0;
    stockBody.forEach((element) => {
      const {
        productName,
        category,
        supplierId,
        supplierName,
        mfrCode,
        hsnCode,
        mfgDate,
        expDate,
        quantity,
        rate,
        sgst,
        cgst,
        mrp,
        batchNumber,
        discount,
        schemeDiscount,
      } = element;

      const product = new Product(
        productName,
        category,
        supplierId,
        supplierDetails.result.supplierName,
        purchaseOrderIdExisting,
        mfrCode,
        hsnCode,
        invoiceNumber,
        dateOfPruchase,
        mfgDate,
        expDate,
        parseInt(quantity),
        parseInt(quantity),
        rate,
        sgst,
        cgst,
        mrp.toString().trim(),
        batchNumber,
        0,
        discount,
        schemeDiscount,
        0
      );

      // console.log(product);
      // Validate Stocks
      const { error } = validateReqBodyProduct(product);
      if (error) {
        haveError = error;
      }
      product.purchasePrice = product.rate;

      if (product.discount != "0") {
        product.purchasePrice =
          product.purchasePrice * (1 - product.discount / 100);
      }

      if (product.schemeDiscount != "0") {
        product.purchasePrice =
          product.purchasePrice * (1 - product.schemeDiscount / 100);
      }

      totalAmount += parseFloat(product.purchasePrice * product.quantity);
      grandTotalAmount +=
        (parseFloat(product.purchasePrice) +
          parseFloat(product.sgst) +
          parseFloat(product.cgst)) *
        parseInt(product.quantity);

      // discountPO +=
      //   parseFloat(product.discount) + parseFloat(product.schemeDiscount);
      sgstPO += parseFloat(product.sgst) * parseFloat(product.quantity);
      cgstPO += parseFloat(product.cgst) * parseFloat(product.quantity);

      productArary.push(product);
    });
    if (haveError) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "PO006",
            "Invalid Product details provided - " + haveError,
            "purchaseOrder",
            req.url,
            req.method,
            null
          )
        );
    }

    if (isNaN(paidAmount)) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "PO006",
            "Invalid Product details provided.",
            "purchaseOrder",
            req.url,
            req.method,
            null
          )
        );
    }
    const creditAmount = grandTotalAmount - parseFloat(paidAmount);
    const purchaseOrder = new PurchaseOrder(
      invoiceNumber,
      supplierId,
      supplierDetails.result.supplierName,
      dateOfPruchase,
      totalAmount,
      discountPO,
      sgstPO.toString(),
      cgstPO.toString(),
      paidAmount,
      modeOfPayment,
      creditAmount,
      dueDate,
      addLessAmount,
      crDrNote,
      parseFloat(finalAmount),
      0
    );

    const errorPurchaseOrder = validateReqBodyPurchaseOrder(purchaseOrder);

    if (!errorPurchaseOrder.value) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "PO007",
            "Invalid Purchase Order details provided. " +
              errorPurchaseOrder.error,
            "purchaseOrder",
            req.url,
            req.method,
            null
          )
        );
    }

    let purchaseOrderDetails;
    if (existingPurchaseOrderDetails.result.length) {
      purchaseOrder.totalAmount =
        parseFloat(existingPurchaseOrderDetails.result[0].totalAmount) +
        parseFloat(purchaseOrder.totalAmount);
      purchaseOrder.paidAmount =
        parseFloat(existingPurchaseOrderDetails.result[0].paidAmount) +
        parseFloat(purchaseOrder.paidAmount);
      purchaseOrder.sgst =
        parseFloat(existingPurchaseOrderDetails.result[0].sgst) +
        parseFloat(purchaseOrder.sgst);
      purchaseOrder.cgst =
        parseFloat(existingPurchaseOrderDetails.result[0].cgst) +
        parseFloat(purchaseOrder.cgst);
      purchaseOrder.grandTotalAmount =
        parseFloat(existingPurchaseOrderDetails.result[0].grandTotalAmount) +
        parseFloat(purchaseOrder.grandTotalAmount);
      purchaseOrder.cerditAmount =
        parseFloat(existingPurchaseOrderDetails.result[0].cerditAmount) +
        parseFloat(purchaseOrder.cerditAmount);

      purchaseOrder.__v = existingPurchaseOrderDetails.result[0].__v + 1;
      purchaseOrder.discount += existingPurchaseOrderDetails.result[0].discount;

      purchaseOrderDetails = await purchaseOrderRepository.updatePurchaseOrder(
        existingPurchaseOrderDetails.result[0]._id.toString(),
        purchaseOrder
      );
    } else {
      purchaseOrderDetails = await purchaseOrderRepository.createPurchaseOrder(
        purchaseOrder
      );
    }

    if (!purchaseOrderDetails || purchaseOrderDetails.errorStatus) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .send(
          new ErrorObject(
            httpCodes.INTERNAL_SERVER_ERROR,
            "PO008",
            "Something Went Wrong. " + errorPurchaseOrder.message,
            "purchaseOrder",
            req.url,
            req.method,
            null
          )
        );
    }

    if (purchaseOrderDetails._id) {
      productArary.forEach((e) => {
        e.purchaseOrderId = purchaseOrderDetails._id;
      });
    }

    productArary.forEach(async (e) => {
      await productRepository.createProduct(e);
    });

    const supplierObject = supplierDetails.result;

    if (creditAmount > 0) {
      supplierObject.totalCreditAmount =
        parseFloat(supplierObject.totalCreditAmount) + parseFloat(creditAmount);
      const updatedSupplier = await supplierRepository.updateSupplier(
        supplierObject._id,
        supplierObject
      );
    }

    return res
      .status(httpCodes.OK)
      .send(
        new ResponseObject(
          httpCodes.OK,
          req.method,
          "Purchase order and stock created successfully.",
          "purchaseOrder",
          req.url,
          { count: 1, purchaseOrderDetails }
        )
      );
  } catch (error) {
    // console.log(error);
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "PO010",
          "Something went wrong.",
          "purchaseOrder",
          req.url,
          req.method,
          error
        )
      );
  }
});

//Update Purchase Order
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { paidAmount } = req.body;

    if (isNaN(paidAmount) || parseFloat(paidAmount) < 0) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "PO031",
            "Invalid paid amount provided",
            "purchaseOrder",
            req.url,
            req.method,
            paidAmount
          )
        );
    }

    const purchaseOrder = await purchaseOrderRepository.getSinglePurchaseOrder(
      id
    );
    if (!purchaseOrder) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "PO032",
            "Invalid Purchase Order details provided - ",
            "purchaseOrder",
            req.url,
            req.method,
            purchaseOrder.error
          )
        );
    }

    purchaseOrder.paidAmount += parseFloat(paidAmount);
    purchaseOrder.cerditAmount -= parseFloat(paidAmount);
    purchaseOrder.__v += 1;

    const existingSupplierDetails = await supplierRepository.getSingleSupplier(
      purchaseOrder.supplierId
    );

    if (!existingSupplierDetails.result) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "PO037",
            "Invalid Supplier not found - ",
            "purchaseOrder",
            req.url,
            req.method,
            purchaseOrder.supplierId
          )
        );
    }

    existingSupplierDetails.result.totalCreditAmount -= parseFloat(paidAmount);

    //otherwise purchase order Repository is invoked.
    const purchaseOrderObjectAfterUpdate =
      await purchaseOrderRepository.updatePurchaseOrder(id, purchaseOrder);

    const updatedSupplier = await supplierRepository.updateSupplier(
      existingSupplierDetails.result._id,
      existingSupplierDetails.result
    );

    //Successful response
    return res.status(httpCodes.OK).send(
      new ResponseObject(
        httpCodes.OK,
        req.method,
        "Purchase order updated successfully.",
        "purchaseOrder",
        req.url,
        {
          count: 1,
          purchaseOrderObjectAfterUpdate,
          suppllierDetails: updatedSupplier,
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
          "PO012",
          "Something Went wrong. " + error.message,
          "purchaseOrder",
          req.url,
          req.method,
          error
        )
      );
  }
});

//Delete the purchase order
//Delete all the stocks added for that purchase order

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const existingPurchaseOrder =
      await purchaseOrderRepository.getSinglePurchaseOrder(id);
    if (!existingPurchaseOrder) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "PO043",
            "Purchase order not found with this ID - " + id,
            "purchaseOrder",
            req.url,
            req.method,
            id
          )
        );
    }
    const productArray = await productRepository.getAllProductsOnPurchaseOrder(
      id
    );
    if (!productArray.count) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .send(
          new ErrorObject(
            httpCodes.INTERNAL_SERVER_ERROR,
            "PO093",
            "Something Went wrong. " + id,
            "purchaseOrder",
            req.url,
            req.method,
            id
          )
        );
    }

    const errorInProductArray = { error: false, product: {} };
    productArray.result.forEach((result) => {
      if (result.purchaseQuantity != result.quantity) {
        errorInProductArray.error = true;
        errorInProductArray.product = result;
      }
    });

    if (errorInProductArray.error) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "PO094",
            "Already sold items from this purchase order. Purchase quantity and available quantity is different for purchase order Id. " +
              id,
            "purchaseOrder",
            req.url,
            req.method,
            errorInProductArray.product
          )
        );
    }

    const supplierDetails = await supplierRepository.getSingleSupplier(
      existingPurchaseOrder.supplierId
    );

    if (supplierDetails.errorStatus) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "PO033",
            "Supplier not found with this id - " +
              existingPurchaseOrder.supplierId,
            "purchaseOrder",
            req.url,
            req.method,
            id
          )
        );
    }

    supplierDetails.result.totalCreditAmount =
      parseFloat(supplierDetails.result.totalCreditAmount) -
      parseFloat(existingPurchaseOrder.cerditAmount);
    supplierDetails.result.__v += 1;

    const updatedSupplier = await supplierRepository.updateSupplier(
      supplierDetails.result._id,
      supplierDetails.result
    );
    const stock = await productRepository.deleteProductByPurchaseOrder(id);
    const purchaseOrder = await purchaseOrderRepository.deletePurchaseOrder(id);

    return res
      .status(httpCodes.OK)
      .send(
        new ResponseObject(
          httpCodes.OK,
          req.method,
          "Purchase order and related Stock deleted successfully.",
          "purchaseOrder",
          req.url,
          { purchaseOrder, stock, updatedSupplier }
        )
      );
  } catch (error) {
    // console.log(error);
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "PO013",
          "Something Went wrong. " + error.message,
          "purchaseOrder",
          req.url,
          req.method,
          error
        )
      );
  }
});

module.exports = router;
