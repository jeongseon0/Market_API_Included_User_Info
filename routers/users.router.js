const express = require("express");
const jwt = require("jsonwebtoken");
const { Users } = require("../models/users.js");
const router = express.Router();

// 회원가입 API
router.post("/signup", async (req, res) => {
  if (!email || !name || !password || !confirmPassword)
    return res
      .status(400)
      .json({ success: false, message: "입력되지 않은 정보가 있습니다." });

  const { email, name, password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    return res.status(404).json({
      success: false,
      message: "비밀번호 확인이 비밀번호와 일치하지 않습니다.",
    });

  const isExistUser = await Users.findOne({ where: { email } });

  if (isExistUser)
    return res
      .status(409)
      .json({ success: false, message: "이미 가입된 이메일입니다." });

  const user = await Users.create({ email, name, password });

  return res
    .status(201)
    .json({ success: true, message: "회원가입이 완료되었습니다." });
});

// 로그인 API
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ where: { email } });

  if (!user || user.password !== password)
    return res.status(401).json({
      success: false,
      message: "가입되지 않은 이메일 또는 일치하지 않는 비밀번호입니다.",
    });

  const token = jwt.sign(
    {
      userId: user.userId,
    },
    "suns_secret_key"
  );
  res.cookie("authorization", `Bearer ${token}`);
  return res
    .status(200)
    .json({ success: true, message: "로그인에 성공했습니다." });
});

module.exports = router;
