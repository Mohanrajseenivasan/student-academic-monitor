import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  facultyId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  professionalInfo: {
    designation: String,
    department: String,
    qualification: String,
    specialization: String,
    experience: Number,
    joiningDate: Date
  },
  contactInfo: {
    officePhone: String,
    mobileNumber: String,
    alternateEmail: String
  },
  teaching: {
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    maxSubjects: { type: Number, default: 5 },
    preferredSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }]
  },
  stats: {
    totalStudents: { type: Number, default: 0 },
    averagePerformance: Number,
    feedbackRating: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Faculty', facultySchema);
