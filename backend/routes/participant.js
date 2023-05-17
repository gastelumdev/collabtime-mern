var express = require("express"),
  router = express.Router(),
  verifyToken = require('../middleware/authJWT');
const { default: mongoose } = require("mongoose");
const participantModel = require("../models/Participant");

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
            response.send(participant);
        } catch (error) {
            response.status(500).send(error);
        }
    } else {
        response.status(403).send({message: "Not Authorized"});
    }
})

module.exports = router;