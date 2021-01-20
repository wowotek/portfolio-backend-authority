const Schema = require("mongoose").Schema;
const models = require("mongoose").model;


const UserModel = {
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true,
        default: () => {
            return new Date()
        }
    },
    is_deleted: {
        type: Boolean,
        required: true,
        default: false
    },
    activities: {
        type: [],
        required: false
    }
};

const UserSchema = new Schema(UserModel);
const User = models("users", UserSchema);


module.exports = {
    User
};