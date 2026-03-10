import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  subjectId: { type: String, unique: true },
  subjectCode: { type: String, unique: true },
  subjectName: { type: String, required: true },
  academicInfo: {
    department: String,
    year: Number,
    semester: Number,
    credits: Number,
    type: { type: String, enum: ['Theory', 'Practical', 'Lab'], default: 'Theory' },
    category: { type: String, enum: ['Core', 'Elective', 'Audit'], default: 'Core' }
  },
  faculty: {
    assignedFaculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
    alternateFaculty: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' }]
  },
  assessment: {
    maxMarks: {
      internal1: { type: Number, default: 20 },
      internal2: { type: Number, default: 20 },
      assignment: { type: Number, default: 10 },
      semesterExam: { type: Number, default: 50 },
      total: { type: Number, default: 100 }
    },
    passingMarks: { type: Number, default: 40 }
  },
  schedule: {
    lecturesPerWeek: Number,
    labHoursPerWeek: Number,
    totalHours: Number
  },
  enrollment: {
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    maxCapacity: Number,
    currentCount: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true },
  academicYear: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Subject', subjectSchema);
