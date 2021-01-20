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
    const user = await User.findOne({ username: username });
    return user != null ?
    { status: true, content: user }
        :
    { status: false, content: "user_not_found" }
};

/**
 * Check if user credential is valid via username and password
 * 
 * @param {*} email 
 */
module.exports.checkIfUserCredentialsValid = async (
    username,
    password
) => {
    const user = await User.findOne({ username: username });
    if(user == null){
        return {
            status: false,
            content: "unauthorized"
        };
    }

    if(!await Utils.comparePassword(user.password, user.salt, password)){
        return {
            status: false,
            content: "unauthorized"
        }
    }

    return {
        status: true,
        content: user
    }
}

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
    { status: false, content: "user_not_found"}
};

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
    // Check if username exist
    const checkUsername = await this.getUserByUsername(username);
    if(checkUsername.status){
        throw Error("user_exist");
    }

    // Check if Email Exist
    const checkEmail = await this.getUserByEmail(email);
    if(checkEmail.status){
        throw Error("email_exist")
    }

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
};

/**
 * Change User Password
 * 
 * @param {string} username Target Username
 * @param {string} last_password Last Remembered Password
 * @param {string} new_password New Password
 */
module.exports.changePassword = async (
    username,
    last_password,
    new_password
) => {
    // Gather User
    let user = await this.getUserByUsername(username);
    if(!user.status){
        return {
            status: false,
            content: user.content
        };
    }
    user = user.content;

    // Check if last password valid
    if(!await Utils.comparePassword(user.password, user.salt, last_password)){
        return {
            status: false,
            content: "unauthorized"
        };
    }

    // Check if new password is not the same as before
    if(new_password == last_password){
        return {
            status: false,
            content: "unauthorized"
        };
    }

    /* Generate New Salt */
    const newSalt = await Utils.generateSalt();

    /* Hash New Password with created salt */
    const newPassword = await Utils.hashPassword(new_password, newSalt);

    user.salt = newSalt;
    user.password = newPassword;

    await user.save();

    return {
        status: true,
        content: user
    };
}

/**
 * Change User Email
 * 
 * @param {string} username Target Username
 * @param {string} last_email last known email
 * @param {string} new_email new email
 */
module.exports.changeEmail = async (
    username,
    last_email,
    new_email
) => {
    // Gather User
    let user = await this.getUserByUsername(username);
    if(!user.status){
        throw Error(user.content);
    }

    if(user.email != last_email){
        throw Error("email_not_found");
    }

    if(user.email == new_email){
        throw Error("email_same_as_before");
    }

    user.email = new_email;
    await user.save();

    return {
        status: true,
        content: user
    };
}