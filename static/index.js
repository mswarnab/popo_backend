module.exports = {
  productCategory: ["MEDICINE", "FOOD", "ACCESSORIES"],
  modeOfPayment: ["CASH", "CARD", "ONLINE"],
  httpCodes: {
    INTERNAL_SERVER_ERROR: 500,
    OK: 200,
    FORBIDDEN: 403,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
  },
  routes: {
    AUTH: "/auth",
    SALES: "/sales",
    STOCK: "/stock",
    PURCHASEORDER: "/purchaseorder",
    CUSTOMER: "/customer",
    SUPPLIER: "/supplier",
    PAYMENT: "/payment",
  },
  paymentPartner: ["CUSTOMER", "SUPPLIER", "EXPENSE"],
};
