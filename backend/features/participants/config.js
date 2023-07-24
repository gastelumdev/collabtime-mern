const mongoose = require("mongoose");

exports.config = {
    name: "participants",
    altName: "participant",
    parentFeature: "event",
    schemaName: "Participant",
    schema: {
        name: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            unique: [false, "email already exists in database!"],
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
        order_number: {
            type: Number,
            require: true,
        },
        division: {
            type: String,
            require: false,
        },
        performance_time: {
            type: String,
            require: false,
        },
        status: {
            type: String,
            require: true,
        },
        street: {
            type: String,
            require: false,
        },
        city: {
            type: String,
            require: false,
        },
        state: {
            type: String,
            require: false,
        },
        zipcode: {
            type: String,
            require: false,
        },
        band_director_name: {
            type: String,
            require: false,
        },
        band_director_phone: {
            type: String,
            require: false,
        },
        band_director_email: {
            type: String,
            require: false,
        },
        booster_parent_name: {
            type: String,
            require: false,
        },
        booster_parent_phone: {
            type: String,
            require: false,
        },
        booster_parent_email: {
            type: String,
            require: false,
        },
        parade_march_title: {
            type: String,
            require: false,
        },
        parade_march_composer: {
            type: String,
            require: false,
        },
        additional_band_staff_names: {
            type: String,
            require: false,
        },
        drum_major: {
            type: String,
            require: false,
        },
        drum_major_name: {
            type: String,
            require: false,
        },
        color_guard_advisor: {
            type: String,
            require: false,
        },
        color_guard_captains: {
            type: String,
            require: false,
        },
        drill_team: {
            type: String,
            require: false,
        },
        drill_team_advisor: {
            type: String,
            require: false,
        },
        drill_team_captains: {
            type: String,
            require: false,
        },
        school_enrollment: {
            type: String,
            require: false,
        },
        number_of_students_in_band: {
            type: Number,
            require: false,
        },
        number_of_students_in_color_guard: {
            type: Number,
            require: false,
        },
        number_of_students_in_drill_team: {
            type: Number,
            require: false,
        },
        number_of_buses: {
            type: Number,
            require: false,
        },
        number_of_box_trucks: {
            type: Number,
            require: false,
        },
        number_of_trailers: {
            type: Number,
            require: false,
        },
        number_of_tractor_trailer_rigs: {
            type: Number,
            require: false,
        },
        special_instructions: {
            type: String,
            require: false,
        },
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event"
        }
    },
    orderedList: true,
    inputRequest: true,
    emailOptions: {
        from: '#{sender}',
        to: '#{recipient}',
        subject: 'Welcome to AFOB',
        html: '<h1>AFOB Information Request Form</h1><p>Please follow the link below to submit your participation information.</p><a href="#{url}/#/participants/form/#{id}">Participant Form</a>',
    }
};