import express from 'express';
import { allUser, deleteUser, getuserByDepartment, newUser, searchUser, UpdateUser } from '../Controllers/user.controller.js';
import authUser from '../middleware/auth.middleware.js'
import isAdmin from '../middleware/admin.middleware.js';

const router = express.Router();

router.post('/create', authUser, isAdmin, newUser);

router.patch('/update/:userId', authUser, isAdmin, UpdateUser);

router.delete('/delete/:userId', authUser, isAdmin, deleteUser);

router.get('/all', authUser, isAdmin, allUser);

router.get('/search', authUser,isAdmin, searchUser);

router.get('/department/:department', authUser, isAdmin ,getuserByDepartment);

export default router;
