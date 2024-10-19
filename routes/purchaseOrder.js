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

// Get All purchase Orders (Filters, sort)
router.get("/", async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      sortByDateOfPurchase = -1,
      sortByGrandTotal,
      filterByInvoice,
      filterBySuplierId,
      filterByGrandTotalLte,
      filterByGrandTotalGte,
      filterByCreditAmountLte,
      filterByCreditAmountGte,
      page = 0,
    } = req.query;
    let sortObject = {};
    let filterObject = {};

    if (sortByDateOfPurchase) {
      sortObject.dateOfPruchase = sortByDateOfPurchase;
    }

    if (sortByGrandTotal) {
      sortObject.grandTotalAmount = sortByGrandTotal;
    }

    if (filterByInvoice) {
      filterObject.invoiceNumber = filterByInvoice;
    }

    if (filterBySuplierId) {
      filterObject.supplierId = filterBySuplierId;
    }

    if (filterByCreditAmountGte && filterByCreditAmountLte) {
      filterObject.cerditAmount = {
        $gte: filterByCreditAmountGte,
        $lte: filterByCreditAmountLte,
      };
    }

    if (filterByGrandTotalGte && filterByGrandTotalLte) {
      filterObject.grandTotalAmount = {
        $gte: filterByGrandTotalGte,
        $lte: filterByGrandTotalLte,
      };
    }

    const purchaseOrder = await purchaseOrderRepository.getAllPurchaseOrder(
      startDate,
      endDate,
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
    console.log(error);
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
          null
        )
      );
  }
});

// Get Single Purchase Order
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await purchaseOrderRepository.getSinglePurchaseOrder(id);
    if (result.error) {
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
    return res
      .status(httpCodes.OK)
      .send(
        new ResponseObject(
          httpCodes.OK,
          req.method,
          "Purchase order fetched successfully.",
          "purchaseOrder",
          req.url,
          { count: 1, result }
        )
      );
  } catch (error) {
    console.log(error);
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
          null
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
      dueDate,
      addLessAmount,
      crDrNote,
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

    if (!supplierDetails) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "PO005",
            "Invalid Supplier Id provided.",
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
    console.log(purchaseOrderIdExisting);
    let discountPO = 0;
    stockBody.forEach((element) => {
      const {
        productName,
        category,
        supplierName,
        mfgDate,
        expDate,
        quantity,
        rate,
        sgst,
        cgst,
        mrp,
        batchNumber,
        discount,
      } = element;

      const product = new Product(
        productName,
        category,
        supplierName,
        purchaseOrderIdExisting,
        invoiceNumber,
        dateOfPruchase,
        mfgDate,
        expDate,
        quantity,
        quantity,
        rate,
        sgst,
        cgst,
        mrp.toString().trim(),
        batchNumber,
        discount,
        0
      );
      console.log(mrp);
      // Validate Stocks
      const { error } = validateReqBodyProduct(product);
      if (error) {
        haveError = error;
      }

      totalAmount += product.rate * product.quantity;
      grandTotalAmount +=
        (parseInt(product.rate) +
          parseInt(product.sgst) +
          parseInt(product.cgst) -
          parseInt(discount || 0)) *
        product.quantity;

      discountPO += parseInt(product.discount);
      sgstPO += parseInt(product.sgst) * parseInt(product.quantity);
      cgstPO += parseInt(product.cgst) * parseInt(product.quantity);

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

    if (!paidAmount || isNaN(paidAmount)) {
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
    const creditAmount = grandTotalAmount - parseInt(paidAmount);

    const purchaseOrder = new PurchaseOrder(
      invoiceNumber,
      supplierId,
      dateOfPruchase,
      totalAmount,
      discountPO.toString(),
      sgstPO.toString(),
      cgstPO.toString(),
      paidAmount,
      creditAmount,
      dueDate,
      addLessAmount,
      crDrNote,
      grandTotalAmount,
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
        parseInt(existingPurchaseOrderDetails.result[0].totalAmount) +
        parseInt(purchaseOrder.totalAmount);
      purchaseOrder.paidAmount =
        parseInt(existingPurchaseOrderDetails.result[0].paidAmount) +
        parseInt(purchaseOrder.paidAmount);
      purchaseOrder.sgst =
        parseInt(existingPurchaseOrderDetails.result[0].sgst) +
        parseInt(purchaseOrder.sgst);
      purchaseOrder.cgst =
        parseInt(existingPurchaseOrderDetails.result[0].cgst) +
        parseInt(purchaseOrder.cgst);
      purchaseOrder.grandTotalAmount =
        parseInt(existingPurchaseOrderDetails.result[0].grandTotalAmount) +
        parseInt(purchaseOrder.grandTotalAmount);
      purchaseOrder.cerditAmount =
        parseInt(existingPurchaseOrderDetails.result[0].cerditAmount) +
        parseInt(purchaseOrder.cerditAmount);

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

    // let  productDetailsArray=[];
    productArary.forEach(async (e) => {
      const productTemp = await productRepository.createProduct(e);
    });
    // console.log(productDetailsArray)
    // if(!productDetailsArray.length){
    //     return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,"PO009","Internal Server Error.", "purchaseOrder",req.url, req.method,null));
    // }

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
    console.log(error);
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
          null
        )
      );
  }
});

//Update Purchase Order
router.put("/:id", async (req, res) => {
  try {
    const purchaseOrder = new PurchaseOrder(req.body);
    const { error, value, warning } =
      validateReqBodyPurchaseOrder(purchaseOrder);

    // Validate request body
    if (error) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "PO011",
            "Invalid Purchase Order details provided - " + error.message,
            "purchaseOrder",
            req.url,
            req.method,
            null
          )
        );
    }

    purchaseOrder.__v += 1;

    //otherwise purchase order Repository is invoked.
    const purchaseOrderObject =
      await purchaseOrderRepository.updatePurchaseOrder(id, purchaseOrder);

    //Successful response
    return res
      .status(httpCodes.OK)
      .send(
        new ResponseObject(
          httpCodes.OK,
          req.method,
          "Purchase order updated successfully.",
          "purchaseOrder",
          req.url,
          { count: 1, purchaseOrderObject }
        )
      );
  } catch (error) {
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "PO012",
          "Something Went wrong. " + errorPurchaseOrder.message,
          "purchaseOrder",
          req.url,
          req.method,
          null
        )
      );
  }
});

//Delete the purchase order
//Delete all the stocks added for that purchase order

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const purchaseOrder = await purchaseOrderRepository.deletePurchaseOrder(id);
    const stock = await productRepository.deleteProductByPurchaseOrder(id);
    return res
      .status(httpCodes.OK)
      .send(
        new ResponseObject(
          httpCodes.OK,
          req.method,
          "Purchase order and related Stock deleted successfully.",
          "purchaseOrder",
          req.url,
          { purchaseOrder, stock }
        )
      );
  } catch (error) {
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "PO013",
          "Something Went wrong. " + errorPurchaseOrder.message,
          "purchaseOrder",
          req.url,
          req.method,
          null
        )
      );
  }
});

module.exports = router;
