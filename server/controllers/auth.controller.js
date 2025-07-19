import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import setCookie from "../utilities/setCookie.js";

const signup = async (req,res) => { 
    try {
    const {staffId , name , email , department , password} = req.body;
    if(!staffId || !name || !email || !department || !password){
       return res.status(400).json({message:'Need All Details to Sign UP !'});
    }
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message:'Email Already Exists !'});
    };
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    const user = await User.create({
        staffId,
        name,
        email,
        department,
        password:hashedPassword
    })
    if(!user){
        return res.status(400).json({message:'User Not Created !'});        
    };
     setCookie(res,user._id,7);
    res.status(200).json({message:'User Created Successfully !'});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal Server Error'})
    }   
};


const login = async (req,res) => {
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:'Need All Details to Login !'});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:'Invalid Credentials !'});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:'Invalid Credentials !'});
        }
        setCookie(res,user._id,7);
        res.status(200).json({message:'Login Successfully !'});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal Server Error'})
    }
}

const logout = async (req, res) => { 
    try {
      res.clearCookie('jwt',{
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION",
        sameSite: process.env.NODE_ENV === "PRODUCTION" ? "None" : "Lax",
      });
      res.status(200).json({ message: 'Logout Successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
    

const check = async (req,res) => {
    try {
        const user = req.user;
        res.status(200).json({data:user})
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal Server Error'})
    }
}

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id; 

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old and New Passwords are required!' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export {
  signup,
  login,
  logout,
  check,
  changePassword
}

