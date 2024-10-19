module.exports = {
  productCategory: [
    "MEDICINE",
    "DOGFOOD",
    "TOYS",
    "ACCESSORIES",
    "CATFOOD",
    "SHAMPOO",
    "TREATS",
  ],
  httpCodes: {
    INTERNAL_SERVER_ERROR: 500,
    OK: 200,
    FORBIDDEN: 403,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
  },
  routes: {
    AUTH: "/login",
    SALES: "/sales",
    STOCK: "/stock",
    PURCHASEORDER: "/purchaseorder",
    CUSTOMER: "/customer",
    SUPPLIER: "/supplier",
  },
};
