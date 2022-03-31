const express = require('express');
const router = express.Router();
const employeesdata = require('../../data/employees.json')

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

router.get('/', (req, res) => {
  res.json(employeesdata)
})

router.post('/', (req, res) => {
  res.json({
    "firstname": req.body.firstname,
    "lastname": req.body.lastname
  })
})
router.put('/', (req, res) => {
  res.json({
    "firstname": req.body.firstname,
    "lastname": req.body.lastname
  })
})
router.delete('/', (req, res) => {
  res.json({ "id": req.body.id })
})

// router
//   .route('/:id')
//   .get((req, res) => {
//     res.json({ "id": req.params.id })
//   })

router.get('/:id', (req, res) => {
  res.json({ "id": req.params.id })
})


module.exports = router