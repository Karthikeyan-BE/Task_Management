import User from "../models/userModel.js";
const isAdmin = async (req,res,next) => { 
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        if(!user){
            return res.status(401).json({message:'Unauthorized User !'});
        }
        if(user.role !== 'admin'){
            return res.status(401).json({message:'Need Admin Access!'});
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal Server Error'})
    }
}

export default isAdmin;