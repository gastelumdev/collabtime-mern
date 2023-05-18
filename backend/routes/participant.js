var express = require("express"),
  router = express.Router(),
  verifyToken = require('../middleware/authJWT');
const { default: mongoose } = require("mongoose");
const participantModel = require("../models/Participant");
const nodemailer = require("nodemailer");

const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });

router.get("/participants/:eventId", verifyToken, async (request, response) => {
    console.log("Params: ", request.params)
    if (request.user) {
        const participants = await participantModel.find({event: request.params.eventId});

        console.log("Participants: ", participants);

        try {
            response.send(participants);
        } catch (error) {
            response.status(500).send(error);
        }
    } else {
        response.status(403).send({message: "Not Authorized"});
    }
});

router.post("/participants", verifyToken, async (request, response) => {
    console.log("Request Body: ", request.body)
    if (request.user) {
        const participant = new participantModel(request.body);

        

        try {
            await participant.save();

            console.log(participant)

            const transporter = nodemailer.createTransport({
                port: 465,               // true for 465, false for other ports
                host: process.env.EMAIL_HOST,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                    },
                secure: true,
            });
    
            const mailData = {
                from: process.env.EMAIL_USER,  // sender address
                to: request.body.email,   // list of receivers
                subject: 'Welcome to AFOB',
                // text: 'That was easy!',
                html: '<h1>AFOB Information Request Form</h1><p>Please follow the link below to submit your participation information.</p><a href="'+ process.env.CORS_URL +'/participants/form/'+ participant._id +'">Participant Form</a>',
            };
    
            transporter.sendMail(mailData, function (err, info) {
                if(err)
                  return console.log(err)
                else
                  response.status(200).send(participant)
             });

            //  response.status(200).send(participant)
        } catch (error) {
            console.log(error)
            response.status(500).send(error);
        }
    } else {
        response.status(403).send({message: "Not Authorized"});
    }
})

router.get("/participant/:id", async (request, response) => {
    const res = await participantModel.findById(request.params.id);
    console.log(res)
    try {
        response.send(res);
    } catch (error) {
        response.status(500).send(error);
    }
})

router.post("/participants/update/:id", verifyToken, async (request, response) => {
    if (request.user) {
        console.log("Try to edit", request.params.id);

        try {
            const res = await participantModel.findByIdAndUpdate(request.params.id, request.body)
            console.log("Update res:", res);
            response.send(res);
        } catch (error) {
            response.status(500).send(error);
        }
    }
})

router.post("/participants/delete/:id", verifyToken, async (request, response) => {
    if (request.user) {
        console.log("Try to delete", request.params.id);

        try {
            const res = await participantModel.findByIdAndDelete(request.params.id);
            console.log("Delete res:", res)
            response.send(res);
        } catch (error) {
            response.status(500).send(error);
        }
    } else {
        response.status(403).send({message: "Not Authorized"});
    }
})

router.post("/#/participants/update/form/:id", async (request, response) => {
    
    console.log("Try to edit", request.body);

    try {
        const res = await participantModel.findByIdAndUpdate(request.params.id, request.body)
        console.log("Update res:", res);
        response.send(res);
    } catch (error) {
        response.status(500).send(error);
    }
})

module.exports = router;