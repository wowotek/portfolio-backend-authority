const User = require("../models/user").User;
const Utils = require("../utils");


/**
 * Gather single user by username
 * 
 * @param {string} username target username
 */
module.exports.getUserByUsername = async (
    username
) => {
    const user = User.findOne({ username: username });
    return user != null ?
    { status: true, content: user }
        :
    { status: false, content: "user_not_found" }
};

/**
 * Gather single user by email
 * 
 * @param {string} email target email
 */
module.exports.getUserByEmail = async (
    email
) => {
    const user = User.findOne({ email: email });
    return user != null ?
    { status: true, content: user }
        :
    { status: false, contet: "user_not_found"}
}

/**
 * Create new User
 * 
 * @param {string} username A new
 * @param {string} email a new email
 * @param {string} password a literal password
 */
module.exports.addUser = async (
    username,
    email,
    password
) => {
    /* Generate Salt for each of new user */
    const newSalt = await Utils.generateSalt();
    /* Hash Password with created salt */
    const newPassword = await Utils.hashPassword(password, newSalt);

    /* Create User Model */
    const userModel = {
        username: username,
        email: email,
        password: newPassword,
        salt: newSalt
    };

    /* Create and Save to database */
    const user = new User(userModel);
    await user.save();

    return {
        status: user != null,
        content: user
    }
}