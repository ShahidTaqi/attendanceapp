const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const serveStatic = require('serve-static')
const path = require('path')
const UserRoutes = require("./routes/UserRoutes");
const AttendanceRoutes = require("./routes/AttendanceRoutes");
const HolidayRoutes = require("./routes/HolidayRoutes");

//here we are configuring dist to serve app files
app.use('/', serveStatic(path.join(__dirname, '/dist')))

// this * route is to serve project on different page routes except root `/`
app.get(/.*/, function (req, res) {
    res.sendFile(path.join(__dirname, '/dist/index.html'))
})


const port = process.env.port || 3000;
app.use(bodyParser.json());
app.use(cors());


const dbURI = "mongodb://shahid:Erumj7VO3ajMeBvr@vue-shard-00-00.iholf.mongodb.net:27017,vue-shard-00-01.iholf.mongodb.net:27017,vue-shard-00-02.iholf.mongodb.net:27017/attendance-manager?ssl=true&replicaSet=atlas-9uti0p-shard-0&authSource=admin&retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(port, () => console.log("Server is running at port 3000")))
    .catch((err) => console.log(err.message));

app.use(UserRoutes);
app.use(AttendanceRoutes);
app.use(HolidayRoutes);