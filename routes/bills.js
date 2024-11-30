const router = require("express").Router();
const saleRepository = require("../repository/saleRepository");
const customerRepository = require("../repository/customerRepository");

const { httpCodes } = require("../static");
const ErrorObject = require("../static/classes/errorObject");
const ResponseObject = require("../static/classes/ResponseObject");

const dayjs = require("dayjs");

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const customerDetails = await customerRepository.getSingleCustomer(id);
    if (!customerDetails.result) {
      return res
        .status(httpCodes.FORBIDDEN)
        .send(
          new ErrorObject(
            httpCodes.FORBIDDEN,
            "BI001",
            "Something went wrong.",
            "sale",
            req.url,
            req.method,
            null
          )
        );
    }

    const currentDate = dayjs().format("YYYYMMDD");
    const lastBillGenDate =
      dayjs().format("YYYYMMDD").substring(0, 5).toString() + "01".toString();

    const saleDetails = await saleRepository.getCustomerMonthlyBills(
      id,
      lastBillGenDate,
      currentDate
    );

    if (saleDetails.errorStatus) {
      return res
        .status(httpCodes.FORBIDDEN)
        .send(
          new ErrorObject(
            httpCodes.FORBIDDEN,
            "BI002",
            "Something went wrong.",
            "sale",
            req.url,
            req.method,
            null
          )
        );
    }

    if (!saleDetails.result.length) {
      return res
        .status(httpCodes.NOT_FOUND)
        .send(
          new ErrorObject(
            httpCodes.NOT_FOUND,
            "BI002",
            "Bill not found for this month.",
            "sale",
            req.url,
            req.method,
            null
          )
        );
    }

    // const customerUpdated = await customerRepository.updateCustomer(id, {
    //   lastBillGenDate: currentDate,
    // });

    // if (!customerUpdated) {
    //   return res
    //     .status(httpCodes.INTERNAL_SERVER_ERROR)
    //     .send(
    //       new ErrorObject(
    //         httpCodes.INTERNAL_SERVER_ERROR,
    //         "BI003",
    //         "Bill not found in this month.",
    //         "sale",
    //         req.url,
    //         req.method,
    //         null
    //       )
    //     );
    // }

    return res
      .status(httpCodes.OK)
      .send(
        new ResponseObject(
          httpCodes.OK,
          req.method,
          "Sale detail fetched successfully.",
          "sale",
          req.url,
          saleDetails
        )
      );
  } catch (error) {
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "BI003",
          "Something went wrong.",
          "sale",
          req.url,
          req.method,
          null
        )
      );
  }
});

module.exports = router;
