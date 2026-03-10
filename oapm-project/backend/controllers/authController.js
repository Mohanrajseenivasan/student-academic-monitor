import User from '../models/User.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import { generateToken } from '../middleware/auth.js';

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Please provide email, password and role' });
    }

    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(400).json({ message: 'Account is deactivated' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    let profile = null;
    if (role === 'student') {
      profile = await Student.findOne({ userId: user._id });
    } else if (role === 'faculty') {
      profile = await Faculty.findOne({ userId: user._id });
    }

    res.json({
      token,
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo
      },
      profile
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const userCount = await User.countDocuments();
    const prefix = role === 'admin' ? 'ADM' : role === 'faculty' ? 'FAC' : 'STU';
    const userId = `${prefix}${String(userCount + 1).padStart(3, '0')}`;

    const user = new User({
      userId,
      email,
      password,
      name,
      role
    });

    await user.save();

    if (role === 'student') {
      const studentCount = await Student.countDocuments();
      const newStudent = new Student({
        studentId: `STU2024${String(studentCount + 1).padStart(4, '0')}`,
        userId: user._id,
        department: req.body.department || 'CSE',
        year: req.body.year || 1,
        semester: req.body.semester || 1,
        batch: req.body.batch || '2024-2028'
      });
      await newStudent.save();
    } else if (role === 'faculty') {
      const facultyCount = await Faculty.countDocuments();
      const newFaculty = new Faculty({
        facultyId: `FAC2024${String(facultyCount + 1).padStart(3, '0')}`,
        userId: user._id,
        professionalInfo: {
          department: req.body.department || 'CSE',
          designation: req.body.designation || 'Assistant Professor'
        }
      });
      await newFaculty.save();
    }

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
