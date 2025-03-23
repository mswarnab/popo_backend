const PurchaseOrder = require("./schema/purchaseOrder");

const createPurchaseOrder = async (PurchaseOrderObject) => {
  try {
    const purchaseOrder = new PurchaseOrder(PurchaseOrderObject);
    return await purchaseOrder.save();
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const updatePurchaseOrder = async (id, PurchaseOrderObject) => {
  try {
    return await PurchaseOrder.findByIdAndUpdate(id, PurchaseOrderObject, {
      returnDocument: "after",
    });
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getSinglePurchaseOrder = async (id) => {
  try {
    return await PurchaseOrder.findById(id);
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getPurchaseOrderBasedOnSupplierId = async (
  supplierId,
  sortValue,
  page
) => {
  try {
    const count = await PurchaseOrder.find()
      .where("supplierId")
      .equals(supplierId)
      .countDocuments();
    const result = await PurchaseOrder.find()
      .where("supplierId")
      .equals(supplierId)
      .sort({ dateOfPruchase: sortValue })
      .skip(20 * parseFloat(page))
      .limit(20);
    return { count, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getPurchaseOrderBasedOnInvoiceNumber = async (invoiceNumber) => {
  try {
    const count = 1;
    const result = await PurchaseOrder.find()
      .where("invoiceNumber")
      .equals(invoiceNumber);

    return { count, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

// const getSortedPurchasedOrderBasedOnDateOfPurchase = async()=>{
//     try {
//         const count = await PurchaseOrder.find()
//                                         .sort({dateOfPruchase:1})
//                                         .countDocuments()
//         const result = await PurchaseOrder.find()
//                                         .sort({dateOfPruchase:1})
//                                         .limit(20);
//         return {count, result};
//     } catch (error) {
//         return {errorStatus:true,error}
//     }
// }

const getTotalPurchaseAmountInLastMonth = async (
  startDate = new Date(),
  endDate = new Date()
) => {
  try {
    startDate.setMonth(startDate.getMonth() - 1);
    const startDateFM = formatDate(startDate);
    const endDateFM = formatDate(endDate);

    const count = await PurchaseOrder.find({
      dateOfPruchase: { $gte: startDateFM, $lte: endDateFM },
    }).countDocuments();

    const result = await Sale.aggregate([
      {
        $match: {
          dateOfPruchase: {
            $gte: startDateFM,
            $lte: endDateFM,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalPurchase: { $sum: "$grandTotalAmount" },
        },
      },
    ]);
    return { count, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getAllPurchaseOrder = async (
  startDate = "20000101",
  endDate = "30000101",
  sortObject = { dateOfPruchase: -1 },
  filterObj = {},
  page
) => {
  try {
    const count = await PurchaseOrder.find({
      ...filterObj,
      dateOfPruchase: { $gte: startDate, $lte: endDate },
    }).countDocuments();
    const result = await PurchaseOrder.find({
      ...filterObj,
      dateOfPruchase: { $gte: startDate, $lte: endDate },
    })
      .sort(sortObject)
      .skip(page == "NA" ? 0 : 20 * parseInt(page))
      .limit(!isNaN(page) ? 20 : 999999);
    return { count, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

// const getPurchaseOrdersBasedOnSortedCredit = async()=>{
//     try {
//         const count = await PurchaseOrder.find()
//                                         .sort({cerditAmount:-1})
//                                         .countDocuments()
//         const result = await PurchaseOrder.find()
//                                         .sort({cerditAmount:-1})
//                                         .limit(20);
//         return {count, result};
//     } catch (error) {
//         return {errorStatus:true,error}
//     }
// }

// const getPurchaseOrdersBasedOnPurchaseDate = async (startDate,endDate) =>{
//     try {
//         const count = await PurchaseOrder.find()
//                                         .where("dateOfPruchase")
//                                         .gte(startDate)
//                                         .lte(endDate)
//                                         .countDocuments();
//         const result = await PurchaseOrder.find()
//                                         .where("dateOfPruchase")
//                                         .gte(startDate)
//                                         .lte(endDate)
//                                         .limit(20);
//         return {count,result};
//     } catch (error) {
//         return {errorStatus:true,error}
//     }
// }

const deletePurchaseOrder = async (id) => {
  try {
    return await PurchaseOrder.findByIdAndDelete(id);
  } catch (error) {
    return { errorStatus: true, error };
  }
};

module.exports = {
  getAllPurchaseOrder,
  getSinglePurchaseOrder,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  getTotalPurchaseAmountInLastMonth,
  getPurchaseOrderBasedOnSupplierId,
  getPurchaseOrderBasedOnInvoiceNumber,
};
