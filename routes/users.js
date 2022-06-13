// require("dotenv").config();
const express = require("express");
// const bcrypt = requrie("bcrypt");
const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const User = require("../schemas/users");
const authMiddleware = require("../middlewares/auth-middleware");
const { Router } = require("express");
const router = express.Router();


const postUsersSchema = Joi.object({
    // userId: 4~12글자, 알파벳 대소문자, 숫자 가능
    userId: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{4,12}$")).required(),
    // nickname: 2~16글자, 알파벳 대소문자, 숫자, 한글 가능
    nickname: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]{2,16}$"))
      .required(),
    password: Joi.string().min(6).max(18).required(),
  });
  

  
//회원가입
router.post("/register", async (req, res) => {
    try {
      const {
        userId,
        nickname,
        password,
      } = await postUsersSchema.validateAsync(req.body);
  
      if (password !== confirmPassword) {
        res.status(400).send({
          errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
        });
        return;
      }
  
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
    userId: Joi.string().min(3).max(12).required(),
    password: Joi.string().required(),
  });
  router.post("/login", async (req, res) => {
    try {
      const { userId, password } = await postAuthSchema.validateAsync(req.body);
  
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