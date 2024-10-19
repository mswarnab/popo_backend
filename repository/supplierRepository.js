const Supplier = require("./schema/supplier");

const createSupplier = async (supplierObject) => {
  try {
    const supplier = new Supplier(supplierObject);
    return await supplier.save();
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const updateSupplier = async (id, supplierObject) => {
  try {
    return await Supplier.findByIdAndUpdate(id, supplierObject);
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getSingleSupplier = async (id) => {
  try {
    const result = await Supplier.findById(id);
    return { count: 1, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getAllSupplier = async (page = 0) => {
  try {
    const count = await Supplier.find().countDocuments();

    const result = await Supplier.find()
      .sort({ lastPurchaseDate: -1 })
      .skip(20 * parseInt(page))
      .limit(20);
    return { count, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const deleteSupplier = async (id) => {
  try {
    return await Supplier.findByIdAndDelete(id);
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getSearchResult = async (pattern) => {
  try {
    const count = await Supplier.find({
      supplierName: { $regex: pattern, $options: "i" },
    })
      .select(["supplierName", "supplierContactNo"])

      .countDocuments();

    const result = await Supplier.find({
      supplierName: { $regex: pattern, $options: "i" },
    })
      .select(["supplierName", "supplierContactNo"])
      .limit(10);

    return { count, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getSuppliersOnRegex = async (pattern) => {
  try {
    const count = await Supplier.find({
      supplierName: { $regex: pattern, $options: "i" },
    }).countDocuments();

    const result = await Supplier.find({
      supplierName: { $regex: pattern, $options: "i" },
    }).limit(20);
    console.log(result);

    return { count, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getSuppliersHavingCredit = async (page) => {
  try {
    const count = await Supplier.find()
      .where("totalCreditAmount")
      .gt(0)
      .countDocuments();
    const result = await Supplier.find()
      .where("totalCreditAmount")
      .gt(0)
      .sort({ totalCreditAmount: -1 })
      .skip(20 * parseInt(page))
      .limit(20);
    return { count, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

module.exports = {
  getAllSupplier,
  getSingleSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSearchResult,
  getSuppliersOnRegex,
  getSuppliersHavingCredit,
};
