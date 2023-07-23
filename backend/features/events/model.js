const mongoose = require("mongoose");
const {config} = require("./config")

const DataSchema = new mongoose.Schema(config.schema);

const model = mongoose.model(config.schemaName, DataSchema);

module.exports = model;