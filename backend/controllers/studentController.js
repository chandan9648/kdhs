const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private/Student
exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id }).populate('userId');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    res.status(200).json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student attendance
// @route   GET /api/student/attendance
// @access  Private/Student
exports.getStudentAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const attendance = await Attendance.find({ studentId: student._id }).sort({ date: -1 });

    // Calculate attendance percentage
    const totalDays = attendance.length;
    const presentDays = attendance.filter((a) => a.status === 'present').length;
    const attendancePercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      totalDays,
      presentDays,
      absentDays: totalDays - presentDays,
      attendancePercentage,
      attendance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student marks
// @route   GET /api/student/marks
// @access  Private/Student
exports.getStudentMarks = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const marks = await Marks.find({ studentId: student._id }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, marks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
