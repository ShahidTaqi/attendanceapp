const Attendance = require("../models/Attendance");
const User = require("../models/User");
// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {};

    // incorrect email
    if (err.message === 'incorrect inTime') {
        errors.inTime = 'That inTime is not correct!';
    }

    // incorrect password
    if (err.message === 'incorrect outTime') {
        errors.outTime = 'That outTime is incorrect';
    }
    // incorrect email
    if (err.message === 'incorrect date') {
        errors.date = 'That date is not correct!';
    }

    // incorrect password
    if (err.message === 'incorrect lateDuration') {
        errors.lateDuration = 'That lateDuration is incorrect';
    }



    // validation errors
    if (err.message.includes('attendance validation failed')) {
        // console.log(err);
        Object.values(err.errors).forEach(({ properties }) => {
            // console.log(val);
            // console.log(properties);
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}



module.exports.getAttendances = async (req, res) => {
    try {
        const attendances = await Attendance.find({});
        console.log(attendances);
        res.send({ attendances });
    } catch (err) {
        const errors = handleErrors(err);
        res.send({ errors });
    }


}

module.exports.deleteAttendance =  (req, res) => {

     Attendance.deleteOne({ _id: req.params.attendanceId }, (err) => {
        if (err) {
            console.log(err.message);
            res.send({ success: false });
        } else {
            res.send({ success: true });
        }
    });
}

module.exports.addAttendance = async (req, res) => {

    try {


        const { user } = req.body;
        console.log(user);
        const id = user._id;
        const { inTime, outTime, date, lateDuration, dutyDuration } = req.body;

        const attendance = new Attendance({ inTime, outTime, date, lateDuration, dutyDuration, idNumber: id });

        await attendance.save();

        res.send({ attendance });

    } catch (err) {
        const errors = handleErrors(err);
        res.send({ errors });
    }

}






module.exports.getAttendance = (req, res) => {
    const attendanceId = req.params.attendanceId;
    Attendance.findOne({ _id: attendanceId }, function (err, attendance) {
        if (err) {
            res.send({ err });
        } else {
            res.send({ attendance });
        }
    });

}

module.exports.updateAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.findByIdAndUpdate(req.params.attendanceId, {
            inTime: req.body.inTime,
            outTime: req.body.outTime,
            lateDuration: req.body.lateDuration,
            date: req.body.date,
            dutyDuration: req.body.dutyDuration
        }, { new: true })
        res.send({ attendance });
    } catch (err) {
        const errors = handleErrors(err);
        res.send({ errors });
    }

}