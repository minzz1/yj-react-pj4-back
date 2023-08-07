"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
_mongoose["default"].connect(process.env.DB_URL);
var db = _mongoose["default"].connection;
var handleOpen = function handleOpen() {
  return console.log("\u2728 Connected to DB");
};
db.on("error", function (error) {
  return console.log("DB Error", error);
});
db.once("open", handleOpen);