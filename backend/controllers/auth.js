var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
var User = require("../models/User");

exports.signup = async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    role: req.body.role,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  const request = await user.save();

  try {
    res.send({message: "User registered successfully."});
  } catch (error) {
    res.send(error);
  }
};

exports.signin = async (req, res) => {
  const user = await User.findOne({
      email: req.body.email
    }, "username email password");
    console.log(user)
    try {
        console.log("Trying")
        if (!user) {
            console.log("Not user")
            res.status(404)
              .send({
                message: "User Not found."
              });
            }
        //comparing passwords
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      // checking if password was valid and send response accordingly
      if (!passwordIsValid) {
        res.status(401)
          .send({
            accessToken: null,
            message: "Invalid Password!"
          });
      }
      if (!passwordIsValid) {
        res.status(401)
          .send({
            accessToken: null,
            message: "Invalid Password!"
          });
      }
      //signing token with user id
      var token = jwt.sign({
        id: user.id
      }, process.env.API_SECRET || "myapisecret", {
        expiresIn: 86400
      });

      res.status(200)
        .send({
          user: {
            id: user._id,
            email: user.email,
            username: user.username,
          },
          message: "Login successfull",
          accessToken: token,
        });
    } catch (error) {
        res.status(500)
          .send({
            message: "Error: " + error
          });
    }
    
    // user.exec((err, user) => {
    //   if (err) {
    //     res.status(500)
    //       .send({
    //         message: err
    //       });
    //     return;
    //   }
    //   if (!user) {
    //     return res.status(404)
    //       .send({
    //         message: "User Not found."
    //       });
    //   }

    //   //comparing passwords
    //   var passwordIsValid = bcrypt.compareSync(
    //     req.body.password,
    //     user.password
    //   );
    //   // checking if password was valid and send response accordingly
    //   if (!passwordIsValid) {
    //     return res.status(401)
    //       .send({
    //         accessToken: null,
    //         message: "Invalid Password!"
    //       });
    //   }
    //   //signing token with user id
    //   var token = jwt.sign({
    //     id: user.id
    //   }, process.env.API_SECRET || "myapisecret", {
    //     expiresIn: 86400
    //   });

    //   //responding to client request with user profile success message and  access token .
    //   res.status(200)
    //     .send({
    //       user: {
    //         id: user._id,
    //         email: user.email,
    //         username: user.username,
    //       },
    //       message: "Login successfull",
    //       accessToken: token,
    //     });
    // });
};