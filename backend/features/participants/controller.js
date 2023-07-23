let Model = require("./model");
const {config} = require("./config");
const {helper} = require("../../utils/helper")
const nodemailer = require("nodemailer");

exports.getData = async (request, response) => {
    if (request.user) {
        console.log("parent feature", config.parentFeature)
        const data = await Model.find({[config.parentFeature]: request.params.dataId});

        try {
            response.send(data);
        } catch (error) {
            response.status(500).send(error);
        }
    } else {
        response.status(403).send({message: "Not Authorized"});
    }
};

exports.createData = async (request, response) => {
    if (request.user) {
        const data = new Model(request.body);

        try {
            await data.save();

            if (config.inputRequest) {
                const transporter = nodemailer.createTransport(
                    {
                        port: 465,               // true for 465, false for other ports
                        host: process.env.EMAIL_HOST,
                        auth: {
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASS,
                            },
                        secure: true,
                    }
                );
        
                const mailData = config.emailOptions;
                mailData.from = mailData.from.format({sender: process.env.EMAIL_USER})
                mailData.to = mailData.to.format({recipient: request.body.email});
                mailData.html = mailData.html.format({url: process.env.CORS_URL, id: data._id});
        
                transporter.sendMail(mailData, function (err, info) {
                    
                    if(err)
                      return console.log(err);
                    else
                        console.log(config.name, data)
                      response.status(200).send(data);
                 });
            } else {
                response.status(200).send(data);
            }
            
        } catch (error) {
            console.log(error)
            response.status(500).send(error);
        }
    } else {
        response.status(403).send({message: "Not Authorized"});
    }
};

exports.getOneData = async (request, response) => {
    const res = await Model.findById(request.params.id);
    
    try {
        response.send(res);
    } catch (error) {
        response.status(500).send(error);
    }
};

exports.updateData = async (request, response) => {
    if (request.user) {

        try {
            const res = await Model.findByIdAndUpdate(request.params.id, request.body);
            response.send(res);
        } catch (error) {
            response.status(500).send(error);
        }
    }
};

exports.deleteData = async (request, response) => {
    if (request.user) {
        try {
            const res = await Model.findByIdAndDelete(request.params.id);
            response.send(res);
        } catch (error) {
            response.status(500).send(error);
        }
    } else {
        response.status(403).send({message: "Not Authorized"});
    }
};

exports.updateFormData = async (request, response) => {

    try {
        const res = await Model.findByIdAndUpdate(request.params.id, request.body);
        response.send(res);
    } catch (error) {
        response.status(500).send(error);
    }
};