
const user = require('../model/user.model');
const task = require('../model/task.model');
const path = require('path');
const fs = require('fs');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

// USER REGISTRATION
exports.register = async (req, res) => {
    try {
        let findUser = await user.findOne({ email: req.body.email });
        if (!findUser) {
            let hashPassword = await bcrypt.hash(req.body.password, 10);

            req.body.role = 'user'
            let addUser = await user.create({ ...req.body, password: hashPassword });

            return res.status(201).json({ message: "User Registered Successfully.....", user: addUser });
        }
        else {
            return res.status(400).json({ message: "User Already Exist....... Please Login" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

// USER LOGIN
exports.login = async (req, res) => {
    try {
        const findUser = await user.findOne({ email: req.body.email });
        if (findUser) {
            let checkedPass = await bcrypt.compare(req.body.password, findUser.password)
            if (checkedPass) {
                let token = jwt.sign({
                    userId: findUser._id
                }, 'taskManagement');
                return res.status(200).json({ message: "Login Successful", token });
            } else {
                return res.status(400).json({ message: "Password Not Matched!!" })
            }
        } else {
            return res.status(404).json({ message: "User not Found....Please Register" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).res, json({ message: 'Server Error' })
    }
};

// USER PROFILE
exports.getProfile = (req, res) => {
    try {
        return res.json({ message: "Profile Found", user: req.user })
    } catch (error) {
        console.log(error);
        return res.json({ message: "Server Error" });
    }
};

// UPDATE USER
exports.updateUser = async (req, res) => {
    try {
        let findUser = await user.findById(req.params.id);
        if (findUser) {
            let updateUser = await user.findByIdAndUpdate(req.params.id, req.body, { new: true });
            return res.status(200).json({ message: "User updated successfully", updatedUser: updateUser });
        } else {
            return res.status(400).json({ message: "User not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
    try {
        let findUser = await user.findById(req.params.id);
        if (findUser) {
            let deleteUser = await user.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: "User Deleted Successfully", deletedUser: deleteUser });
        } else {
            return res.status(400).json({ message: "User not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

// ---------------------------------------------------------------------------
// ADD TASK
exports.addTask = async (req, res) => {
    try {
        // Ensure the logged-in user exists
        let admin = await user.findById(req.user.id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Check if the task with the same title exists 
        const findSameTask = await task.findOne({ title: req.body.title });
        if (findSameTask) {
            return res.status(400).json({ message: "Task with this title already exists" });
        }

        req.body.taskAuthor = req.user.username;
        const newTask = await task.create(req.body);
        admin.task.push(newTask._id);
        await admin.save();
        return res.status(200).json({ message: "Task added successfully", task: newTask });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// VIEW ALL TASK
exports.viewAllTasks = async (req, res) => {
    try {
        const allTask = await task.find({ taskAuthor: req.user.username });
        return res.status(200).json({ message: "All Task", task: allTask });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const findTask = await task.findById(req.params.id);
        if (findTask) {
            const updateTask = await task.findByIdAndUpdate(req.params.id, req.body, { new: true });
            return res.status(200).json({ message: "Task Updated Successfully", updatedTask: updateTask });
        } else {
            return res.status(400).json({ message: "Task Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const findTask = await task.findById(req.params.id);
        if (findTask) {
            const deleteTask = await task.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: "Task deleted successfully", deletedTask: deleteTask });
        } else {
            return res.status(400).json({ message: "Task not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};


