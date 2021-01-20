const Session = require("../models/session").Session;
const UserController = require("./user");
const Utils = require("../utils");


/**
 * Create New Session
 * 
 * @param {string} username target username, owner of this session
 */
module.exports.newSession = async (username) => {
    const session = new Session({
        username: username
    });

    const sstatus = await session.save();
    console.log(sstatus);
    return {
        status: false,
        content: session
    };
}

/**
 * Get Session
 * 
 * @param {string} session_id target session to be search
 */
module.exports.getSession = async (session_id) => {
    const session = await Session.findOne({ _id: session_id });
    if(session == null){
        return {
            status: false,
            content: "session_not_found"
        };
    }

    return {
        status: true,
        content: session
    };
}

/**
 * Get Active Session
 * 
 * get currently active session which owned by specific username,
 * active session gathered can be new or existing session. depending on
 * the expiry.
 * 
 * @param {string} username target username, owner of to-be-gathered session
 */
module.exports.getActiveSession = async (username) => {
    const target_creation = new Date();
    const target_expiry = new Date();
    target_expiry.setHours(target_expiry.getHours() + 1);

    const sessions = await Session.find({
        username: username,
        created: {
            $lte: target_creation
        },
        expiry: {
            $gte: target_expiry
        }
    })

    if(Utils.checkItemsContaintsNulls([sessions]) || sessions.length <= 0){
        // Generate new Session
        return await this.newSession(username);
    }
    let newestSession = sessions[0];
    for(let session of sessions){
        if(session.expiry >= newestSession.expiry){
            newestSession = session;
        }
    }

    return {
        status: true,
        content: newestSession
    }
}

/**
 * Login ( Create Session )
 * @param {string} username username
 * @param {string} password password
 */
module.exports.login = async (username, password) => {
    let user = await UserController.checkIfUserCredentialsValid(
        username,
        password
    );
    if(!user.status){
        throw Error(user.content);
    }
    user = user.content;

    let session = await this.getActiveSession(
        username
    );
    if(!session.status){
        throw Error("unauthorized");
    }

    return {
        status: true,
        content: session.content._id
    }
}

/*****--------- SESSION DATA ---------***/
// Store Data
module.exports.store = async (session_id, new_data) => {
    if([new_data.key, new_data.value].includes(null)){
        throw Error("data_not_valid");
    }
    // TODO: do data.key checking wheter the type of it is string or not
    
    let session = await this.getSession(session_id);
    if(!session.status) return { status: false, content: session.content }
    session = session.content;

    new_data.key = `${new_data.key}`.toLowerCase();

    /* Check If Session Already contain the same key */
    for(let data of session.datas){
        if(data.key.toLowerCase() == new_data.key){
            throw Error("key_already_exist");
        }
    }
    
    // Update Session Expiry
    const sessionNewExpiry = new Date();
    sessionNewExpiry.setHours(sessionNewExpiry.getHours() + 24);
    session.expiry = sessionNewExpiry;

    // Add Data to session
    if(new_data.expiry == null || new_data.expiry == undefined){
        // Add Expiry if doesn't exist
        const dataExpiry = new Date();
        dataExpiry.setHours(dataExpiry.getHours() + 1);
        new_data.expiry = dataExpiry;
    }
    session.datas.push(new_data);

    await session.save();

    return {
        status: true,
        content: session._id
    };
}

// Get Data
module.exports.getData = async (session_id, target_key) => {
    let session = await this.getSession(session_id);
    if(!session.status) throw Error(session.content);
    session = session.content;

    // Search for Session Data
    for(let data of session.datas){
        if(data.key.toLowerCase() == target_key.toLowerCase()){
            return { status: true, content: data };
        }
    }

    throw Error("key_not_found");
}

// Update Data
module.exports.updateData = async (session_id, target_key, new_value) => {
    let session = await this.getSession(session_id);
    if(!session.status) throw Error(session.content);
    session = session.content;

    let i=0;
    for(i=0; i<session.datas.length; i++){
        if(session.datas[i].key.toLowerCase() == target_key.toLowerCase()){
            session.datas[i].value = new_value
            break;
        }
    }

    await session.save();


    return {
        status: true,
        content: session.datas[i]
    };
}

// Delete Data
module.exports.deleteData = async(session_id, target_key) => {
    let session = await this.getSession(session_id);
    if(!session.status) throw Error(session.content);
    session = session.content;

    let new_datas = [];
    let deleted_keys = [];
    let i=0;
    for(i=0; i<session.datas.length; i++){
        if(session.datas[i].key.toLowerCase() == target_key.toLowerCase()){
            deleted_keys.push(session.datas[i].key);
            continue;
        }
        new_datas.push(session.datas[i]);
    }

    session.datas = new_datas;
    await session.save();

    return {
        status: true,
        content: deleted_keys
    };
}