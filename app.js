
const express = require("express");
const userRouter = require("./routes/users");

const app = express();
const port = 3000;

app.use(express.urlencoded({extended:false}));
app.use("/api/users", [userRouter]);


app.listen(port,() =>{
    console.log(port, "포트로 서버가 켜졌어요!")
});