const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false
    },
});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;