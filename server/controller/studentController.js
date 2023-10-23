const Student = require('../models/student');
const Attendence = require('../models/attendance');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.studentLogin = async (req, res) => {
  try {
      const {email, password} = req.body;
      const student = await Student.findOne({email}).select("+password");
      if(!student){
          return res.status(400).json({
              success: false,
              message: "Invalid Credentials"
          });
      }

      const isMatch = await student.matchPassword(password);
      if(isMatch){
          return res.status(200).json({
              success: true,
              message: "Login Successful"
          });
      }

      const token = student.generateToken();

      const option = {
          expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          httpOnly: true,
      }

      res.status(200).cookie("token", token, option).json({
          success: true,
          student,
          token
      });
  } catch (error) {
      res.status(500).json({
          success: false, 
          message: error.message
      });
      
  }
}

exports.attendance = async (req, res) => {
    try {
      const { department, year, section } = req.body;
      const errors = { notestError: String };
      const student = await Student.findOne({ department, year, section });
  
      const attendence = await Attendence.find({
        student: student._id,
      }).populate("subject");
      if (!attendence) {
        res.status(400).json({ message: "Attendence not found" });
      }
  
      res.status(200).json({
        result: attendence.map((att) => {
          let res = {};
          res.percentage = (
            (att.lectureAttended / att.totalLecturesByFaculty) *
            100
          ).toFixed(2);
          res.subjectCode = att.subject.subjectCode;
          res.subjectName = att.subject.subjectName;
          res.attended = att.lectureAttended;
          res.total = att.totalLecturesByFaculty;
          return res;
        }),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };