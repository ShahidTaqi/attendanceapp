const mongoose = require('mongoose');


const holidaySchema = new mongoose.Schema({
    date: {
        type: String,
        unique:true,
        required: [true, "Please enter date of holiday!"]
    },

});




const Holiday = mongoose.model('holiday', holidaySchema);

Holiday.createIndexes();

module.exports = Holiday;