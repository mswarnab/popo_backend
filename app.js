const app = require("./appExpress");

const dotenv = require("dotenv").config();

const {
  customerRouter,
  purhaseOrderRouter,
  stockRouter,
  saleRouter,
  supplierRouter,
  authRouter,
  paymentRouter,
  expenseRouter,
  reportRouter,
} = require("./routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectMongo = require("./repository/connection");
const dayjs = require("dayjs");
const { routes } = require("./static");
const validateAuthorization = require("./middleware/auth");

// const corsOptions = {
//   origin: "https://titirpetshop.onrender.com/",
//   credentials: true,
//   optionsSuccessStatus: 204,
// };

app.use(
  cors({
    origin: process.env.CLIENT_URL3,
    credentials: true,
  })
);
//titirpetshop-1-ez7f.vercel.app/
//
// app.use(
//   cors({
//     origin: "http://localhost:5174",
//     credentials: true,
//   })
// );
app.use(cookieParser());

// app.use(validateAuthorization);
app.use(routes.AUTH, authRouter);
app.use(routes.STOCK, stockRouter);
app.use(routes.CUSTOMER, customerRouter);
app.use(routes.PURCHASEORDER, purhaseOrderRouter);
app.use(routes.SALES, saleRouter);
app.use(routes.SUPPLIER, supplierRouter);
app.use(routes.PAYMENT, paymentRouter);
app.use(routes.EXPENSE, expenseRouter);
app.use(routes.REPORT, reportRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${process.env.PORT}`);
  connectMongo();
  // app.emit("demo", { name: "swarnab" });
});
