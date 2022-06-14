const express = reuqire("express");
const User = require("../schemas/users");
const bcrypt = require("bcrypt");
const saltRounds = 10;

authRouter.post("/login", (req,res) =>{
    console.log(req.body);
});

authRouter.post("/register", async (req, res) => {
    const { userId, nickname, password } = req.body;
    // 빈값이 오면 팅겨내기
    if(
        userId === "" ||
        nickname === "" ||
        password === ""   
        ) {
        return res.status(400).json({ regisrerSuccess: false, Messsage: "정보를 입력하세요" });
    }
    // 유저 아이디가 같지 않으면 팅겨내기
    const sameUserId = await User.findOne({ userId});
  if (sameUserId !== null) {
    return res.status(400).json({
      registerSuccess: false,
      message: "이미 존재하는 아이디입니다",
    });
  }
  // 닉네임이 동일하면 팅겨내기
  const sameNickNameUser = await User.findOne({ nickname });
  if (sameNickNameUser !== null) {
    return res.status(400).json({
      registerSuccess: false,
      message: "이미 존재하는 닉네임입니다.",
    });
  }
//솔트 생성 및 해쉬화 진행
  bcrypt.genSalt(saltRounds, (err, salt) =>{
    //솔트 생성 실패시
    if(err)
    return res.status(500).json({
        registerSuccess: false,
        message: "비밀번호 해쉬화에 실패했습니다.",
    });
    // salt 생성에 성공시 hash진행

    bcrypt.hash(password,salt, async (err,hash) =>{
        if(err)
        return res.status(500).json({
            registerSuccess: false,
        message: "비밀번호 해쉬화에 실패했습니다.",
        });
    //비밀번호를 해쉬된 값으로 대체
    password = hash;

    const user =await new User({
        userId,
        nickname,
        password,
    });

    user.save((err) => {
        if (err) return res.status(400).json({ registerSuccess: fasle, message: err });
    });
    return res.json({ registerSuccess: true });
    });
  });
});
