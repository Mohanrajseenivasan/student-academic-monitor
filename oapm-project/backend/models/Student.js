import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  studentId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  registerNumber: { type: String, unique: true },
  department: { type: String, required: true },
  year: { type: Number, required: true, min: 1, max: 4 },
  semester: { type: Number, required: true, min: 1, max: 8 },
  batch: { type: String },
  section: { type: String },
  personalInfo: {
    dateOfBirth: Date,
    gender: String,
    bloodGroup: String,
    contactNumber: String,
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String
    }
  },
  parentInfo: {
    fatherName: String,
    motherName: String,
    guardianContact: String,
    guardianEmail: String
  },
  academicInfo: {
    admissionDate: Date,
    admissionType: String,
    currentCGPA: { type: Number, default: 0 },
    previousSemesterCGPA: Number,
    rank: Number,
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    failedSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    backlogs: { type: Number, default: 0 }
  },
  attendanceStats: {
    overallPercentage: { type: Number, default: 0 },
    lastUpdated: Date,
    subjectWise: [{
      subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
      percentage: Number,
      present: Number,
      absent: Number,
      total: Number
    }]
  },
  status: {
    isActive: { type: Boolean, default: true },
    isOnProbation: { type: Boolean, default: false },
    graduationDate: Date
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Student', studentSchema);
