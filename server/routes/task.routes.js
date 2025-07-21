import express from 'express';
import { completeTask, createTask, deleteTask, downloadTaskReport, getAllTask, getTaskById, taskReportById, updateTask } from '../controllers/task.controller.js';
import isAdmin from '../middleware/admin.middleware.js' 
import authUser from '../middleware/auth.middleware.js'

const router = express.Router();

router.get('/', authUser ,isAdmin , getAllTask);

router.get('/:taskId', authUser ,isAdmin , getTaskById);

router.get('/report', authUser ,isAdmin ,downloadTaskReport);

router.get('/report/:taskId', authUser ,isAdmin , taskReportById);

router.post('/', authUser , isAdmin , createTask);

router.put('/:taskId', authUser ,isAdmin , updateTask);

router.patch('/complete/:taskId', authUser , completeTask);

router.delete('/:taskId', authUser ,isAdmin , deleteTask);

export default router;