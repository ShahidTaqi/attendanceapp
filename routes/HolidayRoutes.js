const { Router } = require('express');
const HolidayController = require('../controllers/HolidayController');

const router = Router();

router.get('/holidays', HolidayController.getHolidays);
router.post('/holidays', HolidayController.addHoliday);
router.get('/holidays/:holidayId', HolidayController.getHoliday);
router.patch('/holidays/:holidayId', HolidayController.updateHoliday);
router.delete('/holidays/:holidayId', HolidayController.deleteHoliday);

module.exports = router;