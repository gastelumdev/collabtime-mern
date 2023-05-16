var express = require("express"),
  router = express.Router(),
  verifyToken = require('../middleware/authJWT');
  const eventModel = require("../models/Event");

router.get("/events", verifyToken, async (request, response) => {
    if (request.user) {
        const events = await eventModel.find({});

        try {
            response.send(events);
        } catch (error) {
            response.status(500).send(error);
        }
    } else {
        response.status(403).send({message: "Not Authorized"});
    }
    
});

router.post("/events", verifyToken, async (request, response) => {
    if (request.user) {
        const event = new eventModel(request.body);

        try {
            await event.save();
            response.send(event);
        } catch (error) {
            response.status(500).send(error);
        }
    } else {
        response.status(403).send({message: "Not Authorized"});
    }
});

module.exports = router;