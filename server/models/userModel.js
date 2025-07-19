import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    staffId: {
        type: String,
        required: [true, 'Staff ID is required'],
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [100, 'Name must be less than 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    department: {
        type: String,
        enum: [
            'Aeronautical Engineering',
            'Agricultural Engineering',
            'Artificial Intelligence & Data Science',
            'Biomedical Engineering',
            'Civil Engineering',
            'Computer Science and Business System',
            'Computer Science & Engineering',
            'Electrical and Electronics Engineering',
            'Electronics & Communication Engineering',
            'Food Technology',
            'Information Technology',
            'Mechanical Engineering',
            'Petrochemical Technology',
            'Safety & Fire Engineering',
            'Science & Humanities'
        ],
        required: [true, 'Department is required']
    },
    role: {
        type: String,
        enum: ['admin', 'staff'],
        default: 'staff',
        required: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    assignedTask: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        default: []
    }],
    pendingTask: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        default: []
    }],
    completedTask: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        default: []
    }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
