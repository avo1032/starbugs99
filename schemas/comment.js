const mongoose = require('mongoose')
const { Schema } = mongoose
const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Comment', commentSchema)