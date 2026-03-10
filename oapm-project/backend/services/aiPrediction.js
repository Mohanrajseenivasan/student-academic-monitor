import Student from '../models/Student.js';
import Marks from '../models/Marks.js';
import Attendance from '../models/Attendance.js';

export const predictStudentPerformance = async (studentId) => {
  try {
    const student = await Student.findById(studentId);
    const marks = await Marks.find({ studentId }).sort({ 'academicDetails.semester': -1 }).limit(4);
    const attendance = await Attendance.find({ studentId });

    if (marks.length < 2) {
      return { prediction: 'insufficient_data', confidence: 0 };
    }

    const recentMarks = marks.slice(0, 2);
    const avgPercentage = recentMarks.reduce((sum, m) => sum + m.calculated.percentage, 0) / recentMarks.length;

    const presentCount = attendance.filter(a => a.details.status === 'Present').length;
    const attendancePercentage = attendance.length > 0 ? (presentCount / attendance.length) * 100 : 0;

    const markTrend = marks.length >= 2 
      ? marks[0].calculated.percentage - marks[1].calculated.percentage 
      : 0;

    let prediction = 'stable';
    let riskLevel = 'low';
    let confidence = 75;

    if (avgPercentage < 50 || attendancePercentage < 70) {
      riskLevel = 'high';
      prediction = 'declining';
      confidence = 85;
    } else if (avgPercentage < 60 || attendancePercentage < 80) {
      riskLevel = 'medium';
      prediction = 'needs_improvement';
      confidence = 70;
    } else if (markTrend < -5) {
      riskLevel = 'medium';
      prediction = 'declining';
      confidence = 65;
    } else if (markTrend > 5) {
      prediction = 'improving';
      riskLevel = 'low';
    }

    const recommendations = [];
    if (attendancePercentage < 75) {
      recommendations.push('Improve attendance to maintain eligibility');
    }
    if (avgPercentage < 60) {
      recommendations.push('Focus on understanding core concepts');
    }
    if (markTrend < 0) {
      recommendations.push('Review recent study methods');
    }

    return {
      studentId,
      currentAvg: parseFloat(avgPercentage.toFixed(2)),
      attendancePercentage: parseFloat(attendancePercentage.toFixed(2)),
      markTrend: parseFloat(markTrend.toFixed(2)),
      prediction,
      riskLevel,
      confidence,
      recommendations,
      predictedNextSem: Math.min(100, Math.max(0, avgPercentage + markTrend))
    };
  } catch (error) {
    console.error('Prediction error:', error);
    return { error: error.message };
  }
};

export const identifyAtRiskStudents = async () => {
  try {
    const students = await Student.find({ 'status.isActive': true });
    const atRiskStudents = [];

    for (const student of students) {
      const prediction = await predictStudentPerformance(student._id);
      
      if (prediction.riskLevel === 'high' || prediction.riskLevel === 'medium') {
        atRiskStudents.push({
          student: {
            id: student._id,
            studentId: student.studentId,
            name: student.userId?.name,
            department: student.department,
            year: student.year
          },
          riskAssessment: prediction
        });
      }
    }

    return atRiskStudents.sort((a, b) => {
      const riskOrder = { high: 3, medium: 2, low: 1 };
      return riskOrder[b.riskAssessment.riskLevel] - riskOrder[a.riskAssessment.riskLevel];
    });
  } catch (error) {
    console.error('Error identifying at-risk students:', error);
    return [];
  }
};

export const getDepartmentAnalytics = async (department) => {
  try {
    const students = await Student.find({ department, 'status.isActive': true });
    
    const studentIds = students.map(s => s._id);
    
    const avgCGPA = students.reduce((sum, s) => sum + s.academicInfo.currentCGPA, 0) / students.length;

    const marks = await Marks.find({ studentId: { $in: studentIds } });
    const avgMarks = marks.length > 0 
      ? marks.reduce((sum, m) => sum + m.calculated.percentage, 0) / marks.length 
      : 0;

    const attendance = await Attendance.find({ studentId: { $in: studentIds } });
    const avgAttendance = attendance.length > 0
      ? (attendance.filter(a => a.details.status === 'Present').length / attendance.length) * 100
      : 0;

    const passRate = marks.length > 0
      ? (marks.filter(m => m.calculated.status === 'Pass').length / marks.length) * 100
      : 0;

    return {
      department,
      totalStudents: students.length,
      avgCGPA: parseFloat(avgCGPA.toFixed(2)),
      avgMarks: parseFloat(avgMarks.toFixed(2)),
      avgAttendance: parseFloat(avgAttendance.toFixed(2)),
      passRate: parseFloat(passRate.toFixed(2))
    };
  } catch (error) {
    console.error('Department analytics error:', error);
    return null;
  }
};
