const Parent = require('../models/Parent');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');

// @desc    Get linked child profile
// @route   GET /api/parent/child
// @access  Private/Parent
exports.getChildProfile = async (req, res) => {
  try {
    const parent = await Parent.findOne({ userId: req.user._id }).populate({
      path: 'studentId',
      populate: { path: 'userId', select: 'name email' },
    });

    if (!parent) {
      return res.status(404).json({ success: false, message: 'Parent profile not found' });
    }

    res.status(200).json({ success: true, child: parent.studentId, relation: parent.relation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get linked child attendance
// @route   GET /api/parent/child/attendance
// @access  Private/Parent
exports.getChildAttendance = async (req, res) => {
  try {
    const parent = await Parent.findOne({ userId: req.user._id });

    if (!parent) {
      return res.status(404).json({ success: false, message: 'Parent profile not found' });
    }

    const attendance = await Attendance.find({ studentId: parent.studentId }).sort({ date: -1 });

    // Calculate summary
    const totalDays = attendance.length;
    const presentDays = attendance.filter((a) => a.status === 'present').length;
    const absentDays = totalDays - presentDays;
    const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      attendance,
      summary: { totalDays, presentDays, absentDays, percentage },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get linked child marks
// @route   GET /api/parent/child/marks
// @access  Private/Parent
exports.getChildMarks = async (req, res) => {
  try {
    const parent = await Parent.findOne({ userId: req.user._id });

    if (!parent) {
      return res.status(404).json({ success: false, message: 'Parent profile not found' });
    }

    const marks = await Marks.find({ studentId: parent.studentId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, marks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
