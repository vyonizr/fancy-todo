const moment = require("moment")

module.exports = function dateParser(date) {
  return moment(date).format("dddd, D MMMM YYYY")
}