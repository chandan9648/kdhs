const router = require('express').Router();
const {
  getStudentProfile,
  getStudentAttendance,
  getStudentMarks,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All student routes are private and require student role
router.use(protect, authorize('student'));

router.get('/profile', getStudentProfile);
router.get('/attendance', getStudentAttendance);
router.get('/marks', getStudentMarks);

module.exports = router;
