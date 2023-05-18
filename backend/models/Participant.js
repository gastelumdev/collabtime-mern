const mongoose = require("mongoose");
const { stringify } = require("querystring");

const ParticipantSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        unique: [true, "email already exists in database!"],
        lowercase: true,
        trim: true,
        required: [true, "email not provided"],
        validate: {
          validator: function (v) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
          },
          message: '{VALUE} is not a valid email!'
        }
    },
    status: {
        type: String,
        require: true,
    },
    street: {
        type: String,
        requier: false,
    },
    city: {
        type: String,
        requier: false,
    },
    state: {
        type: String,
        requier: false,
    },
    zipcode: {
        type: String,
        requier: false,
    },
    band_director_name: {
        type: String,
        requier: false,
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }
});

const Participant = mongoose.model("Participant", ParticipantSchema);

module.exports = Participant;