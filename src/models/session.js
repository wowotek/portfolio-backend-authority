const Mixed = require("mongoose").Schema.Types.Mixed;
const Schema = require("mongoose").Schema;
const model = require("mongoose").model;


const SessionModels = {
    username: {
        // User username
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true,
        default: () => {
            return new Date();
        }
    },
    expiry: {
        type: Date,
        required: true,
        default: () => {
            let now = new Date();
            now.setHours(now.getHours() + 24);
            return now;
        }
    },
    datas: {
        type: [
            {
                key: {
                    type: String,
                    required: true
                },
                value: {
                    type: Mixed,
                    required: true
                },
                expiry: {
                    type: Date,
                    required: true,
                    default: () => {
                        let now = new Date();
                        now.setHours(now.getHours() + 1);
                        return now
                    }
                }
            }
        ],
        required: false
    }
}

const SessionSchema = new Schema(SessionSchema);
const Session = model("session", SessionSchema);

module.exports = {
    SessionModels,
    SessionSchema,
    Session
};