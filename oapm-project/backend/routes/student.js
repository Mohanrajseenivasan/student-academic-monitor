import express from 'express';
import { 
  getStudentDashboard, getStudentProfile, getStudentSubjects, 
  getStudentMarks, getStudentAttendance, getStudentAnalytics,
  getNotifications, markNotificationRead, submitFeedback
} from '../controllers/studentController.js';
import { auth } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

router.use(auth, roleCheck('student'));

router.get('/dashboard', getStudentDashboard);
router.get('/profile', getStudentProfile);
router.get('/subjects', getStudentSubjects);
router.get('/marks', getStudentMarks);
router.get('/attendance', getStudentAttendance);
router.get('/analytics', getStudentAnalytics);

router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);

router.post('/feedback', submitFeedback);

export default router;
