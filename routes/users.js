
const express = require("express");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const User = require("../schemas/users");
const router = express.Router();


  const postUsersSchema = Joi.object({
    userId: Joi
        .string()
        .required(),
    nickname: Joi
        .string()
        .required(),
    password: Joi
        .string()
        .required()
  });
  
//회원가입
router.post("/register", async (req, res) => {
    try {
      const {
        userId,
        nickname,
        password,
      } = await postUsersSchema.validateAsync(req.body);

      const existUsers = await User.find({
        $or: [{ userId }, { nickname }],
      });
      if (existUsers.length) {
        res.status(400).send({
          errorMessage: "이미 가입된 이메일 또는 닉네임이 있습니다.",
        });
        return;
      }

      const user = new User({ userId, nickname, password });
      await user.save();
      res.status(201).send({ message: "회원가입이 완료!" });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
      });
    }
  });


//로그인
  const postAuthSchema = Joi.object({
    userId: Joi.string().required(),
    password: Joi.string().required(),
  });
  
  router.post("/login", async (req, res) => {
    try {
      console.log(userId, password);
      const { userId, password } = await (req.body);
      const user = await User.findOne({ userId, password }).exec();
      if (!user) {
        res.status(400).send({
          errorMessage: "이메일 또는 패스워드가 잘못됐습니다.",
        });
        return;
      }
      const token = jwt.sign({ userId: user.userId }, "my-secret-key");
      res.send({
        token,
      });

    } catch (err) {
        console.log(err);
      res.status(400).send({
        errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
      });
    }
  });

  module.exports = router;