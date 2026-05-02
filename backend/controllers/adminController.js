const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');
const Parent = require('../models/Parent');

// @desc    Add student
// @route   POST /api/admin/student
// @access  Private/Admin
exports.addStudent = async (req, res) => {
  try {
    const { name, email, password, class: className, rollNo, phoneNo, parentName, parentPhone, address } = req.body;

    // Validate required fields
    if (!name || !email || !password || !className || !rollNo) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    // Create user
    user = await User.create({
      name,
      email,
      password,
      role: 'student',
    });

    // Create student profile
    const student = await Student.create({
      userId: user._id,
      class: className,
      rollNo,
      phoneNo,
      parentName,
      parentPhone,
      address,
    });

    res.status(201).json({
      success: true,
      user,
      student,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add teacher
// @route   POST /api/admin/teacher
// @access  Private/Admin
exports.addTeacher = async (req, res) => {
  try {
    const { name, email, password, subject, qualifications, phoneNo, assignedClasses, experience } = req.body;

    // Validate required fields
    if (!name || !email || !password || !subject) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    // Create user
    user = await User.create({
      name,
      email,
      password,
      role: 'teacher',
    });

    // Create teacher profile
    const teacher = await Teacher.create({
      userId: user._id,
      subject,
      qualifications,
      phoneNo,
      assignedClasses: assignedClasses || [],
      experience,
    });

    res.status(201).json({
      success: true,
      user,
      teacher,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private/Admin
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('userId');

    res.status(200).json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all teachers
// @route   GET /api/admin/teachers
// @access  Private/Admin
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('userId');

    res.status(200).json({ success: true, teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update student
// @route   PUT /api/admin/student/:id
// @access  Private/Admin
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Separate user and student updates
    const userUpdates = {};
    const studentUpdates = {};

    if (updates.name) userUpdates.name = updates.name;
    if (updates.email) userUpdates.email = updates.email;
    if (updates.class) studentUpdates.class = updates.class;
    if (updates.rollNo) studentUpdates.rollNo = updates.rollNo;
    if (updates.phoneNo) studentUpdates.phoneNo = updates.phoneNo;
    if (updates.parentName) studentUpdates.parentName = updates.parentName;
    if (updates.parentPhone) studentUpdates.parentPhone = updates.parentPhone;
    if (updates.address) studentUpdates.address = updates.address;

    // Update user
    if (Object.keys(userUpdates).length > 0) {
      const student = await Student.findById(id);
      await User.findByIdAndUpdate(student.userId, userUpdates);
    }

    // Update student
    const updatedStudent = await Student.findByIdAndUpdate(id, studentUpdates, { new: true }).populate('userId');

    res.status(200).json({ success: true, student: updatedStudent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/admin/student/:id
// @access  Private/Admin
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Delete user
    await User.findByIdAndDelete(student.userId);

    // Delete student
    await Student.findByIdAndDelete(id);

    // Delete related attendance and marks
    await Attendance.deleteMany({ studentId: id });
    await Marks.deleteMany({ studentId: id });

    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attendance report
// @route   GET /api/admin/reports/attendance
// @access  Private/Admin
exports.getAttendanceReport = async (req, res) => {
  try {
    const { className, fromDate, toDate } = req.query;

    let query = {};

    if (className) {
      const students = await Student.find({ class: className });
      const studentIds = students.map((s) => s._id);
      query.studentId = { $in: studentIds };
    }

    if (fromDate || toDate) {
      query.date = {};
      if (fromDate) query.date.$gte = new Date(fromDate);
      if (toDate) query.date.$lte = new Date(toDate);
    }

    const attendance = await Attendance.find(query)
      .populate({
        path: 'studentId',
        populate: {
          path: 'userId',
        },
      })
      .sort({ date: -1 });

    // Group by student and calculate percentage
    const report = {};
    attendance.forEach((record) => {
      const studentId = record.studentId._id.toString();
      if (!report[studentId]) {
        report[studentId] = {
          student: record.studentId,
          totalDays: 0,
          presentDays: 0,
          absentDays: 0,
        };
      }
      report[studentId].totalDays++;
      if (record.status === 'present') {
        report[studentId].presentDays++;
      } else {
        report[studentId].absentDays++;
      }
    });

    // Calculate percentages
    const reportArray = Object.values(report).map((r) => ({
      ...r,
      attendancePercentage: r.totalDays > 0 ? ((r.presentDays / r.totalDays) * 100).toFixed(2) : 0,
    }));

    res.status(200).json({ success: true, report: reportArray });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get marks report
// @route   GET /api/admin/reports/marks
// @access  Private/Admin
exports.getMarksReport = async (req, res) => {
  try {
    const { className, examType, semester } = req.query;

    let query = {};

    if (className) {
      const students = await Student.find({ class: className });
      const studentIds = students.map((s) => s._id);
      query.studentId = { $in: studentIds };
    }

    if (examType) query.examType = examType;
    if (semester) query.semester = semester;

    const marks = await Marks.find(query)
      .populate({
        path: 'studentId',
        populate: {
          path: 'userId',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, marks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add parent (linked to a student)
// @route   POST /api/admin/parent
// @access  Private/Admin
exports.addParent = async (req, res) => {
  try {
    const { name, email, password, studentId, relation, phoneNo } = req.body;

    if (!name || !email || !password || !studentId) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Ensure the student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Check email uniqueness
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    // Create user with parent role
    user = await User.create({ name, email, password, role: 'parent' });

    // Create parent profile
    const parent = await Parent.create({
      userId: user._id,
      studentId,
      relation: relation || 'Guardian',
      phoneNo,
    });

    res.status(201).json({ success: true, user, parent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all parents
// @route   GET /api/admin/parents
// @access  Private/Admin
exports.getAllParents = async (req, res) => {
  try {
    const parents = await Parent.find()
      .populate('userId', 'name email')
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name' },
      });

    res.status(200).json({ success: true, parents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
