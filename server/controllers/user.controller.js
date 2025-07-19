import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

const newUser = async (req, res) => {
  try {
    const { staffId, name, email, department} = req.body;

    if (!staffId || !name || !email || !department) {
      return res.status(400).json({ message: 'Need All Details to Create User!' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email Already Exists!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(staffId, salt);

    const user = await User.create({
      staffId,
      name,
      email,
      department,
      password: hashedPassword
    });

    if (!user) {
      return res.status(400).json({ message: 'User Not Created!' });
    }

    res.status(200).json({ message: 'User Created Successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const UpdateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { staffId, name, email, department, role } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required!' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { staffId, name, email, department, role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User Not Found!' });
    }

    res.status(200).json({ message: 'User Updated Successfully!', data: updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User Not Found!' });
    }

    res.status(200).json({ message: 'User Deleted Successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const allUser = async (req, res) => {
  try {
    const users = await User.find().populate('assignedTask').populate('completedTask');

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No Users Found!' });
    }

    res.status(200).json({ data: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const searchUser = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required!' });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { staffId: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    });

    res.status(200).json({ data: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getuserByDepartment = async (req, res) => {
  try {
    const { department } = req.params;

    if (!department) {
      return res.status(400).json({ message: 'Department is required!' });
    }

    const users = await User.find({ department });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No Users Found in this Department!' });
    }

    res.status(200).json({ data: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export {
  newUser,
  UpdateUser,
  deleteUser,
  allUser,
  searchUser,
  getuserByDepartment
};
