const { Router } = require('express');
const AttendanceController = require('../controllers/AttendanceController');

const router = Router();

router.get('/attendances', AttendanceController.getAttendances);
router.post('/attendances', AttendanceController.addAttendance);
router.get('/attendances/:attendanceId', AttendanceController.getAttendance);
router.patch('/attendances/:attendanceId', AttendanceController.updateAttendance);
router.delete('/attendances/:attendanceId', AttendanceController.deleteAttendance);

module.exports = router;