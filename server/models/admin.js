const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminSchema = mongoose.Schema(
    {
      name: {
        type: String,
        require: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
      },
      username: {
        type: String,
      },
      department: {
        type: String,
      },
      dob: {
        type: String,
      },
      joiningYear: {
        type: String,
      },
      avatar: {
        type: String,
      },
      contactNumber: {
        type: Number,
      },
      passwordUpdated: {
        type: Boolean,
        default: false,
      },
    },
    { strict: false }
  );
  
  adminSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  
    next();
  });
  
  adminSchema.methods.matchPassword = async function (password) {
    console.log(password, this.password);
    return await bcrypt.compare(password, this.password);
  };
  
  adminSchema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  };

module.exports = mongoose.model("admin", adminSchema);