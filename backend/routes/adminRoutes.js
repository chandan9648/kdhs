const router = require('express').Router();
const {
  addStudent,
  addTeacher,
  getAllStudents,
  getAllTeachers,
  updateStudent,
  deleteStudent,
  getAttendanceReport,
  getMarksReport,
  addParent,
  getAllParents,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes are private and require admin role
router.use(protect, authorize('admin'));

// Student routes
router.post('/student', addStudent);
router.get('/students', getAllStudents);
router.put('/student/:id', updateStudent);
router.delete('/student/:id', deleteStudent);

// Teacher routes
router.post('/teacher', addTeacher);
router.get('/teachers', getAllTeachers);

// Reports
router.get('/reports/attendance', getAttendanceReport);
router.get('/reports/marks', getMarksReport);

// Parent routes
router.post('/parent', addParent);
router.get('/parents', getAllParents);

module.exports = router;
