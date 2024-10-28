const app = require("./appExpress");

const dotenv = require("dotenv").config();

const {
  customerRouter,
  purhaseOrderRouter,
  stockRouter,
  saleRouter,
  supplierRouter,
  authRouter,
} = require("./routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectMongo = require("./repository/connection");
const dayjs = require("dayjs");
const { routes } = require("./static");
const validateAuthorization = require("./middleware/auth");

app.use(
  cors({ origin: "https://titirpetshop.onrender.com/", credentials: true })
);
app.use(cookieParser());

app.use(validateAuthorization);

app.use(routes.AUTH, authRouter);
app.use(routes.STOCK, stockRouter);
app.use(routes.CUSTOMER, customerRouter);
app.use(routes.PURCHASEORDER, purhaseOrderRouter);
app.use(routes.SALES, saleRouter);
app.use(routes.SUPPLIER, supplierRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${process.env.PORT}`);
  connectMongo();
  // app.emit("demo", { name: "swarnab" });
});
