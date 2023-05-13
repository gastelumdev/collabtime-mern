const jwt = require("jsonwebtoken");
User = require("../models/User");

const verifyToken = (req, res, next) => {
    console.log(req.headers)
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jwt.verify(req.headers.authorization.split(' ')[1], process.env.API_SECRET || "myapisecret", async function (err, decode) {
      if (err) req.user = undefined;

      if (decode.id) {
        console.log(decode.id)
        const user = await User.findOne({
            _id: decode.id
          })
  
          console.log(user)
  
          try {
              req.user = user;
              next();
          } catch (error) {
              res.status(500).send({message: error});
        }
      } else {
        req.user = undefined;
        next();
      }

    });
  } else {
    req.user = undefined;
    next();
  }
};
module.exports = verifyToken;