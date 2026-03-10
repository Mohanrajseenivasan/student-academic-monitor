import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  notificationId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: {
    type: { type: String, enum: ['Attendance', 'Marks', 'Exam', 'Assignment', 'System'] },
    category: { type: String, enum: ['Alert', 'Info', 'Warning', 'Success'] },
    title: String,
    message: String,
    actionUrl: String
  },
  metadata: {
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    source: { type: String, enum: ['System', 'Faculty', 'Admin'], default: 'System' },
    relatedEntity: {
      type: String,
      id: mongoose.Schema.Types.ObjectId
    },
    expiresAt: Date
  },
  status: {
    isRead: { type: Boolean, default: false },
    readAt: Date,
    isDismissed: { type: Boolean, default: false },
    dismissedAt: Date
  },
  delivery: {
    inApp: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    emailSent: { type: Boolean, default: false },
    emailSentAt: Date
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

notificationSchema.index({ userId: 1, 'status.isRead': 1 });

export default mongoose.model('Notification', notificationSchema);
