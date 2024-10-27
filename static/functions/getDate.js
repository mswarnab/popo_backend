const dayjs = require("dayjs");

const getCurrentDate = dayjs().format("YYYYMMDD");

const formatDate = (date) => {
  return dayjs(date).format("YYYYMMDD");
};
module.exports = { getCurrentDate, formatDate };
