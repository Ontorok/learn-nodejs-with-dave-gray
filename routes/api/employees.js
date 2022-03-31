const express = require('express');
const { getAllEmployees, getEmployee, createNewEmployee, updateEmployee, deleteEmployee } = require('../../controllers/employeeController');
const router = express.Router();
const employeesdata = require('../../models/employees.json')

// router
//   .route('/')
//   .get((req, res) => {
//     res.json(employeesdata)
//   })
//   .post((req, res) => {
//     res.json({
//       "firstname": req.body.firstname,
//       "lastname": req.body.lastname
//     })
//   })
//   .put((req, res) => {
//     res.json({
//       "firstname": req.body.firstname,
//       "lastname": req.body.lastname
//     })
//   })
//   .delete((req, res) => {
//     res.json({ "id": req.body.id })
//   });

router.get('/', getAllEmployees)
router.post('/', createNewEmployee)
router.put('/', updateEmployee)
router.delete('/:id', deleteEmployee)

// router
//   .route('/:id')
//   .get((req, res) => {
//     res.json({ "id": req.params.id })
//   })

router.get('/:id', getEmployee)


module.exports = router