import express from 'express';
import { 
  getDashboardStats, getAllStudents, createStudent, updateStudent, deleteStudent,
  getAllFaculty, createFaculty, updateFaculty, deleteFaculty,
  getAllSubjects, createSubject, updateSubject, deleteSubject
} from '../controllers/adminController.js';
import { auth } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

router.use(auth, roleCheck('admin'));

router.get('/dashboard', getDashboardStats);

router.get('/students', getAllStudents);
router.post('/students', createStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

router.get('/faculty', getAllFaculty);
router.post('/faculty', createFaculty);
router.put('/faculty/:id', updateFaculty);
router.delete('/faculty/:id', deleteFaculty);

router.get('/subjects', getAllSubjects);
router.post('/subjects', createSubject);
router.put('/subjects/:id', updateSubject);
router.delete('/subjects/:id', deleteSubject);

export default router;
