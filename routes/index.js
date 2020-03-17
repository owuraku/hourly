const attendance = require("./attendance-routes");
const common = require("./common-routes");
const user = require("./user-routes");

module.exports.attendanceRoutes = attendance;
module.exports.commonRoutes = common;
module.exports.userRoutes = user;
