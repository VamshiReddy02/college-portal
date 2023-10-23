const express = require('express');
const {auth} = require('../middlewares/auth');
const {createAdmin, login, updatedPassword, updateAdmin, addAdmin, addDepartment, addFaculty, addSubject, addStudent, getAllAdmin, getAdmin, getAllFaculty, getAllDepartment, getAllSubject, getAllStudent, logout} = require('../controller/adminController');

const router = express.Router();

router.route('/createAdmin').post(createAdmin);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/updatedPassword', auth).post(updatedPassword);
router.route('/updateAdmin', auth).post(updateAdmin);
router.route('/addAdmin', auth).post(addAdmin);
router.route('/addDepartment', auth).post(addDepartment);
router.route('/addFaculty', auth).post(addFaculty);
router.route('/addSubject', auth).post(addSubject);
router.route('/addStudent', auth).post(addStudent);
router.route('/getAllAdmin',auth).get(getAllAdmin)
router.route('/getAdmin', auth).post(getAdmin);
router.route('/getAllFaculty', auth).get(getAllFaculty);
router.route('/getAllDepartment', auth).get(getAllDepartment);
router.route('/getAllSubject', auth).get(getAllSubject);
router.route('/getAllStudent', auth).get(getAllStudent);


module.exports = router;