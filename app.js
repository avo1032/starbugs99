
const express = require("express");
const userRouter = require("./routes/users");
const cors = require("cors");
const app = express();
const connect = require("./schemas") 
const port = 3000;


connect();

const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");
const commentRouter = require("./routes/comment");

const requestMiddleware = (req, res, next) =>{
    console.log("Request URL:", req.originalUrl, " - ", new Date(), " - ");
    next();
}

app.use(cors());
app.use(requestMiddleware);
app.use(express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use("/api", [postsRouter], [usersRouter], [commentRouter]);

app.get("/", (req,res) =>{
    res.send("test!!")
});



app.listen(port,() =>{
    console.log(port, "포트로 서버가 켜졌어요!")
});