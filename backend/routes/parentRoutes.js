const router = require('express').Router();
const {
  getChildProfile,
  getChildAttendance,
  getChildMarks,
} = require('../controllers/parentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All parent routes are private and require parent role
router.use(protect, authorize('parent'));

router.get('/child', getChildProfile);
router.get('/child/attendance', getChildAttendance);
router.get('/child/marks', getChildMarks);

module.exports = router;
