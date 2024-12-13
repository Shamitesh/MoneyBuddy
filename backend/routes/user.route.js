const express = require("express")
const userController = require("../controllers/user.controller")
const isAuthenticated = require("../middlewares/isAuth")

const userRouter = express.Router()

// Register route
userRouter.post('/users/register', userController.register)

// Login route

userRouter.post('/users/login', userController.login)

// Profile route
userRouter.get('/users/profile',isAuthenticated, userController.profile)

// Change Password
userRouter.put('/users/change-password',isAuthenticated, userController.changeUserPassword)

// Route for updating user profile
userRouter.put('/users/update-profile', isAuthenticated, userController.updateUserProfile);

// Logout route
userRouter.post('/users/logout', isAuthenticated, userController.logout);  // Add the logout route


module.exports =  userRouter