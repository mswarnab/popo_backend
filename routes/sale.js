const router = require("express").Router();
const saleRepository = require("../repository/saleRepository");
const customerRepository = require("../repository/customerRepository");
const Sale = require("../static/classes/sale");
const dummyCustomerIdentifier = "No DATA";
const dummyMobileNumber = "9999999999";

const productRepository = require("../repository/productRepository");
const { httpCodes } = require("../static");
const ErrorObject = require("../static/classes/errorObject");
const ResponseObject = require("../static/classes/ResponseObject");
const validateReqBody = require("../static/validation/validateSale");
const validateReqBodyCustomer = require("../static/validation/validateCustomer");

const Customer = require("../static/classes/customer");
const dayjs = require("dayjs");

router.get("/weeklysale", async (req, res) => {
  try {
    const { count, error, result, errorStatus } =
      await saleRepository.getTotalSaleAmountInLastWeek();

    if (errorStatus) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .send(
          new ErrorObject(
            httpCodes.INTERNAL_SERVER_ERROR,
            "SA097",
            "Something went wrong.",
            "sale",
            req.url,
            req.method,
            error
          )
        );
    }
    let amountArray = [];
    result?.map((e) => {
      let tempAmount = 0;
      if (Array.isArray(e.result)) {
        tempAmount = 0;
        e.result.forEach((el) => {
          tempAmount += el.grandTotalAmount;
        });
        amountArray = [...amountArray, { date: e.date, result: tempAmount }];
      } else {
        tempAmount += e.grandTotalAmount;
      }
    });
    return res
      .status(httpCodes.OK)
      .send(
        new ResponseObject(
          httpCodes.OK,
          req.method,
          "Sale detail fetched successfully.",
          "sale",
          req.url,
          { count, result: amountArray }
        )
      );
  } catch (error) {
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "SA098",
          "Something went wrong.",
          "sale",
          req.url,
          req.method,
          error
        )
      );
  }
});

router.get("/totalsale", async (req, res) => {
  try {
    const { count, error, result, errorStatus } =
      await saleRepository.getTotalSaleAmountInLastMonth();

    if (errorStatus) {
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
          "Sale detail fetched successfully.",
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
          "SA004",
          "Something went wrong.",
          "sale",
          req.url,
          req.method,
          error
        )
      );
  }
});

router.get("/profit", async (req, res) => {
  try {
    const { duration = "WEEKLY" } = req.query;

    const currDate = dayjs().format("YYYYMMDD");
    let dateArray = [currDate];

    if (duration.toUpperCase() == "DAILY") {
      var tempDate = currDate;
      for (let i = 0; i < 6; i++) {
        tempDate = dayjs(tempDate).subtract(1, "day").format("YYYYMMDD");
        dateArray = [...dateArray, tempDate];
      }
    }

    if (duration.toUpperCase() == "MONTHLY") {
      var tempDate = currDate;
      for (let i = 0; i < 6; i++) {
        tempDate = dayjs(tempDate).subtract(1, "month").format("YYYYMMDD");
        dateArray = [...dateArray, tempDate];
      }
    }
    if (duration.toUpperCase() == "WEEKLY") {
      var tempDate = currDate;
      for (let i = 0; i < 6; i++) {
        tempDate = dayjs(tempDate).subtract(7, "days").format("YYYYMMDD");
        dateArray = [...dateArray, tempDate];
      }
    }

    if (duration.toUpperCase() == "QUARTERLY") {
      var tempDate = currDate;
      for (let i = 0; i < 6; i++) {
        tempDate = dayjs(tempDate).subtract(3, "months").format("YYYYMMDD");
        dateArray = [...dateArray, tempDate];
      }
    }

    if (duration.toUpperCase() == "YEARLY") {
      var tempDate = currDate;
      for (let i = 0; i < 6; i++) {
        tempDate = dayjs(tempDate).subtract(1, "year").format("YYYYMMDD");
        dateArray = [...dateArray, tempDate];
      }
    }

    let dataArray = [];
    for (let i = 0; i < 6; i++) {
      const tempArray = await saleRepository.getTotalProfitBasedOnDuration(
        dateArray[i],
        dateArray[i + 1]
      );
      dataArray = [
        ...dataArray,
        { date: dateArray[i], result: tempArray?.result },
      ];
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
          { count: 5, result: dataArray }
        )
      );
  } catch (error) {
    console.log(error);
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "SA041",
          "Something went wrong.",
          "sale",
          req.url,
          req.method,
          error.message
        )
      );
  }
});
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
      filterObject.cerditAmount = filterByCreditAmount;
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
    console.log(error);
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
          error
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

    // const { products } = saleDetail;
    // let productArray = [];
    // products.forEach((e) => {
    //   productArray = [...productArray, e.productId];
    // });

    // const productsResult = await productRepository.getAllProductsBasedOnIdArray(
    //   productArray
    // );

    // if (!productsResult.count) {
    //   return res
    //     .status(httpCodes.NOT_FOUND)
    //     .send(
    //       new ErrorObject(
    //         httpCodes.NOT_FOUND,
    //         "SA053",
    //         "Something went wrong.",
    //         "sale",
    //         req.url,
    //         req.method,
    //         productsResult
    //       )
    //     );
    // }

    // let combinedProductArray = [];

    // productsResult.result.forEach((e) => {
    //   const tempObject = products.find((el) => e._id == el.productId);
    //   const { _id, mrp, rate, sgst, cgst, productName } = e;
    //   const tempObject2 = {
    //     productId: _id,
    //     productName,
    //     productPurchasePrice: rate + cgst + sgst,
    //     productMrp: mrp,
    //     soldQuantity: tempObject.quantity,
    //     sellingPrice: tempObject.sellingPrice,
    //   };
    //   combinedProductArray = [...combinedProductArray, tempObject2];
    // });

    // saleObject = {
    //   ...saleDetail.toObject(),
    //   products: combinedProductArray,
    // };

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
    console.log(error);
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
          error
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
      customerName,
      customerAddress,
      dateOfSale,
      products,
      cgst,
      sgst,
      paidAmount,
      dueDate,
    } = req.body;

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
    let totalProfit = 0;
    let soldProducts = [];

    const promises = products.map(async (e) => {
      const { productId, quantity, sellingPrice } = e;
      if (productId.trim()) {
        const { count, result } = await productRepository.getSingleProduct(
          productId
        );
        e.mrp = parseFloat(result.mrp).toFixed(2);
        e.purchasePriceWithGst = parseFloat(
          result.rate + result.sgst + result.cgst
        ).toFixed(2);
        e.productName = result.productName;
        if (count) {
          if (result.quantity < parseInt(quantity)) {
            return { error: true, result };
          } else {
            result.quantity -= parseInt(quantity);
            discountedAmount +=
              (result.mrp - parseFloat(sellingPrice)) * parseInt(quantity);
            grandTotalAmount +=
              parseFloat(sellingPrice) * parseInt(quantity) +
              parseFloat(cgst) +
              parseFloat(sgst);
            totalProfit =
              parseFloat(totalProfit) +
              (parseFloat(sellingPrice) -
                (parseFloat(result.rate) +
                  parseFloat(result.sgst) +
                  parseFloat(result.cgst))) *
                parseInt(quantity);
            e.discountedAmount = discountedAmount;
            soldProducts = [...soldProducts, e];
            return { error: false, result };
          }
        }
      }
    });

    productArray = await Promise.all(promises);

    let errorInProductArray = {};

    productArray.every(({ error, result }) => {
      if (error) {
        errorInProductArray.error = true;
        errorInProductArray.productId = result._id;
        return false;
      } else return true;
    });

    if (errorInProductArray.error) {
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
    totalAmount = parseFloat(grandTotalAmount) + parseFloat(discountedAmount);
    creditAmount = parseFloat(grandTotalAmount) - parseFloat(paidAmount);
    if (creditAmount > 0) {
      if (!customerMobileNo.length || !customerName.length) {
        return res
          .status(httpCodes.BAD_REQUEST)
          .send(
            new ErrorObject(
              httpCodes.BAD_REQUEST,
              "SA055",
              "Please provide customer details as there is amount due - ",
              "sale",
              req.url,
              req.method,
              error
            )
          );
      }
    }

    let customerObject = {};
    if (customerMobileNo.length && customerName.length) {
      customerObject = await customerRepository.getSingleCustomerByMobileNo(
        customerMobileNo
      );

      if (!customerObject.count) {
        const customer = new Customer(
          customerName,
          customerMobileNo.toString(),
          customerAddress,
          dayjs().format("YYYY-MM-DD").toString(),
          creditAmount,
          0
        );

        const { error } = validateReqBodyCustomer(customer);
        if (error) {
          return res
            .status(httpCodes.BAD_REQUEST)
            .send(
              new ErrorObject(
                httpCodes.BAD_REQUEST,
                "SA065",
                "Invalid customer data provided - " + error.message,
                "sale",
                req.url,
                req.method,
                error
              )
            );
        }
        customerObject = await customerRepository.createCustomer(customer);

        if (!customerObject) {
          return res
            .status(httpCodes.INTERNAL_SERVER_ERROR)
            .send(
              new ErrorObject(
                httpCodes.INTERNAL_SERVER_ERROR,
                "SA066",
                "Something went wrong",
                "sale",
                req.url,
                req.method,
                customerObject
              )
            );
        }
      } else {
        customerObject = customerObject.result[0];

        // update customer's credit
        customerObject.totalCreditAmount += creditAmount;

        const customerUpdated = await customerRepository.updateCustomer(
          customerObject._id.toString(),
          customerObject
        );
        if (!customerUpdated) {
          return res
            .status(httpCodes.INTERNAL_SERVER_ERROR)
            .send(
              new ErrorObject(
                httpCodes.INTERNAL_SERVER_ERROR,
                "SA099",
                "Something went wrong.",
                "sale",
                req.url,
                req.method,
                null
              )
            );
        }
      }
    }
    const sale = new Sale(
      billNumber,
      customerObject._id?.toString() || dummyCustomerIdentifier,
      customerObject.customerContactNo || dummyMobileNumber,
      customerObject.customerName || dummyCustomerIdentifier,
      dateOfSale,
      products,
      Math.ceil(totalAmount).toFixed(2),
      Math.ceil(cgst).toFixed(2),
      Math.ceil(sgst).toFixed(2),
      Math.ceil(discountedAmount).toFixed(2),
      Math.ceil(paidAmount).toFixed(2),
      Math.ceil(creditAmount).toFixed(2),
      dueDate,
      Math.ceil(grandTotalAmount).toFixed(2),
      Math.ceil(totalProfit).toFixed(2),
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
          error
        )
      );
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { paidAmount } = req.body;
  try {
    const saleDetails = await saleRepository.getSingleSale(id);

    if (!saleDetails) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "SA085",
            "Sale detail not found.",
            "sale",
            req.url,
            req.method,
            { id }
          )
        );
    }
    if (isNaN(parseFloat(paidAmount))) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "SA086",
            "Invalid paid amount provided.",
            "sale",
            req.url,
            req.method,
            { id, paidAmount }
          )
        );
    }

    const customerObject = await customerRepository.getSingleCustomer(
      saleDetails.customerId
    );

    if (customerObject.errorStatus) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "SA077",
            "Something Went Wrong. Customer not found",
            "sale",
            req.url,
            req.method,
            { id, paidAmount, saleDetails, customerObject }
          )
        );
    }

    customerObject.result.totalCreditAmount -=
      parseFloat(paidAmount).toFixed(2);
    customerObject.result.__v += 1;

    const updatedCustomer = await customerRepository.updateCustomer(
      customerObject.result._id,
      customerObject
    );

    if (!updatedCustomer) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "SA078",
            "Something Went Wrong. Customer not updated",
            "sale",
            req.url,
            req.method,
            { id, paidAmount, customerObject, updatedCustomer }
          )
        );
    }

    saleDetails.cerditAmount =
      parseFloat(saleDetails.cerditAmount).toFixed(2) -
      parseFloat(paidAmount).toFixed(2);
    saleDetails.paidAmount +=
      parseFloat(saleDetails.paidAmount).toFixed(2) +
      parseFloat(paidAmount).toFixed(2);

    saleDetails.__v += 1;

    const saleUpdatedObject = await saleRepository.updateSale(id, saleDetails);
    if (saleUpdatedObject.errorStatus) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "SA087",
            "Something Went Wrong.",
            "sale",
            req.url,
            req.method,
            { id, paidAmount, saleDetails }
          )
        );
    }

    return res
      .status(httpCodes.OK)
      .send(
        new ResponseObject(
          httpCodes.OK,
          req.method,
          "Sale detail updated successfully.",
          "sale",
          req.url,
          { count: 1, result: saleUpdatedObject }
        )
      );
  } catch (error) {
    console.log(error);
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "SA088",
          "Something wrnt wrong.",
          "sale",
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

    const saleDetails = await saleRepository.getSingleSale(id);
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

    let customerObject = {};
    if (
      saleDetails.customerId != dummyCustomerIdentifier &&
      saleDetails.cerditAmount
    ) {
      customerObject = await customerRepository.getSingleCustomer(
        saleDetails.customerId
      );
      customerObject.result.totalCreditAmount -= parseFloat(
        saleDetails.cerditAmount
      ).toFixed(2);
      customerObject.result.__v += 1;
      const customerResult = await customerRepository.updateCustomer(
        customerObject.result._id,
        customerObject.result
      );

      if (!customerResult) {
        return res
          .status(httpCodes.NOT_FOUND)
          .send(
            new ErrorObject(
              httpCodes.NOT_FOUND,
              "SA084",
              "Issue with customer.",
              "sale",
              req.url,
              req.method,
              customerObject
            )
          );
      }
    }

    const { products } = saleDetails;

    const promises = products.map(async (element) => {
      const { productId, quantity } = element;
      const { result, error } = await productRepository.getSingleProduct(
        productId
      );
      result.quantity += parseInt(quantity);
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
    });

    const productArray = await Promise.all(promises);

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
    console.log(error);
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
          error
        )
      );
  }
});

module.exports = router;
