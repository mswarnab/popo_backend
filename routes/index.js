const customerRouter = require("./customer");
const purhaseOrderRouter = require("./purchaseOrder");
const stockRouter = require("./stock");
const supplierRouter = require("./supplier");
const saleRouter = require("./sale");
const authRouter = require("./auth");
const paymentRouter = require("./payment");
const expenseRouter = require("./expense");

module.exports = {
  customerRouter,
  purhaseOrderRouter,
  stockRouter,
  supplierRouter,
  saleRouter,
  authRouter,
  paymentRouter,
  expenseRouter,
};
