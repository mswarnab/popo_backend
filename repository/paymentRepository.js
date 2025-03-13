const Payment = require("./schema/payment");

const createPayment = async (paymentObject) => {
  try {
    const payment = new Payment(paymentObject);
    return await payment.save();
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const updatePayment = async (id, paymentObject) => {
  try {
    return await Payment.findByIdAndUpdate(id, paymentObject);
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getSinglePayment = async (id) => {
  try {
    const result = await Payment.findById(id);
    return { count: 1, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getAllPayment = async (sortObject, filterObject, page = 0) => {
  try {
    const count = await Payment.find(filterObject).countDocuments();

    const result = await Payment.find(filterObject)
      .sort({ ...sortObject, paymentDate: -1 })
      .skip(20 * parseFloat(page))
      .limit(20);
    return { count, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const deletePayment = async (id) => {
  try {
    return await Payment.findByIdAndDelete(id);
  } catch (error) {
    return { errorStatus: true, error };
  }
};

module.exports = {
  getSinglePayment,
  getAllPayment,
  createPayment,
  updatePayment,
  deletePayment,
};
