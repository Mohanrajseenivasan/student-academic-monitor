import mongoose from 'mongoose';

const marksSchema = new mongoose.Schema({
  marksId: { type: String, unique: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  academicDetails: {
    academicYear: String,
    semester: Number,
    examType: { type: String, enum: ['Regular', 'Supplementary', 'Retest'], default: 'Regular' }
  },
  assessments: {
    internal1: { marks: Number, maxMarks: Number, percentage: Number, date: Date },
    internal2: { marks: Number, maxMarks: Number, percentage: Number, date: Date },
    assignment: { marks: Number, maxMarks: Number, percentage: Number, submittedDate: Date },
    semesterExam: { marks: Number, maxMarks: Number, percentage: Number, examDate: Date }
  },
  calculated: {
    totalMarks: Number,
    totalMaxMarks: Number,
    percentage: Number,
    grade: String,
    gradePoint: Number,
    status: { type: String, enum: ['Pass', 'Fail', 'Absent'], default: 'Pass' }
  },
  metadata: {
    enteredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
    enteredAt: { type: Date, default: Date.now },
    lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
    lastModifiedAt: Date,
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: Date,
    isPublished: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

marksSchema.index({ studentId: 1, subjectId: 1, 'academicDetails.semester': 1 }, { unique: true });

export default mongoose.model('Marks', marksSchema);
