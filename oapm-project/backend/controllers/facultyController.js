import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import Subject from '../models/Subject.js';
import Marks from '../models/Marks.js';
import Attendance from '../models/Attendance.js';

export const getFacultyDashboard = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ userId: req.user._id });
    const subjects = await Subject.find({ 'faculty.assignedFaculty': faculty._id });
    
    const subjectIds = subjects.map(s => s._id);
    const studentCount = await Student.countDocuments({
      'academicInfo.subjects': { $in: subjectIds }
    });

    const currentSem = Math.ceil(new Date().getMonth() / 6) + 1;
    const recentMarks = await Marks.find({
      subjectId: { $in: subjectIds },
      'academicDetails.semester': currentSem
    }).populate('studentId', 'studentId name').limit(10);

    res.json({
      faculty,
      subjects,
      totalSubjects: subjects.length,
      totalStudents: studentCount,
      recentMarks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyStudents = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ userId: req.user._id });
    const subjects = await Subject.find({ 'faculty.assignedFaculty': faculty._id });
    const subjectIds = subjects.map(s => s._id);

    const students = await Student.find({
      'academicInfo.subjects': { $in: subjectIds }
    }).populate('userId', 'name email');

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubjectStudents = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.subjectId)
      .populate('enrolledStudents', 'studentId name userId');
    
    const studentsWithMarks = await Promise.all(
      subject.enrolledStudents.map(async (student) => {
        const marks = await Marks.findOne({
          studentId: student._id,
          subjectId: subject._id
        });
        return {
          ...student.toObject(),
          marks: marks?.calculated || null
        };
      })
    );

    res.json(studentsWithMarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const enterMarks = async (req, res) => {
  try {
    const { studentId, subjectId, assessments, academicYear, semester } = req.body;

    const existingMarks = await Marks.findOne({ studentId, subjectId });
    
    const calculateGrade = (percentage) => {
      if (percentage >= 90) return { grade: 'A+', gradePoint: 10 };
      if (percentage >= 80) return { grade: 'A', gradePoint: 9 };
      if (percentage >= 70) return { grade: 'B+', gradePoint: 8 };
      if (percentage >= 60) return { grade: 'B', gradePoint: 7 };
      if (percentage >= 50) return { grade: 'C', gradePoint: 6 };
      if (percentage >= 40) return { grade: 'D', gradePoint: 5 };
      return { grade: 'F', gradePoint: 0 };
    };

    const totalMarks = (assessments.internal1?.marks || 0) +
      (assessments.internal2?.marks || 0) +
      (assessments.assignment?.marks || 0) +
      (assessments.semesterExam?.marks || 0);

    const totalMaxMarks = 100;
    const percentage = (totalMarks / totalMaxMarks) * 100;
    const { grade, gradePoint } = calculateGrade(percentage);

    const marksData = {
      studentId,
      subjectId,
      academicDetails: {
        academicYear,
        semester,
        examType: 'Regular'
      },
      assessments,
      calculated: {
        totalMarks,
        totalMaxMarks,
        percentage: parseFloat(percentage.toFixed(2)),
        grade,
        gradePoint,
        status: percentage >= 40 ? 'Pass' : 'Fail'
      },
      metadata: {
        enteredBy: req.user._id,
        enteredAt: new Date(),
        isPublished: true
      }
    };

    if (existingMarks) {
      const updated = await Marks.findByIdAndUpdate(
        existingMarks._id,
        { ...marksData, updatedAt: new Date() },
        { new: true }
      );
      res.json(updated);
    } else {
      const marksCount = await Marks.countDocuments();
      marksData.marksId = `MRK${String(marksCount + 1).padStart(5, '0')}`;
      const newMarks = new Marks(marksData);
      await newMarks.save();
      res.json(newMarks);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { studentId, subjectId, date, status, session, period, remarks } = req.body;
    const faculty = await Faculty.findOne({ userId: req.user._id });

    const attendanceData = {
      studentId,
      subjectId,
      details: {
        date: new Date(date),
        status,
        session,
        period,
        remarks
      },
      metadata: {
        markedBy: faculty._id,
        markedAt: new Date(),
        method: 'Manual'
      },
      academicInfo: {
        academicYear: req.body.academicYear || '2024-25',
        semester: req.body.semester || 1
      }
    };

    const existingAttendance = await Attendance.findOne({
      studentId,
      subjectId,
      'details.date': new Date(date)
    });

    if (existingAttendance) {
      const updated = await Attendance.findByIdAndUpdate(
        existingAttendance._id,
        { ...attendanceData, updatedAt: new Date() },
        { new: true }
      );
      res.json(updated);
    } else {
      const attendanceCount = await Attendance.countDocuments();
      attendanceData.attendanceId = `ATT${String(attendanceCount + 1).padStart(5, '0')}`;
      const newAttendance = new Attendance(attendanceData);
      await newAttendance.save();
      res.json(newAttendance);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const bulkMarkAttendance = async (req, res) => {
  try {
    const { subjectId, date, records, academicYear, semester } = req.body;
    const faculty = await Faculty.findOne({ userId: req.user._id });

    const attendanceRecords = records.map(record => ({
      studentId: record.studentId,
      subjectId,
      details: {
        date: new Date(date),
        status: record.status,
        session: record.session,
        period: record.period
      },
      metadata: {
        markedBy: faculty._id,
        markedAt: new Date(),
        method: 'Manual'
      },
      academicInfo: {
        academicYear,
        semester
      }
    }));

    for (const record of attendanceRecords) {
      const existing = await Attendance.findOne({
        studentId: record.studentId,
        subjectId,
        'details.date': record.details.date
      });

      if (existing) {
        await Attendance.findByIdAndUpdate(existing._id, record);
      } else {
        const attendanceCount = await Attendance.countDocuments();
        record.attendanceId = `ATT${String(attendanceCount + 1).padStart(5, '0')}`;
        await new Attendance(record).save();
      }
    }

    res.json({ message: 'Attendance marked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttendanceReport = async (req, res) => {
  try {
    const { subjectId, startDate, endDate } = req.query;
    
    const attendance = await Attendance.find({
      subjectId,
      'details.date': {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).populate('studentId', 'studentId name');

    const summary = attendance.reduce((acc, record) => {
      const status = record.details.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    res.json({ attendance, summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
