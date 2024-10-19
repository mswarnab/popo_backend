const Customer = require("./schema/customer");

const createCustomer = async (customerObject) => {
  try {
    const customer = new Customer(customerObject);
    await customer.save();
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const updateCustomer = async (id, customerObject) => {
  try {
    return await Customer.findByIdAndUpdate(id, customerObject);
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getSingleCustomer = async (id) => {
  try {
    const result = await Customer.findById(id);
    return { count: 1, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getSingleCustomerByMobileNo = async (mobileNo) => {
  try {
    const result = await Customer.find()
      .where("customerContactNo")
      .equals(parseInt(mobileNo));
    return { count: 1, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getAllCustomer = async (page = 0) => {
  try {
    const count = await Customer.find().countDocuments();

    const result = await Customer.find()
      .sort({ lastPurchaseDate: -1 })
      .skip(20 * parseInt(page))
      .limit(20);
    return { count, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const deleteCustomer = async (id) => {
  try {
    return await Customer.findByIdAndDelete(id);
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getSearchResult = async (pattern) => {
  try {
    const count = await Customer.find({
      customerName: { $regex: pattern, $options: "i" },
    })
      .select(["customerName", "customerContactNo"])

      .countDocuments();

    const result = await Customer.find({
      customerName: { $regex: pattern, $options: "i" },
    })
      .select(["customerName", "customerContactNo"])
      .limit(10);

    return { count, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getCustomersOnRegex = async (regex) => {
  try {
    const count = await Customer.find()
      .where("customerName")
      .regex(regex)
      .countDocuments();

    const result = await Customer.find()
      .where("customerName")
      .regex(regex)
      .countDocuments();
    return { count, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getCustomersHavingCredit = async (page) => {
  try {
    const count = await Customer.find()
      .where("totalCreditAmount")
      .gt(0)
      .countDocuments();
    const result = await Customer.find()
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
  getAllCustomer,
  getSingleCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getSearchResult,
  getSingleCustomerByMobileNo,
  getCustomersOnRegex,
  getCustomersHavingCredit,
};
