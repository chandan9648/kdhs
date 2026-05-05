const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    class: {
      type: String,
      required: [true, 'Please provide a class'],
      enum: ['10A', '10B', '12A', '12B'], // Add your classes
    },
    rollNo: {
      type: Number,
      required: [true, 'Please provide a roll number'],
    },
    phoneNo: {
      type: String,
      match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
    },
    parentName: {
      type: String,
    },
    parentPhone: {
      type: String,
      match: [/^\d{10}$/, 'Parent phone number must be exactly 10 digits'],
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
