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
})
// UsersSchema.virtual('userId').get(function () {
//     return this._id.toHexString()
// })
// UsersSchema.set('toJSON', {
//     virtuals: true,
// })


module.exports = mongoose.model('User', UsersSchema,);