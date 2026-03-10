import User from '../models/User.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import Subject from '../models/Subject.js';
import Marks from '../models/Marks.js';
import Attendance from '../models/Attendance.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({ 'status.isActive': true });
    const totalFaculty = await Faculty.countDocuments({ isActive: true });
    const totalSubjects = await Subject.countDocuments({ isActive: true });
    
    const currentYear = new Date().getFullYear();
    const currentSem = Math.ceil(new Date().getMonth() / 6) + 1;

    const avgCGPA = await Student.aggregate([
      { $match: { 'status.isActive': true } },
      { $group: { _id: null, avg: { $avg: '$academicInfo.currentCGPA' } } }
    ]);

    const lowAttendance = await Attendance.aggregate([
      {
        $match: {
          'academicInfo.academicYear': `${currentYear}-${currentYear + 1}`
        }
      },
      {
        $group: {
          _id: { studentId: '$studentId', subjectId: '$subjectId' },
          total: { $sum: 1 },
          present: {
            $sum: { $cond: [{ $eq: ['$details.status', 'Present'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          percentage: { $multiply: [{ $divide: ['$present', '$total'] }, 100] }
        }
      },
      { $match: { percentage: { $lt: 75 } } },
      { $count: 'count' }
    ]);

    res.json({
      totalStudents,
      totalFaculty,
      totalSubjects,
      avgCGPA: avgCGPA[0]?.avg?.toFixed(2) || 0,
      lowAttendanceCount: lowAttendance[0]?.count || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('userId', 'name email photo');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const studentCount = await Student.countDocuments();
    
    const userId = `STU${String(userCount + 1).padStart(3, '0')}`;
    const studentId = `STU2024${String(studentCount + 1).padStart(4, '0')}`;

    const user = new User({
      userId,
      email: req.body.email,
      password: req.body.password || 'student123',
      name: req.body.name,
      role: 'student'
    });
    await user.save();

    const student = new Student({
      studentId,
      userId: user._id,
      registerNumber: req.body.registerNumber,
      department: req.body.department,
      year: req.body.year,
      semester: req.body.semester,
      batch: req.body.batch,
      section: req.body.section,
      personalInfo: req.body.personalInfo,
      parentInfo: req.body.parentInfo
    });
    await student.save();

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    await User.findByIdAndDelete(student.userId);
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find().populate('userId', 'name email photo');
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createFaculty = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const facultyCount = await Faculty.countDocuments();
    
    const userId = `FAC${String(userCount + 1).padStart(3, '0')}`;
    const facultyId = `FAC2024${String(facultyCount + 1).padStart(3, '0')}`;

    const user = new User({
      userId,
      email: req.body.email,
      password: req.body.password || 'faculty123',
      name: req.body.name,
      role: 'faculty'
    });
    await user.save();

    const faculty = new Faculty({
      facultyId,
      userId: user._id,
      professionalInfo: req.body.professionalInfo,
      contactInfo: req.body.contactInfo
    });
    await faculty.save();

    res.status(201).json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }
    await User.findByIdAndDelete(faculty.userId);
    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ message: 'Faculty deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate('faculty.assignedFaculty', 'facultyId name')
      .populate('enrolledStudents', 'studentId name');
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSubject = async (req, res) => {
  try {
    const subjectCount = await Subject.countDocuments();
    const subjectId = `SUB${String(subjectCount + 1).padStart(3, '0')}`;

    const subject = new Subject({
      subjectId,
      ...req.body
    });
    await subject.save();

    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
