const jwt = require("jsonwebtoken");

const generateToken = (userName) => {
  return jwt.sign({ userName }, process.env.jwtPrivateKey);
};

module.exports = generateToken;
