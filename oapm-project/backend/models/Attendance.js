import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  attendanceId: { type: String, unique: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  details: {
    date: { type: Date, required: true },
    status: { type: String, enum: ['Present', 'Absent', 'Late', 'OnDuty', 'Medical'], required: true },
    session: { type: String, enum: ['Morning', 'Afternoon'] },
    period: Number,
    remarks: String
  },
  metadata: {
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
    markedAt: { type: Date, default: Date.now },
    method: { type: String, enum: ['Manual', 'Biometric', 'QR', 'GPS'], default: 'Manual' },
    isVerified: { type: Boolean, default: true }
  },
  academicInfo: {
    academicYear: String,
    semester: Number
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

attendanceSchema.index({ studentId: 1, subjectId: 1, 'details.date': 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
