const express = require('express');
const adminRoutes = express.Router();
const user = require('../model/user.model');
const { verifyToken } = require('../middleware/verifyToken');
const { register, login, getProfile, updateAdmin, deleteAdmin, addTask, viewAllTasks, updateTask, deleteTask, adminLogout } = require('../controller/admin.controller');

//----------ADMIN--------------

adminRoutes.post("/register", user.uploadImage, register);

adminRoutes.post("/login", login);

adminRoutes.get("/profile", verifyToken, getProfile);

adminRoutes.delete('/deleteAdmin/:id', verifyToken, deleteAdmin);

adminRoutes.put('/updateAdmin/:id', verifyToken, updateAdmin);


//----------TASK----------- 
adminRoutes.post('/addTask', verifyToken, addTask);

adminRoutes.get('/viewAllTasks', verifyToken, viewAllTasks);

adminRoutes.put('/updateTask/:id', verifyToken, updateTask);

adminRoutes.delete('/deleteTask/:id', verifyToken, deleteTask);


module.exports = adminRoutes;