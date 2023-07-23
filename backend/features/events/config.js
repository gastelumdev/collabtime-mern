const mongoose = require("mongoose");

exports.config = {
    name: "events",
    altName: "event",
    schemaName: "Event",
    schema: {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }
};