const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    subject: {
      type: String,
      required: [true, 'Please provide a subject'],
    },
    qualifications: {
      type: String,
    },
    phoneNo: {
      type: String,
      match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
    },
    assignedClasses: [
      {
        type: String,
        enum: ['10A', '10B', '12A', '12B'],
      },
    ],
    experience: {
      type: Number, // in years
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Teacher', teacherSchema);
