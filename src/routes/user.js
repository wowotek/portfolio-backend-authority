const express = require("express");

const UserController = require("../controllers/user");
const Utils = require("../utils");

const userRoutes = express.Router();

/* Register */
userRoutes.post("/", async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    Utils.checkItemsContaintsNulls([username, email, password])
    .then(async result => {
        if(result) {
            res.status(400);
            res.json({
                status: "invalid_request"
            });
            return;
        }
    })
    .then(async () => {
        UserController.addUser(username, email, password).then(async result => {
            if(!result.status){
                res.status(500);
                res.json({
                    status: result.content
                });
                return
            }
            res.status(201);
            res.json({
                status: "success"
            })
        });
    });
});

/* Change Password from dashboard */
userRoutes.put("/profile/:username/credentials/password", async (req, res) => {
    const username = req.params.username;
    const last_password = req.body.last_password;
    const new_password = req.body.new_password;
    Utils.checkItemsContaintsNulls([username, last_password, new_password])
    .then(async result => {
        if(result){
            res.status(400);
            res.json({
                status: "invalid_request"
            });
            return;
        }
    })
    .then(async () => {
        if(last_password == new_password){
            res.status(403);
            res.json({
                status: "unauthorized"
            })
        }
    })
    .then(async () => {
        UserController.changePassword(username, last_password, new_password).then(async result => {
            if(result.status){
                res.status(201);
                res.json({
                    status: "success"
                });
                return
            } 
            res.status(400);
            res.json({
                status: result.content
            })
        })
    })
});

/* Change Email from dashboard */
userRoutes.put("/profile/:username/credentials/email", async (req, res) => {
    const username = req.params.username;
    const last_email = req.body.last_email;
    const new_email = req.body.new_email;

    Utils.checkItemsContaintsNulls([username, last_email, new_email])
    .then(async result => {
        if(result){
            res.status(400);
            res.json({
                status: "invalid_request"
            });
            return;
        }
    })
    .then(async () => {
        UserController.changeEmail(username, last_email, new_email)
        .then(async result => {
            if(result.status){
                res.status(201);
                res.json({
                    status: "success"
                });
                return
            }
            res.status(500);
            res.json({
                status: "internal_server_error"
            });
        }).catch(async err => {
            res.status(400);
            res.json({
                status: err.message()
            });
        })
    })
})

module.exports = {
    userRoutes
}