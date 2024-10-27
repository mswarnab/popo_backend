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

const createSale = async (saleObject) => {
  try {
    const sale = new Sale(saleObject);
    await sale.save();
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const updateSale = async (saleObject) => {
  try {
    return await Sale.findByIdAndUpdate(saleObject._id, saleObject);
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
  } catch (error) {}
};

module.exports = {
  getAllSale,
  getSingleSale,
  createSale,
  updateSale,
  deleteSale,
  getTotalSaleOfCustomers,
  getSaleBasedOnCustomerId,
  getTotalSaleAmountInLastWeek,
  getTotalSaleAmountInLastMonth,
};
