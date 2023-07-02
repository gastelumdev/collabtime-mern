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
    band_director_phone: {
        type: String,
        requier: false,
    },
    band_director_email: {
        type: String,
        requier: false,
    },
    booster_parent_name: {
        type: String,
        requier: false,
    },
    booster_parent_phone: {
        type: String,
        requier: false,
    },
    booster_parent_email: {
        type: String,
        requier: false,
    },
    parade_march_title: {
        type: String,
        requier: false,
    },
    parade_march_composer: {
        type: String,
        requier: false,
    },
    additional_band_staff_names: {
        type: String,
        requier: false,
    },
    drum_major: {
        type: String,
        requier: false,
    },
    drum_major_name: {
        type: String,
        requier: false,
    },
    color_guard_advisor: {
        type: String,
        requier: false,
    },
    color_guard_captains: {
        type: String,
        requier: false,
    },
    drill_team: {
        type: String,
        requier: false,
    },
    drill_team_advisor: {
        type: String,
        requier: false,
    },
    drill_team_captains: {
        type: String,
        requier: false,
    },
    school_enrollment: {
        type: String,
        requier: false,
    },
    number_of_students_in_band: {
        type: Number,
        requier: false,
    },
    number_of_students_in_color_guard: {
        type: Number,
        requier: false,
    },
    number_of_students_in_drill_team: {
        type: Number,
        requier: false,
    },
    number_of_buses: {
        type: Number,
        requier: false,
    },
    number_of_box_trucks: {
        type: Number,
        requier: false,
    },
    number_of_trailers: {
        type: Number,
        requier: false,
    },
    number_of_tractor_trailer_rigs: {
        type: Number,
        requier: false,
    },
    special_instructions: {
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