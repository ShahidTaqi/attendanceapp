const Holiday = require("../models/Holiday");
// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {};

    // incorrect email
    if (err.message === 'incorrect date') {
        errors.date = 'That date is not correct!';
    }




    // validation errors
    if (err.message.includes('holiday validation failed')) {
        // console.log(err);
        Object.values(err.errors).forEach(({ properties }) => {
            // console.log(val);
            // console.log(properties);
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}



module.exports.getHolidays = async (req, res) => {
    try {
        const holidays = await Holiday.find({});
        res.send({ holidays });
    } catch (err) {
        const errors = handleErrors(err);
        res.send({ errors });
    }


}

module.exports.deleteHoliday = (req, res) => {

    Holiday.deleteOne({ _id: req.params.holidayId }, (err) => {
        if (err) {
            console.log(err.message);
            res.send({ success: false });
        } else {
            res.send({ success: true });
        }
    });
}

module.exports.addHoliday = async (req, res) => {

    try {


        
        const { date } = req.body;

        const holiday = new Holiday({date});

        await holiday.save();

        res.send({ holiday });

    } catch (err) {
        const errors = handleErrors(err);
        res.send({ errors });
    }

}






module.exports.getHoliday = (req, res) => {
    const holidayId = req.params.holidayId;
    Holiday.findOne({ _id: holidayId }, function (err, holiday) {
        if (err) {
            res.send({ err });
        } else {
            res.send({ holiday });
        }
    });

}

module.exports.updateHoliday = async (req, res) => {
    try {
        const holiday = await Holiday.findByIdAndUpdate(req.params.holidayId, {
            date: req.body.date,
        }, { new: true })
        res.send({ holiday });
    } catch (err) {
        const errors = handleErrors(err);
        res.send({ errors });
    }

}