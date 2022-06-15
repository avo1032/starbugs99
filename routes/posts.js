const express = require("express");
const router = express.Router();
const Posts = require("../schemas/posts");
const Users = require('../schemas/users');

const authMiddleware = require("../middlewares/auth-middleware");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./uploads"),
    filename: (req, file, cb) => cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
});
const upload = multer({ storage, 
    limits:{
        fileSize: 1024 * 1024 * 10,
    }
});


//게시글 전체조회 및 좋아요 top5
router.get("/posts", upload.single("imageTest"),async (req, res) => {   
    const postslist = await Posts.find();
    const mostLikedPost = await Posts.find().sort({likeCnt: -1}).limit(5)
    res.json({
        mostLikedPost, postslist
    });
});


//게시글 상세 조회
router.get("/detail/:postId", async (req, res) => {
    console.log(req.params)
    const { postId } = req.params;
    const [post] = await Posts.find({_id: postId});

    res.json({
        post
    })
})


// 게시글 작성
router.post("/posts", upload.single("imageTest"), authMiddleware, async (req, res) => {
    const { title, content } = req.body;
    const { userId } = res.locals.user;
    const imageUrl = req.file.filename;
    const user = await Users.findOne({userId: userId}).exec();
    const nickname = user.nickname;
    const createPosts = await Posts.create({ title: title, imageUrl: imageUrl,
        content: content, nickname: nickname,})
    res.json({ createPosts })
});



//게시글 삭제
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;

    const [user] = await Users.find({userId: userId});
    const [user2] = await Posts.find({_id: postId});

    if(user.nickname != user2.nickname){
        res.res.status(400).send({ errMessage: '작성자만 삭제할 수 있습니다.' });
        return;
    }
    const existsPosts = await Posts.find({ _id: postId })
    if(!existsPosts.length){
        res.status(400).json({ result: false });
    }else{
        await Posts.deleteOne({ _id: postId });
        res.status(200).json({ result: true });
    }
});


//게시글 수정
router.patch("/posts/:postId",upload.single("imageTest"), authMiddleware, async (req, res) => {   // 이미지 수정 미구현
    const { postId } = req.params;
    const { title, content } = req.body;
    const imageUrl = {imageUrl: req.file.filename};
    console.log(req.params);
    console.log(req.body);
    console.log(req.file.filename);

    
    const existsPosts = await Posts.find({ _id: postId })
    if(!existsPosts.length){
        res.status(400).json({ result: false });
    }else{
        await Posts.updateOne({ _id: postId }, { $set: { title: title, content: content, imageUrl: imageUrl } });
        res.json({ result: "success" });
    }
});


//좋아요 구현
router.post('/posts/like', async (req, res) => {
    const { userId, postId } = req.body;
    const userPost = await Posts.findOne({postId}).exec();
    const likeCnt = userPost.userLike.length
    const foundUser = userPost.userLike.find(i => i === userId)  //element로 찾음
    if(foundUser)  {
        await userPost.updateOne({$pull:{userLike: userId}})  //dislike
        await userPost.updateOne({$set: {likeCnt: likeCnt}})
    }else {
        await userPost.updateOne({$push:{userLike: userId}}) //like push
        await userPost.updateOne({$set: {likeCnt: likeCnt}})
    }
    const newuserPost = await Posts.findOne({postId}).exec();
    const newuserLike = newuserPost.userLike
    
    newuserPost.likeCnt = newuserPost.userLike.length
    const newLikecnt = newuserPost.likeCnt

    res.json({newuserLike, newLikecnt})
});



module.exports = router;