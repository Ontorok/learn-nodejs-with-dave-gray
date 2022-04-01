const express = require("express");
const {
  getAllEmployees,
  getEmployee,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../../controllers/employeeController");
const verifyJWT = require("../../middleware/verifyJWT");
const router = express.Router();
const employeesdata = require("../../models/employees.json");

router.get("/", getAllEmployees);
router.post("/", createNewEmployee);
router.put("/", updateEmployee);
router.delete("/:id", deleteEmployee);

router.get("/:id", getEmployee);

module.exports = router;
