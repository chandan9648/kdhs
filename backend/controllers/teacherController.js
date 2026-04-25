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

    // Parse the date properly (handle YYYY-MM-DD format)
    const attendanceDate = new Date(date);
    if (isNaN(attendanceDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date format' });
    }

    // Set time to 00:00:00 for consistent comparison
    attendanceDate.setUTCHours(0, 0, 0, 0);

    // Check if attendance already exists for this date
    let attendance = await Attendance.findOne({
      studentId,
      date: {
        $gte: attendanceDate,
        $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000), // Next day
      },
    });

    if (attendance) {
      // Update existing attendance
      attendance.status = status;
      attendance.remarks = remarks || '';
      await attendance.save();
      return res.status(200).json({ success: true, attendance, message: 'Attendance updated' });
    }

    // Create new attendance record
    attendance = await Attendance.create({
      studentId,
      date: attendanceDate,
      status,
      markedBy: req.user.id,
      remarks: remarks || '',
    });

    res.status(201).json({ success: true, attendance, message: 'Attendance marked successfully' });
  } catch (error) {
    console.error('Attendance error:', error);
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

    // Validate marks is a number
    const marksNum = parseInt(marks);
    if (isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
      return res.status(400).json({ success: false, message: 'Marks must be a number between 0 and 100' });
    }

    // Validate exam type
    const validExamTypes = ['unit1', 'unit2', 'midterm', 'final'];
    if (!validExamTypes.includes(examType)) {
      return res.status(400).json({ success: false, message: 'Invalid exam type' });
    }

    const marksRecord = await Marks.create({
      studentId,
      subject: subject.trim(),
      marks: marksNum,
      examType,
      semester: semester || '1',
      addedBy: req.user.id,
    });

    res.status(201).json({ success: true, marks: marksRecord, message: 'Marks added successfully' });
  } catch (error) {
    console.error('Marks error:', error);
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
