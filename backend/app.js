const express = require("express");
const mongoose = require("mongoose");
const app = express();
const userRoutes = require("./routes/user");
const eventRoutes = require("./routes/event")
const cors = require("cors");
const bodyparser = require("body-parser");
require("dotenv").config();
const connectDB = require('./config/db');
const eventModel = require("./models/Event");

connectDB();

// middleware
const corsOptions = {
    origin: "https://collabtime.onrender.com"
    // origin: "http://localhost:3000"
}

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOptions));

console.log(process.env);

app.use(userRoutes);
app.use(eventRoutes);

app.listen(process.env.PORT || 4000);