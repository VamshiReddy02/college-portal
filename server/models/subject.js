const mongoose = require("mongoose");

const { Schema } = mongoose;
const subjectSchema = new Schema({
  subjectName: {
    type: String,
    required: true,
    trim: true,
  },
  subjectCode: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  totalLectures: {
    type: Number,
    default: 10,
  },
  year: {
    type: String,
    required: true,
  },
  attendence: {
    type: Schema.Types.ObjectId,
    ref: "attendence",
  },
});

module.exports = mongoose.model("subject", subjectSchema);