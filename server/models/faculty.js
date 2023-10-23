const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const facultySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
  },
  password: {
    type: String,
    select: false,
  },
  username: {
    type: String,
  },
  gender: {
    type: String,
  },
  designation: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: Number,
  },
  dob: {
    type: String,
    required: true,
  },
  joiningYear: {
    type: Number,
    required: true,
  },
  passwordUpdated: {
    type: Boolean,
    default: false,
  },
});

facultySchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

facultySchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

facultySchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

module.exports = mongoose.model("faculty", facultySchema);