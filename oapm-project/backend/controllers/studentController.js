import Student from '../models/Student.js';
import Subject from '../models/Subject.js';
import Marks from '../models/Marks.js';
import Attendance from '../models/Attendance.js';
import Notification from '../models/Notification.js';
import Feedback from '../models/Feedback.js';

export const getStudentDashboard = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    
    const subjects = await Subject.find({
      _id: { $in: student.academicInfo.subjects }
    });

    const currentSem = Math.ceil(new Date().getMonth() / 6) + 1;
    const marks = await Marks.find({
      studentId: student._id,
      'academicDetails.semester': currentSem
    }).populate('subjectId', 'subjectName subjectCode');

    const recentAttendance = await Attendance.find({ studentId: student._id })
      .sort({ 'details.date': -1 })
      .limit(10);

    const notifications = await Notification.find({
      userId: req.user._id,
      'status.isRead': false
    }).sort({ createdAt: -1 }).limit(5);

    res.json({
      student,
      subjects,
      marks,
      recentAttendance,
      notifications,
      cgpa: student.academicInfo.currentCGPA,
      attendance: student.attendanceStats.overallPercentage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id })
      .populate('userId', 'name email photo');
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentSubjects = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    const subjects = await Subject.find({ _id: { $in: student.academicInfo.subjects } })
      .populate('faculty.assignedFaculty', 'name');
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentMarks = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    const semester = req.query.semester || student.semester;

    const marks = await Marks.find({
      studentId: student._id,
      'academicDetails.semester': semester
    }).populate('subjectId', 'subjectName subjectCode assessment');

    const result = marks.map(m => ({
      subjectId: m.subjectId._id,
      subjectName: m.subjectId.subjectName,
      subjectCode: m.subjectId.subjectCode,
      assessments: m.assessments,
      calculated: m.calculated
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    const subjectId = req.query.subjectId;
    const semester = req.query.semester || student.semester;

    const query = { studentId: student._id };
    if (subjectId) query.subjectId = subjectId;
    if (semester) query['academicInfo.semester'] = semester;

    const attendance = await Attendance.find(query)
      .populate('subjectId', 'subjectName subjectCode')
      .sort({ 'details.date': -1 });

    const total = attendance.length;
    const present = attendance.filter(a => a.details.status === 'Present').length;
    const absent = attendance.filter(a => a.details.status === 'Absent').length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

    res.json({
      attendance,
      summary: { total, present, absent, percentage }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentAnalytics = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });

    const allMarks = await Marks.find({ studentId: student._id })
      .populate('subjectId', 'subjectName');

    const marksTrend = allMarks.map(m => ({
      semester: m.academicDetails.semester,
      totalMarks: m.calculated.totalMarks,
      percentage: m.calculated.percentage,
      grade: m.calculated.grade,
      subject: m.subjectId?.subjectName
    }));

    const allAttendance = await Attendance.find({ studentId: student._id });
    const attendanceByMonth = allAttendance.reduce((acc, record) => {
      const month = new Date(record.details.date).toLocaleString('default', { month: 'short' });
      if (!acc[month]) acc[month] = { total: 0, present: 0 };
      acc[month].total++;
      if (record.details.status === 'Present') acc[month].present++;
      return acc;
    }, {});

    const attendanceTrend = Object.entries(attendanceByMonth).map(([month, data]) => ({
      month,
      percentage: ((data.present / data.total) * 100).toFixed(2)
    }));

    res.json({
      cgpa: student.academicInfo.currentCGPA,
      marksTrend,
      attendanceTrend,
      rank: student.academicInfo.rank,
      backlogs: student.academicInfo.backlogs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      'status.isRead': true,
      'status.readAt': new Date()
    });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitFeedback = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    const feedbackCount = await Feedback.countDocuments();

    const ratings = req.body.ratings || {};
    const overall = (
      (ratings.teaching || 0) +
      (ratings.communication || 0) +
      (ratings.knowledge || 0) +
      (ratings.availability || 0) +
      (ratings.fairness || 0)
    ) / 5;

    const feedback = new Feedback({
      feedbackId: `FB${String(feedbackCount + 1).padStart(5, '0')}`,
      provider: {
        studentId: student._id,
        isAnonymous: req.body.isAnonymous || false,
        displayName: req.body.isAnonymous ? undefined : req.user.name
      },
      target: {
        facultyId: req.body.facultyId,
        subjectId: req.body.subjectId,
        semester: student.semester
      },
      ratings: { ...ratings, overall: parseFloat(overall.toFixed(1)) },
      qualitative: req.body.qualitative,
      courseSpecific: req.body.courseSpecific,
      academicYear: '2024-25'
    });

    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
