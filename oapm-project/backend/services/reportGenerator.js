import Student from '../models/Student.js';
import Marks from '../models/Marks.js';
import Attendance from '../models/Attendance.js';

export const generateStudentReport = async (studentId) => {
  try {
    const student = await Student.findById(studentId).populate('userId', 'name email');
    const marks = await Marks.find({ studentId })
      .populate('subjectId', 'subjectName subjectCode');
    const attendance = await Attendance.find({ studentId })
      .populate('subjectId', 'subjectName');

    const attendanceBySubject = {};
    attendance.forEach(record => {
      const subId = record.subjectId._id.toString();
      if (!attendanceBySubject[subId]) {
        attendanceBySubject[subId] = { total: 0, present: 0 };
      }
      attendanceBySubject[subId].total++;
      if (record.details.status === 'Present') {
        attendanceBySubject[subId].present++;
      }
    });

    const subjectAttendance = Object.entries(attendanceBySubject).map(([subId, data]) => ({
      subjectId: subId,
      subjectName: attendance.find(a => a.subjectId._id.toString() === subId)?.subjectId.subjectName,
      percentage: ((data.present / data.total) * 100).toFixed(2),
      present: data.present,
      total: data.total
    }));

    const marksBySemester = {};
    marks.forEach(m => {
      const sem = m.academicDetails.semester;
      if (!marksBySemester[sem]) marksBySemester[sem] = [];
      marksBySemester[sem].push({
        subject: m.subjectId?.subjectName,
        marks: m.calculated.totalMarks,
        grade: m.calculated.grade,
        percentage: m.calculated.percentage
      });
    });

    const totalPresent = attendance.filter(a => a.details.status === 'Present').length;
    const overallAttendance = attendance.length > 0 
      ? ((totalPresent / attendance.length) * 100).toFixed(2) 
      : 0;

    return {
      student: {
        name: student.userId?.name,
        studentId: student.studentId,
        registerNumber: student.registerNumber,
        department: student.department,
        year: student.year,
        semester: student.semester,
        email: student.userId?.email
      },
      academicSummary: {
        currentCGPA: student.academicInfo.currentCGPA,
        previousSemCGPA: student.academicInfo.previousSemesterCGPA,
        rank: student.academicInfo.rank,
        backlogs: student.academicInfo.backlogs
      },
      attendance: {
        overall: overallAttendance,
        bySubject: subjectAttendance
      },
      marks: marksBySemester,
      generatedAt: new Date()
    };
  } catch (error) {
    console.error('Report generation error:', error);
    return null;
  }
};

export const generateBatchReport = async (department, year, batch) => {
  try {
    const students = await Student.find({ department, year, batch });
    const studentIds = students.map(s => s._id);

    const marks = await Marks.find({ studentId: { $in: studentIds } });
    const attendance = await Attendance.find({ studentId: { $in: studentIds } });

    const batchStats = {
      totalStudents: students.length,
      avgCGPA: 0,
      avgAttendance: 0,
      passRate: 0,
      topPerformers: [],
      atRiskStudents: []
    };

    const studentPerformance = students.map(student => {
      const studentMarks = marks.filter(m => m.studentId.toString() === student._id.toString());
      const avgMarks = studentMarks.length > 0
        ? studentMarks.reduce((sum, m) => sum + m.calculated.percentage, 0) / studentMarks.length
        : 0;

      const studentAttendance = attendance.filter(a => a.studentId.toString() === student._id.toString());
      const attPercent = studentAttendance.length > 0
        ? (studentAttendance.filter(a => a.details.status === 'Present').length / studentAttendance.length) * 100
        : 0;

      return {
        studentId: student.studentId,
        name: student.userId?.name,
        avgMarks,
        attendance: attPercent,
        riskLevel: avgMarks < 50 || attPercent < 75 ? 'high' : avgMarks < 60 || attPercent < 80 ? 'medium' : 'low'
      };
    });

    batchStats.avgCGPA = (studentPerformance.reduce((sum, s) => sum + s.avgMarks, 0) / students.length).toFixed(2);
    batchStats.avgAttendance = (studentPerformance.reduce((sum, s) => sum + s.attendance, 0) / students.length).toFixed(2);
    batchStats.passRate = ((studentPerformance.filter(s => s.avgMarks >= 40).length / students.length) * 100).toFixed(2);
    
    batchStats.topPerformers = studentPerformance
      .sort((a, b) => b.avgMarks - a.avgMarks)
      .slice(0, 10);
    
    batchStats.atRiskStudents = studentPerformance
      .filter(s => s.riskLevel === 'high')
      .sort((a, b) => a.avgMarks - b.avgMarks);

    return batchStats;
  } catch (error) {
    console.error('Batch report error:', error);
    return null;
  }
};

export const exportToCSV = (data, filename) => {
  const headers = Object.keys(data[0] || {});
  const csvRows = [
    headers.join(','),
    ...data.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','))
  ];
  return csvRows.join('\n');
};
