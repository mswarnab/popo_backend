const { productCategory } = require("../static");
const { formatDate, getCurrentDate } = require("../static/functions/getDate");
const Product = require("./schema/product");

const createProduct = async (productObject) => {
  try {
    const product = new Product(productObject);
    return await product.save();
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const createBulkProduct = async (productArary) => {
  try {
    const product = new Product(productArary);
    return await product.insertMany(productArary);
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const updateProduct = async (id, productObject) => {
  try {
    return await Product.findByIdAndUpdate(id, productObject, { new: true });
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getSingleProduct = async (id) => {
  try {
    const result = await Product.findById(id);
    return { count: result ? 1 : 0, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getAllProducts = async (sortObject = {}, filterObject = {}, page) => {
  try {
    let count;
    let result;

    filterObject = { ...filterObject, quantity: { $gt: 0 } };
    count = await Product.find(filterObject).countDocuments();
    result = await Product.find(filterObject)
      .sort(sortObject)
      .skip(20 * parseFloat(page))
      .limit(20);

    return { count, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getGroupProducts = async (page = 0, category = productCategory) => {
  try {
    const count = await Product.aggregate([
      {
        $match: { category: { $in: category } },
      },
      {
        $group: {
          _id: "$productName",
          totalQuantity: {
            $sum: "$quantity",
          },
          products: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 1,
          totalQuantity: 1,
          products: 1,
        },
      },
      {
        $count: "count",
      },
    ]);

    const result = await Product.aggregate([
      {
        $match: { category: { $in: category } },
      },
      {
        $group: {
          _id: "$productName",
          totalQuantity: {
            $sum: "$quantity",
          },
          products: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 1,
          // productName: 1,
          totalQuantity: 1,
          products: 1,
        },
      },
      {
        $skip: 20 * page,
      },
      {
        $limit: 20,
      },
    ]);
    return { count, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const deleteProduct = async (id) => {
  try {
    return await Product.findByIdAndDelete(id);
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const deleteProductByPurchaseOrder = async (id) => {
  try {
    return await Product.deleteMany({ purchaseOrderId: id });
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getExpiredProducts = async (
  category = productCategory,
  duration = 3,
  page = 0
) => {
  try {
    const currentDate = new Date();
    const notificationDate = formatDate(
      new Date(
        currentDate.setMonth(currentDate.getMonth() + parseFloat(duration))
      )
    );

    const count = await Product.find()
      .where("category")
      .in(typeof category == "object" ? category : [category])
      .where("expDate")
      .lte(notificationDate)
      .where("expDate")
      .ne("19700101")
      .where("quantity")
      .gt(0)
      .countDocuments();

    const result = await Product.find()
      .where("category")
      .in(typeof category == "object" ? category : [category])
      .where("expDate")
      .lte(notificationDate)
      .where("expDate")
      .ne("19700101")
      .where("quantity")
      .gt(0)
      .sort({ expDate: 1 })
      .skip(20 * parseInt(page))
      .limit(20);

    return { count, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getSearchResult = async (pattern) => {
  try {
    const count = await Product.find({
      productName: { $regex: pattern, $options: "i" },
    })
      .select(["productName"])

      .countDocuments();

    const result = await Product.find({
      productName: { $regex: pattern, $options: "i" },
    }).distinct("productName");
    // .limit(10);

    return { count, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getSearchResultFull = async (pattern) => {
  try {
    const count = await Product.find({
      productName: { $regex: pattern, $options: "i" },
      quantity: { $gt: 0 },
    }).countDocuments();

    const result = await Product.find({
      productName: { $regex: pattern, $options: "i" },
      quantity: { $gt: 0 },
    });

    return { count, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getProductsOnRegex = async (pattern, page = 0) => {
  try {
    const count = await Product.find({
      productName: { $regex: pattern, $options: "i" },
    }).countDocuments();

    const result = await Product.find({
      productName: { $regex: pattern, $options: "i" },
    })
      .select([
        "productName",
        "rate",
        "mrp",
        "expDate",
        "quantity",
        "mfrCode",
        "supplierName",
      ])
      .skip(20 * parseFloat(page))
      .limit(20);

    return { count, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getAllProductsOnPurchaseOrder = async (purchaseOrderId) => {
  try {
    const result = await Product.find({ purchaseOrderId });
    return { count: result.length, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

const getAllProductsBasedOnIdArray = async (productArray) => {
  try {
    const result = await Product.find({ _id: { $in: productArray } }).lean();
    return { count: result.length, result };
  } catch (error) {
    return { errorStatus: true, error };
  }
};

module.exports = {
  getAllProducts,
  getGroupProducts,
  getSingleProduct,
  createProduct,
  createBulkProduct,
  updateProduct,
  deleteProduct,
  getExpiredProducts,
  getSearchResult,
  getProductsOnRegex,
  deleteProductByPurchaseOrder,
  getSearchResultFull,
  getAllProductsOnPurchaseOrder,
  getAllProductsBasedOnIdArray,
};
