import express from 'express';
import { completeTask, createTask, deleteTask, getAllTask, updateTask } from '../controllers/task.controller.js';
import isAdmin from '../middleware/admin.middleware.js' 
import authUser from '../middleware/auth.middleware.js'

const router = express.Router();

router.post('/', authUser , isAdmin , createTask);
router.post('/complete/', authUser , completeTask);
router.get('/', authUser ,isAdmin , getAllTask);
router.put('/', authUser ,isAdmin , updateTask);
router.delete('/', authUser ,isAdmin , deleteTask);

export default router;