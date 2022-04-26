const mongoose = require('mongoose');


const attendanceSchema = new mongoose.Schema({
    inTime: {
        type: String,
        required: [true, "Please enter the In Time!"]
    },
    outTime: {
        type: String,
        required: [true, 'Please enter the Out Time!'],
    },
    lateDuration: {
        type: String,
        required: [true, "Please enter Late Duration"]
    },
    date: {
        type: String,
        required: [true, "Please select Attendance Date!"]
    },
    dutyDuration: {
        type: String,
        required: [true, "Please enter the dutyDuration!"]
    },
    idNumber: {
        type:String,
        required:[true, "Please provide the idNumber"],
    }


});




const Attendance = mongoose.model('attendance', attendanceSchema);

module.exports = Attendance;