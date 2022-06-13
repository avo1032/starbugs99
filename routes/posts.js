const express = require("express");
const router = express.Router();
const Posts = require("../schemas/posts")

const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./uploads"),
    filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage })

router.get("/posts", upload.single("imageTest"),async (req, res) => {   
    const postslist = await Posts.find();
    
    const best5 = await Posts.find().sort({likeCnt: -1}).limit(5)
    res.json({
        best5, postslist
    })
})


router.post("/posts", upload.single("imageTest"), async (req, res) => {   //upload.single(imageTest)의 'img'는 formData 의 key값 / img key 의 value값을 서버의 지정된 폴더에 저장.
    const { title, content } = req.body;
    const nickname = '닉네임5';
    const imageName = req.file.filename;
    const createPosts = await Posts.create({ title: title, imageUrl: imageName,
    content: content, nickname: nickname })
    res.json({ posts: createPosts })
})

router.delete("/posts/:postId", async (req, res) => {
    const { postId } = req.params;
    
    const existsPosts = await Posts.find({ _id: postId })
    if(!existsPosts.length){
        res.status(400).json({ result: false });
    }else{
        await Boards.deleteOne({ _id: postId });
        res.status(200).json({ result: true });
    }
})

router.patch("/posts/:postId", async (req, res) => {   // 이미지 수정 미구현
    const { postId } = req.params;
    const { title, content } = req.body;
    
    const existsPosts = await Posts.find({ _id: postId })

    if(!existsPosts.length){
        res.status(400).json({ result: false });
    }else{
        await Posts.updateOne({ _id: boardsId }, { $set: { title, content } });
        res.json({ result: "success" });
    }
})


module.exports = router;