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

// const DEBUG = process.env.DEBUG || false;
const origin = process.env.DEBUG ? "http://localhost:3000" : "https://collabtime.onrender.com";

// middleware
const corsOptions = {
    origin: origin
    // origin: "https://collabtime.onrender.com"
}

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOptions));

console.log(process.env)

// connect MongoDB
// mongoose.connect(process.env.MONGODB_URI).then(() => {
//     const PORT = process.env.PORT || 8000
//     app.listen(PORT, () => {
//         console.log(`App is Listening on PORT ${PORT}`);
//     })
// }).catch(err => {
//     console.log(err);
// });

// route
// app.get("/", async (req, res) => {
//     let collection = await 
//     res.status(201).json({message: "Connected to Backend!"});
// });

// app.get("/events", async (request, response) => {
//     const events = await eventModel.find({});

//     try {
//         response.send(events);
//     } catch (error) {
//         response.status(500).send(error);
//     }
// })

// app.post("/create_event", async (request, response) => {
//     const event = new eventModel(request.body);

//     try {
//         await event.save();
//         response.send(event);
//     } catch (error) {
//         response.status(500).send(error);
//     }
// });

app.use(userRoutes);
app.use(eventRoutes);

app.listen(process.env.PORT || 4000);