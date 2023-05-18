var express = require("express"),
  router = express.Router(),
  verifyToken = require('../middleware/authJWT');

const nodemailer = require("nodemailer");

const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });

console.log(process.env.EMAIL_HOST, process.env.EMAIL_PASS, process.env.EMAIL_USER)

router.post("/inviteParticipant", verifyToken, async (request, response) => {
    if (request.user) {
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
            to: 'collabtime@zohomail.com',   // list of receivers
            subject: 'Sending Email using Node.js',
            text: 'That was easy!',
            html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>',
        };

        transporter.sendMail(mailData, function (err, info) {
            if(err)
              return console.log(err)
            else
              response.status(200).send({message: "Mail sent", message_id: info.messageId})
         });
    }
})

module.exports = router;