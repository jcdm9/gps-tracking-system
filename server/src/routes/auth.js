const express = require('express')
const router = express.Router()
const userController = require('./../controllers/user')
const middleware = require('./../middleware/auth')

router.get('/profile', middleware.validate, userController.profile)
router.post('/signup', userController.signUp)
router.post('/signup', userController.signUp)
router.post('/login', userController.login)

module.exports = router
