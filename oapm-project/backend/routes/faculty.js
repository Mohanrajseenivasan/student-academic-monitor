import express from 'express';
import { 
  getFacultyDashboard, getMyStudents, getSubjectStudents, 
  enterMarks, markAttendance, bulkMarkAttendance, getAttendanceReport
} from '../controllers/facultyController.js';
import { auth } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

router.use(auth, roleCheck('faculty'));

router.get('/dashboard', getFacultyDashboard);
router.get('/students', getMyStudents);
router.get('/subjects/:subjectId/students', getSubjectStudents);

router.post('/marks', enterMarks);
router.post('/attendance', markAttendance);
router.post('/attendance/bulk', bulkMarkAttendance);
router.get('/attendance/report', getAttendanceReport);

export default router;
