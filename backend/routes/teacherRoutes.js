const router = require('express').Router();
const {
  markAttendance,
  addMarks,
  getClassStudents,
  getStudentAttendanceForTeacher,
} = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All teacher routes are private and require teacher role
router.use(protect, authorize('teacher'));

router.post('/attendance', markAttendance);
router.post('/marks', addMarks);
router.get('/class/:classname', getClassStudents);
router.get('/attendance/:studentId', getStudentAttendanceForTeacher);

module.exports = router;
