var http = require('http');
var https = require('https');
http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;


const express = require("express");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");

const mongoose = require("mongoose");

const CONFIG = require("./config");

const miscRoutes = require("./routes/misc").miscRoutes;
const sessionRoutes = require("./routes/session").sessionRoutes;
const userRoutes = require("./routes/user").userRoutes;


let app = null;
let dbconn = mongoose.connect(
    `mongodb://${CONFIG.DATABASE.HOST}:${CONFIG.DATABASE.PORT}/${CONFIG.DATABASE.NAME}`,
    { useNewUrlParser: true, useUnifiedTopology: true }
);
let run = (async () => {
        console.log("App Initialize");
        app = express();
    })()
    .then(() => {
        app.setMaxListeners(Infinity);
        console.log("Express App Configuration");
        app.set("trust proxy", 1);
        app.use(morgan('combined'));
        app.use(compression());
        app.use(cors());
        app.use(express.json());
    })
    .then(() => {
        console.log("Register Subroutes Middleware");
        app.use("/misc", miscRoutes);
        app.use("/user", userRoutes);
        app.use("/session", sessionRoutes);
    })
    .then(() => {
        console.log("Run Server");
        app.listen(CONFIG.SERVICE.PORT, CONFIG.SERVICE.HOST, () => {
            console.log(`\n🚓 Authority is running at https://${CONFIG.SERVICE.HOST}:${CONFIG.SERVICE.PORT}`);
            console.log("");
        });
    })
    .then(() => {
        app = null;
        return "success";
    })
    .catch((err) => {
        console.log("Error Catched !");
        console.log(err);
        return `error_${err}`.replace("\n", "_").replace(" ", "_")
    });

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, exitCode) {
    if (options.cleanup) {
        console.log(`Express App: ${app}`);
        console.log(`Mongoose Connection: ${dbconn.toString()}`);
        console.log(`Run Result : ${run.toString()}`);
    }
    app = null;
    dbconn = null;
    run = null;
    if (exitCode || exitCode === 0) {
        console.log("exit_code", exitCode);
    }
    if (options.exit) {
        process.exit();
    }
}

//do something when app is closing
process.on("beforeExit", exitHandler.bind(null, {cleanup:true}));
process.on('exit', exitHandler.bind(null, {cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
    