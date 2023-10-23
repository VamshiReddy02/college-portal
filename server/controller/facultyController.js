const Faculty = require("../models/faculty");
const Student = require("../models/student");
const Subject = require("../models/subject");
const Attendance = require("../models/attendance");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.facultyLogin = async (req, res) => {
    try {
        const {email, password} = req.body;
        const faculty = await Faculty.findOne({email}).select("+password");
        if(!faculty){
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const isMatch = await faculty.matchPassword(password);
        if(isMatch){
            return res.status(200).json({
                success: true,
                message: "Login Successful"
            });
        }

        const token = faculty.generateToken();

        const option = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        }

        res.status(200).cookie("token", token, option).json({
            success: true,
            faculty,
            token
        });
    } catch (error) {
        res.status(500).json({
            success: false, 
            message: error.message
        });
        
    }
}

exports.facultyUpdatedPassword = async (req, res) => {
    try {
      const { newPassword, confirmPassword, email } = req.body;
      const errors = { mismatchError: String };
      if (newPassword !== confirmPassword) {
        errors.mismatchError =
          "Your password and confirmation password do not match";
        return res.status(400).json(errors);
      }
  
      const faculty = await Faculty.findOne({ email });
      let hashedPassword;
      hashedPassword = await bcrypt.hash(newPassword, 10);
      faculty.password = hashedPassword;
      await faculty.save();
      if (faculty.passwordUpdated === false) {
        faculty.passwordUpdated = true;
        await faculty.save();
      }
  
      res.status(200).json({
        success: true,
        message: "Password updated successfully",
        response: faculty,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  exports.updateFaculty = async (req, res) => {
    try {
      const { name, dob, department, contactNumber, avatar, email, designation, gender } =
        req.body;
      const updatedFaculty = await Faculty.findOne({ email });
      if (name) {
        updatedFaculty.name = name;
        await updatedFaculty.save();
      }
      if (dob) {
        updatedFaculty.dob = dob;
        await updatedFaculty.save();
      }
      if (gender) {
        updatedFaculty.gender = gender;
        await updatedFaculty.save();
      }
      if (department) {
        updatedFaculty.department = department;
        await updatedFaculty.save();
      }
      if (contactNumber) {
        updatedFaculty.contactNumber = contactNumber;
        await updatedFaculty.save();
      }
      if (designation) {
        updatedFaculty.designation = designation;
        await updatedFaculty.save();
      }
      if (avatar) {
        updatedFaculty.avatar = avatar;
        await updatedFaculty.save();
      }
      res.status(200).json(updatedFaculty);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  exports.getStudent = async (req, res) => {
    try {
      const { department, year, section } = req.body;
      const errors = { noStudentError: String };
      const students = await Student.find({ department, year, section });
      if (students.length === 0) {
        errors.noStudentError = "No Student Found";
        return res.status(404).json(errors);
      }
  
      res.status(200).json({ result: students });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        }); 
    }
  };

  exports.markAttendance = async (req, res) => {
    try {
      const { selectedStudents, subjectName, department, year, section } =
        req.body;
  
      const sub = await Subject.findOne({ subjectName });
  
      const allStudents = await Student.find({ department, year, section });
  
      for (let i = 0; i < allStudents.length; i++) {
        const pre = await Attendance.findOne({
          student: allStudents[i]._id,
          subject: sub._id,
        });
        if (!pre) {
          const attendance = new Attendance({
            student: allStudents[i]._id,
            subject: sub._id,
          });
          attendance.totalLecturesByFaculty += 1;
          await attendance.save();
        } else {
          pre.totalLecturesByFaculty += 1;
          await pre.save();
        }
      }
  
      for (var a = 0; a < selectedStudents.length; a++) {
        const pre = await Attendance.findOne({
          student: selectedStudents[a],
          subject: sub._id,
        });
        if (!pre) {
          const attendance = new Attendance({
            student: selectedStudents[a],
            subject: sub._id,
          });
  
          attendance.lectureAttended += 1;
          await attendance.save();
        } else {
          pre.lectureAttended += 1;
          await pre.save();
        }
      }
      res.status(200).json({ message: "Attendance Marked successfully" });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };