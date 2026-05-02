const router = require('express').Router();
const {
  addStudent,
  addTeacher,
  getAllStudents,
  getAllTeachers,
  updateStudent,
  deleteStudent,
  updateTeacher,
  deleteTeacher,
  getAttendanceReport,
  getMarksReport,
  addParent,
  getAllParents,
  updateParent,
  deleteParent,
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
router.put('/teacher/:id', updateTeacher);
router.delete('/teacher/:id', deleteTeacher);

// Reports
router.get('/reports/attendance', getAttendanceReport);
router.get('/reports/marks', getMarksReport);

// Parent routes
router.post('/parent', addParent);
router.get('/parents', getAllParents);
router.put('/parent/:id', updateParent);
router.delete('/parent/:id', deleteParent);

module.exports = router;
