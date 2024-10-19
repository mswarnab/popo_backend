const express = require("express");
const app = express();
// This middleware is used to decode the body data to JSON format, without this req.body will be undefined
app.use(express.json());
module.exports = app;
