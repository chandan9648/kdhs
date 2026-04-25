const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    subject: {
      type: String,
      required: [true, 'Please provide a subject'],
    },
    marks: {
      type: Number,
      required: [true, 'Please provide marks'],
      min: 0,
      max: 100,
    },
    examType: {
      type: String,
      enum: ['unit1', 'unit2', 'midterm', 'final'],
      required: true,
    },
    semester: {
      type: String,
      enum: ['1', '2'],
      default: '1',
    },
    academic_year: {
      type: String,
      required: true,
      default: new Date().getFullYear().toString(),
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Teacher who added
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Marks', marksSchema);
