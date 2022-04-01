const rootRoute = require("./root");
const employeesRoute = require("./api/employees");
const registerRoute = require("./register");
const authRoute = require("./auth");
const refreshRoute = require("./refresh");
const logoutRoute = require("./logout");

module.exports = {
  rootRoute,
  employeesRoute,
  registerRoute,
  authRoute,
  refreshRoute,
  logoutRoute,
};
