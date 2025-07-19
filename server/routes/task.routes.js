import express from 'express';
import { completeTask, createTask, deleteTask, getAllTask, updateTask } from '../controllers/task.controller.js';
import isAdmin from '../middleware/admin.middleware.js' 
import authUser from '../middleware/auth.middleware.js'

const router = express.Router();

router.get('/', authUser ,isAdmin , getAllTask);
router.post('/', authUser , isAdmin , createTask);
router.put('/:taskId', authUser ,isAdmin , updateTask);
router.post('/complete/:taskId', authUser , completeTask);
router.delete('/', authUser ,isAdmin , deleteTask);

export default router;