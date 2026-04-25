const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');

// @desc    Mark attendance
// @route   POST /api/teacher/attendance
// @access  Private/Teacher
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, date, status, remarks } = req.body;

    // Validate input
    if (!studentId || !date || !status) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (!['present', 'absent'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be present or absent' });
    }

    // Check if attendance already exists for this date
    let attendance = await Attendance.findOne({
      studentId,
      date: new Date(date).toDateString(),
    });

    if (attendance) {
      // Update existing attendance
      attendance.status = status;
      attendance.remarks = remarks;
      await attendance.save();
    } else {
      // Create new attendance record
      attendance = await Attendance.create({
        studentId,
        date: new Date(date),
        status,
        markedBy: req.user.id,
        remarks,
      });
    }

    res.status(201).json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add marks
// @route   POST /api/teacher/marks
// @access  Private/Teacher
exports.addMarks = async (req, res) => {
  try {
    const { studentId, subject, marks, examType, semester } = req.body;

    // Validate input
    if (!studentId || !subject || marks === undefined || !examType) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (marks < 0 || marks > 100) {
      return res.status(400).json({ success: false, message: 'Marks must be between 0 and 100' });
    }

    const marksRecord = await Marks.create({
      studentId,
      subject,
      marks,
      examType,
      semester: semester || '1',
      addedBy: req.user.id,
    });

    res.status(201).json({ success: true, marks: marksRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get class students
// @route   GET /api/teacher/class/:classname
// @access  Private/Teacher
exports.getClassStudents = async (req, res) => {
  try {
    const { classname } = req.params;

    const students = await Student.find({ class: classname }).populate('userId');

    res.status(200).json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attendance for a class
// @route   GET /api/teacher/attendance/:studentId
// @access  Private/Teacher
exports.getStudentAttendanceForTeacher = async (req, res) => {
  try {
    const { studentId } = req.params;

    const attendance = await Attendance.find({ studentId }).sort({ date: -1 });

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
