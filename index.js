const winston = require("winston");
const express = require("express");
const config = require("config");
const app = express();
const serverless = require("serverless-http");
const router = express.Router();

require("./startup/logging")();
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

const port = process.env.PORT || config.get("port");
app.listen(port, () => winston.info(`Listening on port ${port}...`));
app.use("/.netlify/functions/api", router);
module.exports.handler = serverless(app);
