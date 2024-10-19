const { httpCodes } = require("../static");
const ErrorObject = require("../static/classes/errorObject");
const ResponseObject = require("../static/classes/ResponseObject");
const generateToken = require("../static/functions/generateToken");

const router = require("express").Router();

router.post("/", async (req, res) => {
  const {
    user: { userName, password },
  } = req.body;
  console.log(req.baseUrl);
  if (
    userName &&
    password &&
    userName == process.env.appUserName &&
    password == process.env.userPassword
  ) {
    const token = generateToken(userName);

    return res
      .header("x-auth-token", token)
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
});

module.exports = router;
