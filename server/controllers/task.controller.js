import Task from '../models/taskModel.js';
import User from '../models/userModel.js';
import sendMail from '../Mailer/mailer.js';
import ExcelJS from 'exceljs';

const isNonEmptyString = (val, min = 1, max = 1000) =>
    typeof val === 'string' && val.trim().length >= min && val.trim().length <= max;

const isValidDate = (date) => !isNaN(Date.parse(date));

const isObjectIdArray = (arr) => Array.isArray(arr) && arr.every(id => typeof id === 'string' && id.length === 24);


const getAllTask = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate('assignedUsers', 'name email')
            .populate('pendingUsers', 'name email')
            .populate('completedUsers', 'name email');
        return res.status(200).json(tasks);
    } catch (error) {
        console.log(`error in Task controller \n ${error.message}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


const createTask = async (req, res) => {
    try {
        const { taskName, taskDescription, assignedUsers, dueDate } = req.body;

        
        if (!isNonEmptyString(taskName, 3, 100)) {
            return res.status(400).json({ error: 'Task name must be 3-100 characters' });
        }
        if (!isNonEmptyString(taskDescription, 5, 1000)) {
            return res.status(400).json({ error: 'Task description must be 5-1000 characters' });
        }
        if (!isObjectIdArray(assignedUsers)) {
            return res.status(400).json({ error: 'assignedUsers must be a valid array of user IDs' });
        }
        if (!isValidDate(dueDate)) {
            return res.status(400).json({ error: 'Invalid due date format' });
        }
        const isExistingTask = await Task.find({taskName});
        if(isExistingTask.length){
            return res.status(400).json({ error: 'Task Name Already Exists' });
        }
        const assignedDate = new Date();
        const due = new Date(dueDate);
        if (due < assignedDate) {
            return res.status(400).json({ error: 'Due date must be after assigned date' });
        }

        const newTask = await Task.create({
            taskName: taskName.trim(),
            taskDescription: taskDescription.trim(),
            assignedUsers,
            pendingUsers: assignedUsers,
            dueDate,
        });

        await User.updateMany(
            { _id: { $in: assignedUsers } },
            {
                $addToSet: {
                    assignedTask: newTask._id,
                    pendingTask: newTask._id,
                }
            }
        );

        const users = await User.find({ _id: { $in: assignedUsers } });
        for (const user of users) {
            await sendMail({
                to: user.email,
                subject: `📝 New Task Assigned: ${taskName}`,
                templateName: 'assigned-task',
                replacements: {
                    username: user.name,
                    taskName,
                    taskDescription,
                    dueDate: due.toDateString()
                }
            });
        }

        return res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
        console.log(`error in Task controller \n ${error.message}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        if(!taskId){
            return res.status(400).json({ error: 'Need Task ID' });
        }

        const { taskName, taskDescription, dueDate } = req.body;

        const isExistingTask = await Task.find({ taskName, _id: { $ne: taskId } });

        if(isExistingTask.length){
            return res.status(400).json({ error: 'Task Name Already Exists' });
        }
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        if (taskName && !isNonEmptyString(taskName, 3, 100)) {
            return res.status(400).json({ error: 'Task name must be 3-100 characters' });
        }
        if (taskDescription && !isNonEmptyString(taskDescription, 5, 1000)) {
            return res.status(400).json({ error: 'Task description must be 5-1000 characters' });
        }
        if (dueDate) {
            if (!isValidDate(dueDate)) {
                return res.status(400).json({ error: 'Invalid due date format' });
            }
            if (new Date(dueDate) < task.assignedDate) {
                return res.status(400).json({ error: 'Due date must be after assigned date' });
            }
        }

        if (taskName) task.taskName = taskName.trim();
        if (taskDescription) task.taskDescription = taskDescription.trim();
        if (dueDate) task.dueDate = new Date(dueDate);

        await task.save();

        return res.status(200).json({ message: 'Task updated', task });
    } catch (error) {
        console.log(`error in Task controller \n ${error.message}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        if(!taskId){
            return res.status(400).json({ error: 'Need Task ID' });
        }
        const task = await Task.findByIdAndDelete(taskId);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        await User.updateMany(
            { _id: { $in: [...task.assignedUsers, ...task.pendingUsers, ...task.completedUsers] } },
            {
                $pull: {
                    assignedTask: taskId,
                    pendingTask: taskId,
                    completedTask: taskId
                }
            }
        );

        return res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
        console.log(`error in Task controller \n ${error.message}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


const completeTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        if(!taskId){
            return res.status(400).json({ error: 'Need Task ID' });
        }
        const {userId} = req.body;
        if(!userId){
            return res.status(400).json({ error: 'Need User ID' });
        }
        const task = await Task.findById(taskId);
        const user = await User.findById(userId);
        console.log(userId,taskId);
        
        if (!task || !user) {
            return res.status(404).json({ error: 'Task or User not found' });
        }

        if (!task.pendingUsers.includes(userId)) {
            return res.status(400).json({ error: 'User has not been assigned or already completed this task' });
        }

        task.pendingUsers.pull(userId);
        task.completedUsers.addToSet(userId);
        await task.save();

        user.pendingTask.pull(taskId);
        user.completedTask.addToSet(taskId);
        await user.save();

        await sendMail({
            to: user.email,
            subject: `✅ Task Completed: ${task.taskName}`,
            templateName: 'completed-task',
            replacements: {
                username: user.name,
                taskName: task.taskName,
                taskDescription:task.taskDescription,
                completedDate: new Date().toDateString()
            }
        });
        return res.status(200).json({ message: 'Task marked as completed' });
    } catch (error) {
        console.log(`error in Task controller \n ${error}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getTaskById = async (req, res) => {
    try {
        const { taskId } = req.params;

        const task = await Task.findById(taskId)
            .populate('pendingUsers', 'staffId name email')
            .populate('completedUsers', 'staffId name email');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const pendingUsers = task.pendingUsers.map(user => ({
            _id:user._id,
            staffId: user.staffId,
            name: user.name,
            email: user.email,
            status: 'pending'
        }));

        const completedUsers = task.completedUsers.map(user => ({
            _id:user._id,
            staffId: user.staffId,
            name: user.name,
            email: user.email,
            status: 'completed'
        }));

        const allUsers = [...pendingUsers, ...completedUsers];

        res.status(200).json({
            taskName: task.taskName,
            taskDescription: task.taskDescription,
            assignedDate: task.assignedDate,
            dueDate: task.dueDate,
            users: allUsers
        });
    } catch (error) {
        console.error('Error in Task Controller:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};


const downloadTaskReport = async (req, res) => {
    try {
        const tasks = await Task.find()
        .populate('assignedUsers', 'name email')
        .populate('pendingUsers', 'name email')
        .populate('completedUsers', 'name email');
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Task Report');
        
    worksheet.columns = [
        { header: 'Task Name', key: 'taskName', width: 30 },
        { header: 'Description', key: 'taskDescription', width: 40 },
        { header: 'Assigned Users', key: 'assignedUsers', width: 30 },
        { header: 'Pending Users', key: 'pendingUsers', width: 30 },
        { header: 'Completed Users', key: 'completedUsers', width: 30 },
        { header: 'Assigned Date', key: 'assignedDate', width: 20 },
        { header: 'Due Date', key: 'dueDate', width: 20 },
    ];
    
    tasks.forEach(task => {
        const row = worksheet.addRow({
            taskName: task.taskName,
            taskDescription: task.taskDescription,
            assignedUsers: task.assignedUsers.map(u => u.name).join(', '),
            pendingUsers: task.pendingUsers.map(u => u.name).join(', '),
            completedUsers: task.completedUsers.map(u => u.name).join(', '),
            assignedDate: task.assignedDate?.toDateString() || 'N/A',
            dueDate: task.dueDate?.toDateString() || 'N/A',
        });
        
        row.getCell(5).font = {
            color: { argb: 'FF008000' },
            bold: true,
        };
    });
    
    worksheet.getRow(1).font = { bold: true };
    
    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=task_report.xlsx');
    
    await workbook.xlsx.write(res);
    res.end();
} catch (error) {
    console.error(`Error generating Excel report: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
}
};

const taskReportById =async (req, res) => {
    try {
        const { taskId } = req.params;

        const task = await Task.findById(taskId)
            .populate('assignedUsers', 'name email')
            .populate('pendingUsers', 'name email')
            .populate('completedUsers', 'name email');

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Task Report');

        // Define header and corresponding row
        const data = [
            ['Task Name', task.taskName],
            ['Description', task.taskDescription],
            ['Assigned Users', task.assignedUsers.map(u => `${u.name} (${u.email})`).join(', ')],
            ['Pending Users', task.pendingUsers.map(u => `${u.name} (${u.email})`).join(', ')],
            ['Completed Users', task.completedUsers.map(u => `${u.name} (${u.email})`).join(', ')],
            ['Assigned Date', task.assignedDate.toISOString().split('T')[0]],
            ['Due Date', task.dueDate.toISOString().split('T')[0]],
        ];

        data.forEach(row => worksheet.addRow(row));

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=Task_${task._id}.xlsx`
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error('Error generating single task report:', err);
        res.status(500).json({ error: 'Failed to generate report' });
    }
};





export {
    getAllTask,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    downloadTaskReport,
    taskReportById
};