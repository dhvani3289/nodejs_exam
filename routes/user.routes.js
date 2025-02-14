const express = require('express')
const userRoutes = express.Router();
const user = require('../model/user.model');
const task = require('../model/task.model');
const { verifyToken } = require('../middleware/verifyToken');
const { register, login, getProfile, updateUser, deleteUser, addTask, viewAllTasks, updateTask, deleteTask } = require('../controller/user.controller');

//----------USER AUTHENTICATION--------------
userRoutes.post("/register", register);

userRoutes.post("/login", login);

userRoutes.get("/profile", verifyToken, getProfile);

userRoutes.put('/updateUser/:id', verifyToken, updateUser);

userRoutes.delete('/deleteUser/:id', verifyToken, deleteUser);

// ----------TASK----------- 
userRoutes.post('/addTask', verifyToken, addTask);

userRoutes.get('/viewAllTasks', verifyToken, viewAllTasks);

userRoutes.put('/updateTask/:id', verifyToken, updateTask);

userRoutes.delete('/deleteTask/:id', verifyToken, deleteTask);


module.exports = userRoutes;