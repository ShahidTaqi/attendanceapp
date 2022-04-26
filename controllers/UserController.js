const User = require("../models/User");
const Attendance = require("../models/Attendance");
// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };

    // incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered';
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect';
    }

    // duplicate email error
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    // validation errors
    if (err.message.includes('user validation failed')) {
        // console.log(err);
        Object.values(err.errors).forEach(({ properties }) => {
            // console.log(val);
            // console.log(properties);
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}



module.exports.get_users = async(req, res) => {
    try {
        const users = await User.find({});
        
        console.log(users);
    res.send({users});
        
    } catch (err) {
        const errors = handleErrors(err);
        res.send({ errors });
    }

}

module.exports.delete_user = (req, res) => {

    User.deleteOne({ _id: req.params.userId }, (err) => {
        if (err) {
            console.log(err.message);
            res.send({ success: false });
        } else {
            res.send({ success: true });
        }
    });

}
module.exports.signup_post = async(req, res) => {
    const { name, email, password, phone, role } = req.body;

    try {
        const user = await User.create({ name, email, role, password, phone });

        console.log(user);
        res.send({ user });
    } catch (err) {
        const errors = handleErrors(err);
        res.send({ errors });
    }

}

module.exports.login_post = async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        res.send({ user });
    } catch (err) {
        const errors = handleErrors(err);
        res.send({ errors });
    }

}





module.exports.get_user = (req, res) => {
    const userId = req.params.userId;
    User.findOne({ _id: userId }, function(err, user) {
        if (err) {
            res.send({ err });
        } else {
            res.send({ user });
        }
    });

}

module.exports.update_user = async(req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            role: req.body.role,
        }, { new: true })
        res.send({ user });
    } catch (err) {
        const errors = handleErrors(err);
        res.send({ errors });
    }

}