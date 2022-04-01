const express = require("express");
const ROLE_LIST = require("../../constants/roleList");
const {
  getAllEmployees,
  getEmployee,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../../controllers/employeeController");
const verifyJWT = require("../../middleware/verifyJWT");
const verifyRoles = require("../../middleware/verifyRoles");
const router = express.Router();
const employeesdata = require("../../models/employees.json");

router.get("/", getAllEmployees);
router.post(
  "/",
  verifyRoles(ROLE_LIST.Admin, ROLE_LIST.Editor),
  createNewEmployee
);
router.put("/", verifyRoles(ROLE_LIST.Admin, ROLE_LIST.Editor), updateEmployee);
router.delete("/:id", verifyRoles(ROLE_LIST.Admin), deleteEmployee);

router.get("/:id", getEmployee);

module.exports = router;
