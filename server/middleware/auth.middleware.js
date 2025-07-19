import jwt from "jsonwebtoken";
import User from "../models/userModel.js"

const authUser = async (req,res,next) => {
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:'Unauthorized User !'});
        }
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decodedToken.id).select('-password');
        if(!user){
            return res.status(401).json({message:'Unauthorized User !'});
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal Server Error'})
    }
}


export default authUser;