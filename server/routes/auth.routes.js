import express from 'express';
import { changePassword, check, login, logout, signup } from '../controllers/auth.controller.js';
import authUser from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup',signup);

router.post('/login',login);

router.post('/logout',logout);

router.get('/check',authUser ,check);

router.post('/updatePassword',authUser , changePassword);


export default router;