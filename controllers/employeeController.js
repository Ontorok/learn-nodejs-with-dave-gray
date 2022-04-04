const { findOne } = require('../models/Employee');
const Employee = require('../models/Employee')

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  res.status(200).json(employees)
};

const getEmployee = async (req, res) => {
  const employee = await Employee.findOne({ _id: req.params.id })

  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.params.id} not found` });
  }
  res.status(200).json(employee);
};

const createNewEmployee = async (req, res) => {
  const { firstName, lastName } = req.body;
  if (!firstName || !lastName) {
    return res
      .status(400)
      .json({ message: "First and last names are required." });
  }
  const newEmployee = {
    firstName,
    lastName
  };

  const savedEmployee = await Employee.create(newEmployee)

  res.status(201).json(savedEmployee);
};

const updateEmployee = async (req, res) => {

  const { id, firstName, lastName } = req.body

  const employee = await Employee.findOne({ _id: id })
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${id} not found` });
  }

  if (firstName) employee.firstName = firstName;
  if (lastName) employee.lastName = lastName;

  const updatedEmployee = await employee.save()
  res.status(200).json(updatedEmployee);
};

const deleteEmployee = async (req, res) => {

  const employee = await Employee
    .findOne({ _id: req.params.id })
    .exec()
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.body.id} not found` });
  }
  const result = await employee.deleteOne({
    _id: req.params.id
  })
  res.status(200).json({
    message: `record deleted with the name: ${result
      .firstName}`
  });
};



module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
