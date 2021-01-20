const express = require("express");


const miscRoutes = express.Router();


/* Ping */
miscRoutes.get("/ping", async (req, res) => {
    (async (req, res) => {
        res.json({
            status: "success",
            content: "pong!"
        });
    })(req, res);
});

/* Sanity Check */
miscRoutes.get("/sanity_check", async (req, res) => {
    // TODO: Implement Sanity Checking (Run-time Unit Test)
    res.json({
        status: "success",
        content: "sane"
    });
});


module.exports = {
    miscRoutes
};