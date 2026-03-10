import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  feedbackId: { type: String, unique: true },
  provider: {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    isAnonymous: { type: Boolean, default: false },
    displayName: String
  },
  target: {
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    semester: Number
  },
  ratings: {
    teaching: { type: Number, min: 1, max: 5 },
    communication: { type: Number, min: 1, max: 5 },
    knowledge: { type: Number, min: 1, max: 5 },
    availability: { type: Number, min: 1, max: 5 },
    fairness: { type: Number, min: 1, max: 5 },
    overall: Number
  },
  qualitative: {
    strengths: String,
    improvements: String,
    additionalComments: String
  },
  courseSpecific: {
    contentQuality: { type: Number, min: 1, max: 5 },
    relevance: { type: Number, min: 1, max: 5 },
    difficulty: { type: String, enum: ['Easy', 'Moderate', 'Hard'] },
    workload: { type: String, enum: ['Light', 'Moderate', 'Heavy'] }
  },
  status: {
    isApproved: { type: Boolean, default: false },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: Date,
    isPublic: { type: Boolean, default: false }
  },
  academicYear: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

feedbackSchema.index({ facultyId: 1, academicYear: 1 });

export default mongoose.model('Feedback', feedbackSchema);
