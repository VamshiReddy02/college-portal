const express = require('express');
const { studentLogin, attendance} = require('../controller/studentController');
const {auth} = require('../middlewares/auth');

const router = express.Router();

router.route('/studentLogin').post(studentLogin)
router.route('/attendance', auth).post(attendance)

module.exports = router;