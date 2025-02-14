const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    taskDate: {
        type: String,
        default: () => new Date().toISOString().split('T')[0]
    },
    taskAuthor: {
        type: String
    },
    alltask: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'task'
    },
}, {
    timestamps: true   
});

const task = mongoose.model("task", taskSchema);
module.exports = task;