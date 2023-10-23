const Admin = require('../models/admin');
const Faculty = require('../models/faculty');
const Student = require('../models/student');
const Department = require('../models/department');
const Subject = require('../models/subject');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createAdmin = async (req, res, next) => {
    try {

        const {name, email, password, username} = req.body;
        let admin = await Admin.findOne({email});
        if(admin){
            return res
            .status(400)
            .json({success: false, message: "Admin already exists"});
        }
        admin = await Admin.create({
            name,
            email,
            password,
            username
        });
        res.status(200).json({
            success: true,
            admin
        });
    } catch (error) {
        res.status(500).json({
            success: false, 
            message: error.message
        });
    }
}

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const admin = await Admin.findOne({email}).select("+password");
        if(!admin){
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const isMatch = await admin.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const token = admin.generateToken();

        const option = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        }

        res.status(200).cookie("token", token, option).json({
            success: true,
            admin,
            token
        });
    } catch (error) {
        res.status(500).json({
            success: false, 
            message: error.message
        });
        
    }
}

exports.logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      .json({
        success: true,
        message: "Logged out",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.updatedPassword = async (req, res) => {
    try {
      const { newPassword, confirmPassword, email } = req.body;
      const errors = { mismatchError: String };
      if (newPassword !== confirmPassword) {
        errors.mismatchError =
          "Your password and confirmation password do not match";
        return res.status(400).json(errors);
      }
  
      const admin = await Admin.findOne({ email });
      let hashedPassword;
      hashedPassword = await bcrypt.hash(newPassword, 10);
      admin.password = hashedPassword;
      await admin.save();
      if (admin.passwordUpdated === false) {
        admin.passwordUpdated = true;
        await admin.save();
      }
  
      res.status(200).json({
        success: true,
        message: "Password updated successfully",
        response: admin,
      });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
  };

  exports.updateAdmin = async (req, res) => {
    try {
      const { name, dob, department, contactNumber, avatar, email } = req.body;
      const updatedAdmin = await Admin.findOne({ email });
      if (name) {
        updatedAdmin.name = name;
        await updatedAdmin.save();
      }
      if (dob) {
        updatedAdmin.dob = dob;
        await updatedAdmin.save();
      }
      if (department) {
        updatedAdmin.department = department;
        await updatedAdmin.save();
      }
      if (contactNumber) {
        updatedAdmin.contactNumber = contactNumber;
        await updatedAdmin.save();
      }
      if (avatar) {
        updatedAdmin.avatar = avatar;
        await updatedAdmin.save();
      }
      res.status(200).json(updatedAdmin);
    } catch (error) {
      const errors = { backendError: String };
      errors.backendError = error;
      res.status(500).json(errors);
    }
  };

  exports.addAdmin = async (req, res) => {
    try {
      const { name, dob, department, contactNumber, avatar, email, joiningYear } =
        req.body;
      const errors = { emailError: String };
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        errors.emailError = "Email already exists";
        return res.status(400).json(errors);
      }
      const existingDepartment = await Department.findOne({ department });
      let departmentHelper = existingDepartment.departmentCode;
      const admins = await Admin.find({ department });
  
      let helper;
      if (admins.length < 10) {
        helper = "00" + admins.length.toString();
      } else if (admins.length < 100 && admins.length > 9) {
        helper = "0" + admins.length.toString();
      } else {
        helper = admins.length.toString();
      }
      var date = new Date();
      var components = ["ADM", date.getFullYear(), departmentHelper, helper];
  
      var username = components.join("");
      let hashedPassword;
      const newDob = dob.split("-").reverse().join("-");
  
      hashedPassword = await bcrypt.hash(newDob, 10);
      var passwordUpdated = false;
      const newAdmin = await new Admin({
        name,
        email,
        password: hashedPassword,
        joiningYear,
        username,
        department,
        avatar,
        contactNumber,
        dob,
        passwordUpdated,
      });
      await newAdmin.save();
      return res.status(200).json({
        success: true,
        message: "Admin registerd successfully",
        response: newAdmin,
      });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
  };

  exports.getAdmin = async (req, res) => {
    try {
      const { department } = req.body;
  
      const errors = { noAdminError: String };
  
      const admins = await Admin.find({ department });
      if (admins.length === 0) {
        errors.noAdminError = "No Subject Found";
        return res.status(404).json(errors);
      }
      res.status(200).json({ result: admins });
    } catch (error) {
      const errors = { backendError: String };
      errors.backendError = error;
      res.status(500).json(errors);
    }
  };

  exports.getAllAdmin = async (req, res) => {
    try {
      const admins = await Admin.find();
      res.status(200).json(admins);
    } catch (error) {
      console.log("Backend Error", error);
    }
  };

  exports.addDepartment = async (req, res) => {
    try {
      const errors = { departmentError: String };
      const { department } = req.body;
      const existingDepartment = await Department.findOne({ department });
      if (existingDepartment) {
        errors.departmentError = "Department already added";
        return res.status(400).json(errors);
      }
      const departments = await Department.find({});
      let add = departments.length + 1;
      let departmentCode;
      if (add < 9) {
        departmentCode = "0" + add.toString();
      } else {
        departmentCode = add.toString();
      }
  
      const newDepartment = await new Department({
        department,
        departmentCode,
      });
  
      await newDepartment.save();
      return res.status(200).json({
        success: true,
        message: "Department added successfully",
        response: newDepartment,
      });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
  };

  exports.getAllDepartment = async (req, res) => {
    try {
      const departments = await Department.find();
      res.status(200).json(departments);
    } catch (error) {
      console.log("Backend Error", error);
    }
  };

  exports.addFaculty = async (req, res) => {
    try {
      const {
        name,
        dob,
        department,
        contactNumber,
        avatar,
        email,
        joiningYear,
        gender,
        designation,
      } = req.body;
      const errors = { emailError: String };
      const existingFaculty = await Faculty.findOne({ email });
      if (existingFaculty) {
        errors.emailError = "Email already exists";
        return res.status(400).json(errors);
      }
      const existingDepartment = await Department.findOne({ department });
      let departmentHelper = existingDepartment.departmentCode;
  
      const faculties = await Faculty.find({ department });
      let helper;
      if (faculties.length < 10) {
        helper = "00" + faculties.length.toString();
      } else if (faculties.length < 100 && faculties.length > 9) {
        helper = "0" + faculties.length.toString();
      } else {
        helper = faculties.length.toString();
      }
      var date = new Date();
      var components = ["FAC", date.getFullYear(), departmentHelper, helper];
  
      var username = components.join("");
      let hashedPassword;
      const newDob = dob.split("-").reverse().join("-");
  
      hashedPassword = await bcrypt.hash(newDob, 10);
      var passwordUpdated = false;
  
      const newFaculty = await new Faculty({
        name,
        email,
        password: hashedPassword,
        joiningYear,
        username,
        department,
        avatar,
        contactNumber,
        dob,
        gender,
        designation,
        passwordUpdated,
      });
      await newFaculty.save();
      return res.status(200).json({
        success: true,
        message: "Faculty registerd successfully",
        response: newFaculty,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  exports.getAllFaculty = async (req, res) => {
    try {
      const faculties = await Faculty.find();
      res.status(200).json(faculties);
    } catch (error) {
      console.log("Backend Error", error);
    }
  };

  exports.addSubject = async (req, res) => {
    try {
      const { totalLectures, department, subjectCode, subjectName, year } =
        req.body;
      const errors = { subjectError: String };
      const subject = await Subject.findOne({ subjectCode });
      if (subject) {
        errors.subjectError = "Given Subject is already added";
        return res.status(400).json(errors);
      }
  
      const newSubject = await new Subject({
        totalLectures,
        department,
        subjectCode,
        subjectName,
        year,
      });
  
      await newSubject.save();
      const students = await Student.find({ department, year });
      if (students.length !== 0) {
        for (var i = 0; i < students.length; i++) {
          students[i].subjects.push(newSubject._id);
          await students[i].save();
        }
      }
      return res.status(200).json({
        success: true,
        message: "Subject added successfully",
        response: newSubject,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  exports.getAllSubject = async (req, res) => {
    try {
      const subjects = await Subject.find();
      res.status(200).json(subjects);
    } catch (error) {
      console.log("Backend Error", error);
    }
  };

  exports.addStudent = async (req, res) => {
    try {
      const {
        name,
        dob,
        department,
        contactNumber,
        avatar,
        email,
        section,
        gender,
        batch,
        fatherName,
        motherName,
        fatherContactNumber,
        motherContactNumber,
        year,
      } = req.body;
      const errors = { emailError: String };
      const existingStudent = await Student.findOne({ email });
      if (existingStudent) {
        errors.emailError = "Email already exists";
        return res.status(400).json(errors);
      }
      const existingDepartment = await Department.findOne({ department });
      let departmentHelper = existingDepartment.departmentCode;
  
      const students = await Student.find({ department });
      let helper;
      if (students.length < 10) {
        helper = "00" + students.length.toString();
      } else if (students.length < 100 && students.length > 9) {
        helper = "0" + students.length.toString();
      } else {
        helper = students.length.toString();
      }
      var date = new Date();
      var components = ["STU", date.getFullYear(), departmentHelper, helper];
  
      var username = components.join("");
      let hashedPassword;
      const newDob = dob.split("-").reverse().join("-");
  
      hashedPassword = await bcrypt.hash(newDob, 10);
      var passwordUpdated = false;
  
      const newStudent = await new Student({
        name,
        dob,
        password: hashedPassword,
        username,
        department,
        contactNumber,
        avatar,
        email,
        section,
        gender,
        batch,
        fatherName,
        motherName,
        fatherContactNumber,
        motherContactNumber,
        year,
        passwordUpdated,
      });
      await newStudent.save();
      const subjects = await Subject.find({ department, year });
      if (subjects.length !== 0) {
        for (var i = 0; i < subjects.length; i++) {
          newStudent.subjects.push(subjects[i]._id);
        }
      }
      await newStudent.save();
      return res.status(200).json({
        success: true,
        message: "Student registerd successfully",
        response: newStudent,
      });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
  };

  exports.getAllStudent = async (req, res) => {
    try {
      const students = await Student.find();
      res.status(200).json(students);
    } catch (error) {
      console.log("Backend Error", error);
    }
  };