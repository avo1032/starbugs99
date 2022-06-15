const express = require("express");
const userRouter = require("./routes/users");
const cors = require("cors")
const app = express();
const connect = require("./schemas") 
const port = 3000;
const authMiddleware = require('./middlewares/auth-middleware')

const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");
const commentRouter = require("./routes/comment");
connect();



app.use(cors());
app.use(express.static('uploads'));
app.use(express.json());

app.use("/api", [postsRouter], [commentRouter ],[usersRouter],);

app.get("/", (req,res) =>{
    res.send("test!!")
});

app.use(express.urlencoded({extended:false}));

app.use("/api/users", [userRouter]);
app.listen(port,() =>{
    console.log(port, "포트로 서버가 켜졌어요!")
});