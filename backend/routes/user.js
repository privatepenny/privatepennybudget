const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

//Controller Functions
const { loginUser, forgotPassword, resetPassword, registerUser, updateUser, deleteUser } = require('../controllers/userController')

//Login Route
router.post('/login', loginUser)

//Forgot Password Route
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

//Register Route
router.post('/register', registerUser)

//Update Account Information
router.put('/settings', requireAuth, updateUser)

//Delete Account
router.delete('/delete', requireAuth, deleteUser)

module.exports = router