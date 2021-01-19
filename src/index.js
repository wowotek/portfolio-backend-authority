var http = require('http');
var https = require('https');
http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");
const CONFIG = require("./config");

const miscRoutes = require("./routes/misc").miscRoutes;


let app = null;
mongoose
    .connect(
        `mongodb://${CONFIG.DATABASE.HOST}:${CONFIG.DATABASE.PORT}/${CONFIG.DATABASE.NAME}`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
        // Initialize Express
        app = express();
    })
    .then(() => {
        /** EXPRESS APP CONFIGURATION **/
        app.use(compression());
        app.use(cors());
        app.use(express.json());
        /** EXPRESS APP CONFIGURATION **/
    })
    .then(() => {
        // Add Express Routes !
        app.use("/misc", miscRoutes);
    })
    .then(() => {
        /**
         * Run Server
         */
        app.listen(CONFIG.SERVICE.PORT, CONFIG.SERVICE.HOST, () => {
            console.log("=-=-= Transaction API =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
            console.log(`⚡️[server]: Server is running at https://${CONFIG.SERVICE.HOST}:${CONFIG.SERVICE.PORT}`);
            console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
            console.log("");
        }
        );
    });