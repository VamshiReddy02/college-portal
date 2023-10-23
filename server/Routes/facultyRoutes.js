const express = require("express");
const { facultyLogin, facultyUpdatedPassword, updateFaculty, getStudent, markAttendance } = require("../controller/facultyController");
const {auth} = require('../middlewares/auth');
const router = express.Router();

router.route('/facultyLogin').post(facultyLogin);
router.route('/facultyUpdatedPassword', auth).post(facultyUpdatedPassword);
router.route('/updateFaculty', auth).post(updateFaculty);
router.route('/getStudent', auth).get(getStudent);
router.route('/markAttendance', auth).post(markAttendance);

module.exports = router;