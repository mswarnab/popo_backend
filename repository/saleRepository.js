const { formatDate } = require("../static/functions/getDate");
const Sale = require("./schema/sale");

const getTotalSaleAmountInLastWeek = async () => {
  try {
    let weekArrayDates = [];
    let currentDate = new Date();
    while (weekArrayDates.length < 7) {
      currentDate.setDate(currentDate.getDate() - 1);
      weekArrayDates = [...weekArrayDates, formatDate(currentDate)];
    }
    let count = [];
    let result = [];
    const promises = weekArrayDates.map(async (e, i) => {
      const tempCount = await Sale.find({ dateOfSale: e }).countDocuments();
      count = [...count, { date: e, count: tempCount }];
      const tempResult = await Sale.find({ dateOfSale: e }).select(
        "grandTotalAmount"
      );
      result = [...result, { date: e, result: tempResult }];
    });

    await Promise.all(promises);

    return { count, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getTotalSaleAmountInLastMonth = async (
  startDate = new Date(),
  endDate = new Date()
) => {
  try {
    startDate.setMonth(startDate.getMonth() - 1);
    const startDateFM = formatDate(startDate);
    const endDateFM = formatDate(endDate);

    const count = await Sale.find({
      dateOfSale: { $gte: startDateFM, $lte: endDateFM },
    }).countDocuments();

    const result = await Sale.aggregate([
      {
        $match: {
          dateOfSale: {
            $gte: startDateFM,
            $lte: endDateFM,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$grandTotalAmount" },
        },
      },
    ]);
    return { count, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

// const getMonthlyBills = async (startDate,endDate)=>{
//   try {
//     await Sale.find({
//       dateOfSale:{
//         $gte: startDate,
//         $lt:endDate
//       }
//     })
//   } catch (error) {

//   }

// }
const createSale = async (saleObject) => {
  try {
    const sale = new Sale(saleObject);
    return await sale.save();
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const updateSale = async (id, saleObject) => {
  try {
    return await Sale.findByIdAndUpdate(id, saleObject);
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getSingleSale = async (id) => {
  try {
    return await Sale.findById(id);
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getAllSale = async (
  page,
  sortObject,
  filterObj = { totalAmount: { $gt: 0 } }
) => {
  try {
    const count = await Sale.find(filterObj).sort(sortObject).countDocuments();

    const result = await Sale.find(filterObj)
      .sort(sortObject)
      .skip(20 * parseFloat(page))
      .limit(20);
    return { count, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getTotalSaleOfCustomers = async (id, page, filterDue) => {
  try {
    if (filterDue) {
      const count = await Sale.find()
        .where("customerId")
        .equals(id)
        .where("cerditAmount")
        .equals(0)
        .sortBy({ dateOfSale: -1 })
        .countDocuments();
      const result = await Sale.find()
        .where("customerId")
        .equals(id)
        .where("cerditAmount")
        .equals(0)
        .skip(20 * parseFloat(page))
        .sortBy({ dateOfSale: -1 })
        .countDocuments();
      return { count, result };
    }

    const count = await Sale.find()
      .where("customerId")
      .equals(id)
      .sortBy({ dateOfSale: -1 })
      .countDocuments();
    const result = await Sale.find()
      .where("customerId")
      .equals(id)
      .skip(20 * parseFloat(page))
      .sortBy({ dateOfSale: -1 })
      .countDocuments();
    return { count, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const deleteSale = async (id) => {
  try {
    return await Sale.findByIdAndDelete(id);
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getCustomerMonthlyBills = async (customerId, startDate, endDate) => {
  try {
    const count = await Sale.find({
      customerId,
      dateOfSale: { $gte: startDate, $lt: endDate },
    }).countDocuments();
    const result = await Sale.find({
      customerId,
      dateOfSale: { $gte: startDate, $lt: endDate },
    });

    return { count, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};
const getSaleBasedOnCustomerId = async (page, id) => {
  try {
    const count = await Sale.find()
      .where("customerId")
      .equals(id)
      .countDocuments();
    const result = await Sale.find()
      .where("customerId")
      .equals(id)
      .sort({ dateOfSale: -1 })
      .skip(20 * parseFloat(page))
      .limit(20);
    return { result, count };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getTotalProfitBasedOnDuration = async (startDate, endDate) => {
  try {
    // const result = await Sale.find({
    //   dateOfSale: { $lte: startDate, $gt: endDate },
    // }).select(["totalProfit", "dateOfSale"]);

    const result2 = await Sale.aggregate([
      {
        $match: {
          dateOfSale: { $lte: startDate, $gt: endDate },
        },
      },
      {
        $group: {
          _id: null, // Group all matching documents together
          totalProfitSum: { $sum: "$totalProfit" },
          totalSoldSum: { $sum: "$grandTotalAmount" },
        },
      },
    ]);
    return { count: result2.totalProfitSum, result: result2 };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

module.exports = {
  getAllSale,
  getSingleSale,
  createSale,
  updateSale,
  deleteSale,
  getCustomerMonthlyBills,
  getTotalSaleOfCustomers,
  getSaleBasedOnCustomerId,
  getTotalSaleAmountInLastWeek,
  getTotalSaleAmountInLastMonth,
  getTotalProfitBasedOnDuration,
};
