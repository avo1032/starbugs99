const express = require("express");
const router = express.Router();
const Posts = require("../schemas/posts");
const Users = require('../schemas/users');

const { v4: uuid } = require("uuid");
const mime = require("mime-types");
const multer = require("multer");
const { response } = require("express");
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./uploads"),
    filename: (req, file, cb) => cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
});
const upload = multer({ storage, 
    limits:{
        fileSize: 1024 * 1024 * 10,
    }
});

router.get("/posts", upload.single("imageTest"),async (req, res) => {   
    const postslist = await Posts.find();
    
    // const mostLikedPost = await Posts.find().sort({likeCnt: -1}).limit(5)
    res.json({
        postslist
    })
})

router.get("/detail/:postId", async (req, res) => {
    const { postId } = req.params;
    const [post] = await Posts.find({_id: postId});

    res.json({
        post
    })
})

// 게시글 작성
router.post("/posts", upload.single("imageTest"), authMiddleware, async (req, res) => {   //upload.single(imageTest)의 'img'는 formData 의 key값 / img key 의 value값을 서버의 지정된 폴더에 저장.
    const { title, content } = req.body;
    const { userId } = res.locals.user;
    const imageUrl = req.file.filename;

    const [user] = await Users.find({_id: userId});
    const nickname = user.nickname;

    const createPosts = await Posts.create({ title: title, imageUrl: imageUrl,
    content: content, nickname: nickname })
    res.json({ posts: createPosts })
})

router.delete("/posts/:postId", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;

    const [user] = await Users.find({_id: userId});
    const [user2] = await Posts.find({_id: postId});
    
    if(user.nickname != user2.nickname){
        res.res.status(400).send({ errMessage: '작성자만 삭제할 수 있습니다.' });
        return;
    }
    
    const existsPosts = await Posts.find({ _id: postId })
    if(!existsPosts.length){
        res.status(400).json({ result: false });
    }else{
        await Boards.deleteOne({ _id: postId });
        res.status(200).json({ result: true });
    }
})

router.patch("/posts/:postId",upload.single("imageTest"), authMiddleware, async (req, res) => {   // 이미지 수정 미구현
    const { postId } = req.params;
    const { title, content } = req.body;
    const imageUrl = {imageUrl: req.file.filename};
    
    
    const existsPosts = await Posts.find({ _id: postId })

    if(!existsPosts.length){
        res.status(400).json({ result: false });
    }else{
        await Posts.updateOne({ _id: boardsId }, { $set: { title, content, imageUrl } });
        res.json({ result: "success" });
    }
})


module.exports = router;