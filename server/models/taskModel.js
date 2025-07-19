import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: [true, 'Task name is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Task name must be at least 3 characters'],
        maxlength: [100, 'Task name must be less than 100 characters']
    },
    taskDescription: {
        type: String,
        required: [true, 'Task description is required'],
        trim: true,
        minlength: [5, 'Task description must be at least 5 characters'],
        maxlength: [1000, 'Task description must be less than 1000 characters']
    },
    assignedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    pendingUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    completedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    assignedDate: {
        type: Date,
        required: [true, 'Assigned date is required'],
        default: () => new Date()
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date is required'],
        validate: {
            validator: function(value) {
                return value >= this.assignedDate;
            },
            message: 'Due date must be after assigned date'
        }
    }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;
