const { httpCodes } = require("../static");
const ErrorObject = require("../static/classes/errorObject");
const ResponseObject = require("../static/classes/ResponseObject");
const generateToken = require("../static/functions/generateToken");
const jwt = require("jsonwebtoken");

const router = require("express").Router();

router.get("/", (req, res) => {
  try {
    if (!process.env.jwtPrivateKey) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .send(
          new ErrorObject(
            httpCodes.INTERNAL_SERVER_ERROR,
            "AUTH04",
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
            "AUTH05",
            "User is unauthorized - token not provided",
            "/",
            req.url,
            req.method,
            null
          )
        );
    }

    const payload = jwt.verify(token, process.env.jwtPrivateKey);
    const userName = payload.userName;
    return res
      .status(httpCodes.OK)
      .send(
        new ResponseObject(
          httpCodes.OK,
          req.method,
          "User is successfully logged in",
          "auth",
          req.url,
          userName
        )
      );
  } catch (error) {
    return res
      .status(httpCodes.UNAUTHORIZED)
      .send(
        new ErrorObject(
          httpCodes.UNAUTHORIZED,
          "AUTH06",
          "User is unauthorized - Invalid token provided",
          "/",
          req.url,
          req.method,
          null
        )
      );
  }
});
router.post("/login", async (req, res) => {
  try {
    const {
      user: { userName, password },
    } = req.body;
    if (
      userName &&
      password &&
      userName == process.env.appUserName &&
      password == process.env.userPassword
    ) {
      const token = generateToken(userName);

      return res
        .cookie("x_auth_token", token, {
          httpOnly: true,
          maxAge: 86400000,
          secure: true,

          // Ensures the cookie is sent over HTTPS
          // sameSite: "none", // Allow cross-site cookies
        })
        .status(httpCodes.OK)
        .send(
          new ResponseObject(
            httpCodes.OK,
            req.method,
            "User is successfully logged in",
            "auth",
            req.url,
            userName
          )
        );
    }
    return res
      .status(httpCodes.BAD_REQUEST)
      .send(
        new ErrorObject(
          httpCodes.BAD_REQUEST,
          "AUTH04",
          "Invalid Username or password provided",
          "/",
          req.url,
          req.method,
          null
        )
      );
  } catch (error) {
    console.log(error);
    return res
      .status(httpCodes.UNAUTHORIZED)
      .send(
        new ErrorObject(
          httpCodes.UNAUTHORIZED,
          "AU010",
          "User is unauthorized - Invalid token provided",
          "/",
          req.url,
          req.method,
          null
        )
      );
  }
});
router.post("/logout", (req, res) => {
  try {
    return res
      .clearCookie("x_auth_token")
      .status(httpCodes.OK)
      .send(
        new ResponseObject(
          httpCodes.OK,
          req.method,
          "User is successfully logged out",
          "auth",
          req.url,
          null
        )
      );
  } catch (error) {
    return res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .send(
        new ErrorObject(
          httpCodes.INTERNAL_SERVER_ERROR,
          "AUTH09",
          "Something Went wrong",
          "/",
          req.url,
          req.method,
          error
        )
      );
  }
});
module.exports = router;
