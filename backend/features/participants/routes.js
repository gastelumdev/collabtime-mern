var express = require("express"),
  router = express.Router(),
  verifyToken = require('../../middleware/authJWT');
const { config } = require("./config");
const { getData, createData, updateData, deleteData, getOneData, updateFormData } = require("./controller");

router.get(`/${config.name}/:dataId`, verifyToken, getData);

router.post(`/${config.name}`, verifyToken, createData);

router.get(`/${config.altName}/:id`, verifyToken, getOneData);

router.post(`/${config.name}/update/:id`, verifyToken, updateData);

router.post(`/${config.name}/delete/:id`, verifyToken, deleteData);

router.post(`/${config.name}/update/form/:id`, updateFormData);

module.exports = router;