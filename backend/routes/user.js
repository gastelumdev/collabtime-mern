var express = require("express"),
  router = express.Router(),
  verifyToken = require('../middleware/authJWT'),
  {
    signup,
    signin,
    getUser,
    getSession
  } = require("../controllers/auth.js");

router.post("/register", signup, function (req, res) {

});

router.post("/login", signin, function (req, res) {

});

router.get("/user/:id", verifyToken, getUser);

router.get("/user/session/:id", verifyToken, getSession);

router.get("/hiddencontent", verifyToken, function (req, res) {
    if (!req.user) {
      res.status(403)
        .send({
          message: "Invalid JWT token"
        });
    }
    if (req.user.role == "admin") {
      res.status(200)
        .send({
          message: "Congratulations! but there is no hidden content"
        });
    } else {
      res.status(403)
        .send({
          message: "Unauthorised access"
        });
    }
  });

module.exports = router;