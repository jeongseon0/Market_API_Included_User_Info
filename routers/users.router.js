const express = require("express");
const { Users } = require("../models/users.js");
const router = express.Router();

router.post("/users", async(req,res) => {
    if (!email || !name || !password || !confirmPassword) return res.status(400).json({success:false, message: "입력되지 않은 정보가 있습니다."});

    const { email, name, password, confirmPassword } = req.body;

    if (password !== confirmPassword) return res.status(404).json({success:false, message: "비밀번호 확인이 비밀번호와 일치하지 않습니다."});

    const isExistUser = await Users.findOne({ where: { email } });

    if (isExistUser) return res.status(409).json({success:false, message: "이미 가입된 이메일입니다."});

    const user = await Users.create({email, name, password});

    return res.status(201).json({success:true, message: "회원가입이 완료되었습니다."});
});

module.exports = router;