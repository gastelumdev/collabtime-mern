const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const app = express();
const userRoutes = require("./routes/user");
const eventRoutes = require("./routes/event");
const participantRoutes = require("./routes/participant");
const messageRoutes = require("./routes/message")
const cors = require("cors");
const bodyparser = require("body-parser");
const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, './.env') });
const connectDB = require('./config/db');
const eventModel = require("./models/Event");

connectDB();

console.log(process.env.MONGODB_URI)

// middleware
const corsOptions = {
    origin: process.env.CORS_URL
}

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOptions));

console.log(process.env);

app.use(userRoutes);
app.use(eventRoutes);
app.use(participantRoutes);
app.use(messageRoutes);

app.listen(process.env.PORT || 4000);