const jwt = require("jsonwebtoken");
const ErrorObject = require("../static/classes/errorObject");
const { httpCodes, routes } = require("../static");

const validateAuthorization = (req, res, next) => {
  try {
    if (req.url == routes.AUTH) {
      return next();
    }
    if (!process.env.jwtPrivateKey) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .send(
          new ErrorObject(
            httpCodes.INTERNAL_SERVER_ERROR,
            "AUTH01",
            "Signature is not set",
            "/",
            req.url,
            req.method,
            null
          )
        );
    }

    // const token = req.headers["x-auth-token"];
    const token = req.cookies.x_auth_token;
    if (!token) {
      return res
        .status(httpCodes.UNAUTHORIZED)
        .send(
          new ErrorObject(
            httpCodes.UNAUTHORIZED,
            "AUTH02",
            "User is unauthorized - token not provided",
            "/",
            req.url,
            req.method,
            null
          )
        );
    }

    const payload = jwt.verify(token, process.env.jwtPrivateKey);
    req.user = payload;
    return next();
  } catch (error) {
    return res
      .status(httpCodes.UNAUTHORIZED)
      .send(
        new ErrorObject(
          httpCodes.UNAUTHORIZED,
          "AUTH03",
          "User is unauthorized - Invalid token provided",
          "/",
          req.url,
          req.method,
          null
        )
      );
  }
};

module.exports = validateAuthorization;
