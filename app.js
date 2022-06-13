const express = require("express");
const app = express();
const connect = require("./schemas") 
const port = 3000;

connect();

const postsRouter = require("./routes/posts");

app.use(express.json());

app.use("/api", [postsRouter]);

app.get("/", (req,res) =>{
    res.send("test!!")
});

app.listen(port,() =>{
    console.log(port, "포트로 서버가 켜졌어요!")
});