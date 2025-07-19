import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const DB_URI = process.env.MONGODB_URI;
        const con = await mongoose.connect(DB_URI);
        console.log(`Database Connected Successfully ${con.connection.host}`);  
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

export default connectDB;