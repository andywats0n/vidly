const config = require("config");
const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function() {
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
  }
};
