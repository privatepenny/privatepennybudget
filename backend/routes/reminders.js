const express = require('express')
const { createReminder, getReminders, deleteReminder, updateReminder, getReminder } = require('../controllers/reminderController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()
router.use(requireAuth)

//GET all goals.
router.get('/', getReminders)

//GET a single goals.
router.get('/:id', getReminder)

//POST a single goal.
router.post('/', createReminder)

//DELETE a goal.
router.delete('/:id', deleteReminder)

//UPDATE a single goal.
router.put('/:id', updateReminder)


module.exports = router