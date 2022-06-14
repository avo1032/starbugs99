const express = require('express');
const Posts = require('../schemas/posts');
const { connect } = require('mongoose');
const Comment = require('../schemas/comment');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware')
//middleware 추가해야함
connect();


//해당 포스트의 모든 댓글 조회
router.get('/comment/:postId', authMiddleware, async (req, res, next) => {
    try {
        const { postId } = req.params
        let comments = await Comment.find({ postId }).sort('-date').lean()
        for (let i = 0; i < comments.length; i++) {
            if (
                res.locals.user != null &&
                comments[i]['nickname'] == res.locals['user']['nickname']
            ) {
                comments[i]['mine'] = true
            } else comments[i]['mine'] = false
        }
        res.json({ comments: comments })
    } catch (err) {
        console.error(err)
        next(err)
    }
});


//댓글 작성
router.post('/comment', authMiddleware, async (req, res) => {
    const recentComment = await Comment.find().sort('-commentId').limit(1)
    let commentId = 1
    if (recentComment.length != 0) {
        commentId = recentComment[0]['commentId'] + 1
    }
    const nickname = res.locals['user']['nickname'] //local에서 나누어 가져옴
    const { postId, content } = req.body
    const date = new Date(+new Date() + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '');
    await Comment.create({ commentId, postId, content, nickname, date })
    res.status(200).send({
        result: "success",
      });
});


//댓글 삭제
router.delete('/comment/:commentId', async (req, res) => {
    const { commentId } = req.params
    await Comment.deleteOne({ commentId })
    res.send({ result: 'success' })
});


//댓글 수정
router.patch('/comment/:commentId', async (req, res) => {
    const { content, commentId } = req.body
    await Comment.updateOne({ commentId }, { $set: { content } })
    res.send({ result: 'success' })
});



module.exports = router; 