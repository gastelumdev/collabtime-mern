const mongoose = require('mongoose');
require("dotenv").config();

const connectDB = async () => {
    try {
        // const conn = await mongoose.connect(process.env.MONGODB_URI);
        const conn = await mongoose.connect("mongodb+srv://gastelumdev:2JHUX4jhJ02Pk5oP@collabtime-mern.tpmchkg.mongodb.net/?retryWrites=true&w=majority");
        console.log(`Mongo db connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;