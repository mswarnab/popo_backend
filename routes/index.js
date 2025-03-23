const customerRouter = require("./customer");
const purhaseOrderRouter = require("./purchaseOrder");
const stockRouter = require("./stock");
const supplierRouter = require("./supplier");
const saleRouter = require("./sale");
const authRouter = require("./auth");
const paymentRouter = require("./payment");
const expenseRouter = require("./expense");
const reportRouter = require("./report");

module.exports = {
  customerRouter,
  purhaseOrderRouter,
  stockRouter,
  reportRouter,
  supplierRouter,
  saleRouter,
  authRouter,
  paymentRouter,
  expenseRouter,
};
