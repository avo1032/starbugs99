const mongoose = require('mongoose')


const { Schema } = mongoose
const UsersSchema = new Schema({


    userId: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },

});

module.exports = mongoose.model('User', UsersSchema,);
