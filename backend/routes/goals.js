const express = require('express')
const { createGoal, getGoals, deleteGoal, updateGoal, getGoal } = require('../controllers/goalsController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()
router.use(requireAuth)

//GET all goals.
router.get('/', getGoals)

//GET a single goals.
router.get('/:id', getGoal)

//POST a single goal.
router.post('/', createGoal)

//DELETE a goal.
router.delete('/:id', deleteGoal)

//UPDATE a single goal.
router.put('/:id', updateGoal)


module.exports = router