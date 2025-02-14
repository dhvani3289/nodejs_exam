
const user = require('../model/user.model');
const task = require('../model/task.model');
const path = require('path');
const fs = require('fs');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

// ADMIN REGISTRATION
exports.register = async (req, res) => {
    try {
        const findAdmin = await user.findOne({ email: req.body.email });
        if (findAdmin) {
            return res.status(400).json({ message: "Admin Is Already Registered!!!....Please Login" });
        } else {
            let imagePath = "";
            if (req.file) {
                imagePath = `/uploads/admin/${req.file.filename}`;
            }
            req.body.adminImage = imagePath;
            req.body.role = 'admin'
            const hashPassword = await bcrypt.hash(req.body.password, 10);
            const addAdmin = await user.create({ ...req.body, password: hashPassword });
            return res.status(200).json({ message: "User Registered Successfully", admin: addAdmin });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

// ADMIN LOGIN
exports.login = async (req, res) => {
    try {
        const findAdmin = await user.findOne({ email: req.body.email });
        if (!findAdmin) {
            return res.status(404).json({ message: "Admin Not Found" });
        }
        const checkPass = await bcrypt.compare(req.body.password, findAdmin.password)
        console.log(checkPass);
        if (checkPass) {
            let token = jwt.sign({
                userId: findAdmin._id
            }, 'taskManagement');
            console.log("Token : ", token);
            return res.status(200).json({ message: "Login Successful", token });
        } else {
            return res.status(400).json({ message: "Password Is Incorrect!!" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

// VIEW ADMIN PROFILE
exports.getProfile = (req, res) => {
    try {
        return res.json({ message: "Profile Found", admin: req.user })
    } catch (error) {
        console.log(error);
        return res.status(500).res.json({ message: "Server Error" });
    }
};

// DELETE ADMIN
exports.deleteAdmin = async (req, res) => {
    try {
        const findAdmin = await user.findById(req.params.id);
        if (findAdmin) {
            if (findAdmin.adminImage) {
                const imagePath = path.join(__dirname, "..", findAdmin.adminImage);
                fs.unlinkSync(imagePath);
            }
            const deleteAdmin = await user.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: "Admin Deleted Successfully", data: deleteAdmin });
        } else {
            return res.status(400).json({ message: "Admin not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

// UPDATE ADMIN
exports.updateAdmin = async (req, res) => {
    try {
        const findAdmin = await user.findById(req.params.id);
        if (findAdmin) {
            if (req.file) {
                const imagePath = findAdmin.adminImage;
                if (imagePath != "" && imagePath) {
                    imagePath = path.join(__dirname, "..", imagePath);
                    try {
                        fs.unlinkSync(imagePath);
                    } catch (error) {
                        console.log(error);
                        return res.status(404).res.json({ message: "File Missing...." })
                    }
                }
                req.body.adminImage = `/uploads/admin/${req.file.filename}`;
            }
            else {
                req.body.adminImage = findAdmin.adminImage
            }
            const updateAdmin = await user.findByIdAndUpdate(req.params.id, req.body, { new: true });
            return res.status(200).json({ message: "Admin updated successfully", data: updateAdmin });
        }
        else {
            return res.status(400).json({ message: "Admin Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

// ---------------------------------------------------------------------------

// ADD TASK (ADMIN)
exports.addTask = async (req, res) => {
    try {
        let findAdmin = await user.findById(req.params.id);
        const findSameTask = await task.findOne({ title: req.body.title });
        if (!findSameTask) {
            req.body.taskAuthor = req.user.username;
            const addTask = await task.create(req.body);
            return res.status(200).json({ message: "Task added successfully", task: addTask });
        } else {
            return res.status(400).json({ message: "Task already added" });
        }
    } catch (error) {
        console.log(error);
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

// UPDATE TASK
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

// DELETE TASK
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


