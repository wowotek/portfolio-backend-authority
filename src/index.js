var http = require('http');
var https = require('https');
const crypto = require("crypto");
http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;


const express = require("express");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");

const mongoose = require("mongoose");

const CONFIG = require("./config");

const miscRoutes = require("./routes/misc").miscRoutes;


let app = null;
mongoose.connect(
    `mongodb://${CONFIG.DATABASE.HOST}:${CONFIG.DATABASE.PORT}/${CONFIG.DATABASE.NAME}`,
    { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
        /** App Initialize **/
        app = express();
    })
    .then(() => {
        /** EXPRESS APP CONFIGURATION **/
        app.set("trust proxy", 1);
        app.use(morgan('combined'), {
            skip: async (req, res) => { return res.statusCode < 400}
        });
        app.use(compression());
        app.use(cors());
        app.use(express.json());
    })
    .then(() => {
        /** Register Subroutes Middleware **/
        app.use("/misc", miscRoutes);
    })
    .then(() => {
        /** Run Server **/
        app.listen(CONFIG.SERVICE.PORT, CONFIG.SERVICE.HOST, () => {
            console.log(`🚓 Authority is running at https://${CONFIG.SERVICE.HOST}:${CONFIG.SERVICE.PORT}`);
            console.log("");
        }).catch((err) => {
            console.log("Server Error");
            console.log(err);
        });
    })
    .catch((err) => {
        /** Error Catching **/
        console.log("Error Catched !");
        console.log(err);
    });