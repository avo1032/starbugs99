const mongoose = require("mongoose");

const PostsSchema = new mongoose.Schema({
      nickname: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true, 
      },
      content: {
        type: String,
        required: true
      },    
      date: {
        type: Date,
        default: Date.now(),
        
      },
      imageUrl: { 
        type: String,
        required: true
      },
      likeCnt: {
        type: Number,
        default: 0,
      },
      commentCnt: {
        type: Number,
        default: 0,
      },
      userLike: {
        type: Array,
        required: true,
      }
    });

module.exports = mongoose.model("Posts", PostsSchema,);