const router = require("express").Router();
const saleRepository = require("../repository/saleRepository");
const customerRepository = require("../repository/customerRepository");
const Sale = require("../static/classes/sale");
const dummyCustomerIdentifier = "9999999999";
const productRepository = require("../repository/productRepository");
const { httpCodes } = require("../static");
const ErrorObject = require("../static/classes/errorObject");
const ResponseObject = require("../static/classes/ResponseObject");
const validateReqBody = require("../static/validation/validateSale");

router.get("/", async (req, res) => {
  try {
    const {
      page,
      sortByDateOfSale,
      sortByGrandTotalAmount,
      sortByCreditAmount,
      filterByCustomerMobileNumber,
      filterByDateOfSale,
      filterByCreditAmount,
    } = req.query;

    let sortObject = {};
    let filterObject = {};
    if (sortByDateOfSale) {
      sortObject.dateOfSale = parseInt(sortByDateOfSale);
    }

    if (sortByGrandTotalAmount) {
      sortObject.grandTotalAmount = parseInt(sortByGrandTotalAmount);
    }

    if (sortByCreditAmount) {
      sortObject.creditAmount = parseInt(sortByCreditAmount);
    }

    if (filterByCustomerMobileNumber) {
      filterObject.customerMobileNo = filterByCustomerMobileNumber;
    }

    if (filterByDateOfSale) {
      filterObject.dateOfSale = filterByDateOfSale;
    }

    if (filterByCreditAmount) {
      filterObject.creditAmount = filterByCreditAmount;
    }

    const { count, error, result } = await saleRepository.getAllSale(
      page,
      sortObject,
      filterObject
    );

    if (!count) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "SA001",
            "Sale invoice not found.",
            "sale",
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
          "Sale details fetched successfully.",
          "sale",
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
          "SA002",
          "Something went wrong.",
          "sale",
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
    const saleDetail = await saleRepository.getSingleSale(id);
    if (!saleDetail) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "SA003",
            "Sale invoice not found.",
            "sale",
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
          "Sale detail fetched successfully.",
          "sale",
          req.url,
          { count: 1, result: saleDetail }
        )
      );
  } catch (error) {
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "SA004",
          "Something went wrong.",
          "sale",
          req.url,
          req.method,
          null
        )
      );
  }
});

router.post("/", async (req, res) => {
  try {
    let {
      billNumber,
      customerId,
      customerMobileNo,
      dateOfSale,
      products,
      cgst,
      sgst,
      paidAmount,
      dueDate,
    } = req.body;

    let customerObject = {};
    if (!customerMobileNo.trim() && !customerId.trim()) {
      if (creditAmount) {
        return res
          .status(httpCodes.NOT_FOUND)
          .send(
            new ErrorObject(
              httpCodes.NOT_FOUND,
              "SA005",
              "Customer not found. Please create customer first if credit amount is > 0.",
              "sale",
              req.url,
              req.method,
              null
            )
          );
      }
      customerMobileNo = dummyCustomerIdentifier;
      customerId = dummyCustomerIdentifier;
    } else {
      customerObject = await customerRepository.getSingleCustomerByMobileNo(
        customerMobileNo
      );
    }

    if (!customerObject && customerId != dummyCustomerIdentifier) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "SA006",
            "Customer not found.",
            "sale",
            req.url,
            req.method,
            null
          )
        );
    }

    if (!customerObject) {
      customerObject = customer;
    }

    if (!products) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "SA007",
            "Products not added.",
            "sale",
            req.url,
            req.method,
            null
          )
        );
    }

    let productArray = [];
    let totalAmount = 0;
    let creditAmount = 0;
    let discountedAmount = 0;
    let grandTotalAmount = 0;
    console.log(grandTotalAmount);

    const promises = products.map(async (e) => {
      const { productId, quantity, sellingPrice } = e;
      if (productId.trim()) {
        const { count, result } = await productRepository.getSingleProduct(
          productId
        );

        if (count) {
          if (result.quantity < parseInt(quantity)) {
            return { error: true, result };
          } else {
            result.quantity -= parseInt(quantity);
            discountedAmount +=
              (result.mrp - parseInt(sellingPrice)) * parseInt(quantity);
            grandTotalAmount +=
              parseInt(sellingPrice) * parseInt(quantity) +
              parseInt(cgst) +
              parseInt(sgst);
            return { error: false, result };
          }
        }
      }
    });
    productArray = await Promise.all(promises);
    console.log(productArray);

    let errorInProductArray = undefined;

    productArray.every(({ error, result }) => {
      if (error) {
        errorInProductArray.error = true;
        errorInProductArray.productId = result._id;
        return false;
      } else return true;
    });

    console.log(grandTotalAmount);
    if (errorInProductArray) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "SA008",
            "Quantity is not available for the product." +
              errorInProductArray.productId,
            "sale",
            req.url,
            req.method,
            null
          )
        );
    }

    productArray.forEach(async ({ result }, i) => {
      result.__v += 1;
      const updatedProduct = await productRepository.updateProduct(
        result._id,
        result
      );
      if (!updatedProduct) {
        return res
          .status(httpCodes.INTERNAL_SERVER_ERROR)
          .send(
            new ErrorObject(
              httpCodes.INTERNAL_SERVER_ERROR,
              "SA009",
              "Something went wrong.",
              "sale",
              req.url,
              req.method,
              null
            )
          );
      }
    });
    totalAmount = parseInt(grandTotalAmount) + parseInt(discountedAmount);
    creditAmount = parseInt(grandTotalAmount) - parseInt(paidAmount);

    const sale = new Sale(
      billNumber,
      customerId,
      customerMobileNo,
      dateOfSale,
      products,
      totalAmount,
      cgst,
      sgst,
      discountedAmount,
      paidAmount,
      creditAmount,
      dueDate,
      grandTotalAmount,
      (__v = 0)
    );

    // Validate request body
    const { error, value, warning } = validateReqBody(sale);

    if (error) {
      return res
        .status(httpCodes.BAD_REQUEST)
        .send(
          new ErrorObject(
            httpCodes.BAD_REQUEST,
            "SA010",
            "Invalid request provided - " + error.message,
            "sale",
            req.url,
            req.method,
            null
          )
        );
    }

    //otherwise create product Repository is invoked.
    const saleDetailObject = await saleRepository.createSale(sale);

    if (saleDetailObject?.errorStatus) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .send(
          new ErrorObject(
            httpCodes.INTERNAL_SERVER_ERROR,
            "SA011",
            "Something went wrong.",
            "sale",
            req.url,
            req.method,
            null
          )
        );
    }

    // Successful response
    return res
      .status(httpCodes.OK)
      .send(
        new ResponseObject(
          httpCodes.OK,
          req.method,
          "Sale detail created successfully.",
          "sale",
          req.url,
          { count: 1, result: saleDetailObject }
        )
      );
  } catch (error) {
    console.log(error);
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "SA012",
          "Something went wrong.",
          "sale",
          req.url,
          req.method,
          null
        )
      );
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const saleDetails = saleRepository.getSingleSale(id);

    if (!saleDetails) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "SA014",
            "Sale detail not found.",
            "sale",
            req.url,
            req.method,
            null
          )
        );
    }

    const { products } = saleDetail;

    products.array.forEach(async (element) => {
      const { _id, quantity } = element;
      const { result } = await productRepository.getSingleProduct(_id);
      if (!result) {
        result._id = undefined;
        result.__v = undefined;
        const createdProduct = await productRepository.createProduct(result);
        if (!createdProduct) {
          return res
            .status(httpCodes.INTERNAL_SERVER_ERROR)
            .send(
              new ErrorObject(
                httpCodes.INTERNAL_SERVER_ERROR,
                "SA015",
                "Something wrnt wrong.",
                "sale",
                req.url,
                req.method,
                null
              )
            );
        }
      } else {
        result.quantity += quantity;
        result.__v += 1;
        const updatedProduct = await productRepository.updateProduct(
          result._id,
          result
        );
        if (!updatedProduct) {
          return res
            .status(httpCodes.INTERNAL_SERVER_ERROR)
            .send(
              new ErrorObject(
                httpCodes.INTERNAL_SERVER_ERROR,
                "SA016",
                "Something wrnt wrong.",
                "sale",
                req.url,
                req.method,
                null
              )
            );
        }
      }
    });

    const saleDetail = await saleRepository.deleteSale(id);
    return res
      .status(httpCodes.OK)
      .send(
        new ResponseObject(
          httpCodes.OK,
          req.method,
          "Sale detail deleted successfully.",
          "sale",
          req.url,
          { count: 1, result: saleDetail }
        )
      );
  } catch (error) {
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "SA017",
          "Something wrnt wrong.",
          "sale",
          req.url,
          req.method,
          null
        )
      );
  }
});

module.exports = router;
