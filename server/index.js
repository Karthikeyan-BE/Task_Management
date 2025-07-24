import express from 'express';
import env from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './Database/connectDB.js';
import authRoute from './routes/auth.routes.js';
import taskRoute from './routes/task.routes.js';
import userRoute from './routes/user.Routes.js';
import './schedule/remainder.js'

env.config();

const app = express();
const PORT = process.env.PORT || 5000 ;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));


app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/task', taskRoute)


app.listen(PORT , ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
})