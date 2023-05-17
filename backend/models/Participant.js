const mongoose = require("mongoose");

const ParticipantSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        require: true,
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }
});

const Participant = mongoose.model("Participant", ParticipantSchema);

module.exports = Participant;