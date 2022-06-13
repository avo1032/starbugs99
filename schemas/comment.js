const mongoose = require('mongoose')
const { Schema } = mongoose
const commentSchema = new Schema({
    commentId: {
        type: String,
        unique: true,
        required: true
      },
    postId: {
        type: Number,
        required: true,
    },
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