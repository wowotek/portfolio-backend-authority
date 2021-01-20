const express = require("express");

const SessionController = require("../controllers/session");
const Utils = require("../utils");


const sessionRoutes = express.Router();

/* Login */
sessionRoutes.post("/login", async (req, res) => {
    let username = null;
    let password = null;
    (async () => {
        username = req.body.username;
        password = req.body.password;
    })()
    .then(async () => {
        if(await Utils.checkItemsContaintsNulls([username, password])){
            res.status(400);
            res.json({
                status: "invalid_request"
            });
            return;
        }
    })
    .then(async () => {
        SessionController.login(username, password).then(result => {
            res.status(200);
            res.json({
                status: "success",
                content: result.content
            });
        }).catch(err => {
            res.status(403);
            res.json({
                status: err.message
            })
        });
    })
})

/* Get Session */
sessionRoutes.get("/:session_id", async (req, res) => {
    const session_id = req.params.session_id;

    if(await Utils.checkItemsContaintsNulls([session_id])){
        res.status(400);
        res.json({
            status: "invalid_request"
        });
        return;
    }

    const session = await SessionController.getSession(session_id);
    if(!session.status){
        res.status(400);
        res.json({
            status: session.content
        });
        return;
    }

    res.status(200);
    res.json({
        status: session.content
    });
    return;
})

/* Get Session Data */
sessionRoutes.get("/:session_id/:data_key", async (req, res) => {
    const session_id = req.params.session_id;
    const data_key = req.params.data_key;

    if(await Utils.checkItemsContaintsNulls([session_id, data_key])){
        res.status(400);
        res.json({
            status: "invalid_request"
        });
        return;
    }

    const data = await SessionController.getData(
        session_id,
        data_key
    ).then(resp => {
        return resp.content
    }).catch(error => {
        console.log("Error Raised !");
        console.log(error);
        return error;
    });

    res.status(200);
    res.json({
        status: "success",
        content: data.content
    });
});

/* Store Data */
sessionRoutes.post("/:session_id/:data_key", async (req, res) => {
    const session_id = req.params.session_id;
    const data_key = req.params.data_key;
    const value = req.body.value;

    if(await Utils.checkItemsContaintsNulls([session_id, data_key, value])){
        res.status(400);
        res.json({
            status: "invalid_request"
        });
        return;
    }

    const data = await SessionController.store(
        session_id,
        { key: data_key, value: value }
    ).then(result => {
        if(result.status) return result.content;
    }).catch(err => {
        return err
    });

    res.status(201);
    res.json({
        status: "success",
        content: data
    });
    return;
});

/* Update Data */
sessionRoutes.put("/:session_id/:data_key", async (req, res) => {
    const session_id = req.params.session_id;
    const data_key = req.params.data_key;
    const value = req.body.value;

    if(await Utils.checkItemsContaintsNulls([session_id, data_key, value])){
        res.status(400);
        res.json({
            status: "invalid_request"
        });
        return;
    }

    res.status(201);
    res.json({
        status: "success",
        content: await SessionController.updateData(session_id, data_key, value)
    });
});

/* Delete Data */
sessionRoutes.delete("/:session_id/:data_key", async (req, res) => {
    const session_id = req.params.session_id;
    const data_key = req.params.data_key;

    if(await Utils.checkItemsContaintsNulls([session_id, data_key])){
        res.status(400);
        res.json({
            status: "invalid_request"
        });
        return;
    }

    res.status(201);
    res.json({
        status: "success",
        content: await SessionController.deleteData(session_id, data_key)
    });
});


module.exports = {
    sessionRoutes
};