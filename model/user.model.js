const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const userSchema = mongoose.Schema({
    adminImage: {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "user"]
    },
    contactNo: {
        type: String,
        required: true
    },
    task: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'task'
    }],
}, {
    timestamps: true
});

const userStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "uploads/admin"));
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}`);
    }
});

userSchema.statics.uploadImage = multer({ storage: userStorage }).single('adminImage');
const user = mongoose.model("user", userSchema);
module.exports = user;