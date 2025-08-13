const express = require('express');
const router = express.Router();
const playController = require('../controllers/attendanceController.js');


router.post('/punch-in',playController.punchIn);
router.post('/punch-out',playController.punchOut);
router.get('/history',playController.getAttendanceHistory);



module.exports = router;