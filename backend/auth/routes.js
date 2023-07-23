var express = require("express"),
  router = express.Router(),
  verifyToken = require('../middleware/authJWT'),
  {
    signup,
    signin,
    getUser,
    getSession,
    logout
  } = require("./controller.js");

router.post("/register", signup, function (req, res) {

});

router.post("/login", signin, function (req, res) {

});

router.get("/user/:id", verifyToken, getUser);

router.get("/user/session/:id", verifyToken, getSession);

router.get("/logout/:id", verifyToken, logout);

module.exports = router;