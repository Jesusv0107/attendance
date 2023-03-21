const mongoose = require('mongoose');


const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  attendanceCount: { type: Number, default: 0 },
  absentCount: { type: Number, default: 0 }
});


module.exports = mongoose.model('students', studentSchema);