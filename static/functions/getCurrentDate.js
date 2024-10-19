const dayjs = require("dayjs");

const getCurrentDate = dayjs().format("YYYYMMDD");
module.exports = getCurrentDate;
