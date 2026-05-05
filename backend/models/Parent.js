const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    relation: {
      type: String,
      enum: ['Father', 'Mother', 'Guardian'],
      default: 'Guardian',
    },
    phoneNo: {
      type: String,
      match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Parent', parentSchema);
