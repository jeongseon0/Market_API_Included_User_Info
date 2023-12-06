const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/index.model.js');
const security = require('../config/config.js');

const authRouter = express.Router();
const { Users } = db;

// 회원가입 API
authRouter.post('/signup', async (req, res) => {
  try {
    const { email, name, password, confirmPassword } = req.body;

    if (!email) {
      return res.status(400).json({ message: '이메일을 입력해주세요.' });
    }

    if (!name) {
      return res.status(400).json({ message: '이름을 입력해주세요.' });
    }

    if (!password) {
      return res.status(400).json({ message: '비밀번호를 입력해주세요.' });
    }

    if (!confirmPassword) {
      return res.status(400).json({ message: '비밀번호를 다시 한 번 입력해주세요.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: '비밀번호는 최소 6자 입니다.' });
    }

    if (password !== confirmPassword) {
      return res.status(404).json({ message: '입력한 비밀번호가 서로 일치하지 않습니다.' });
    }

    let emailValidationRegex = new RegExp('[a-z0-9._]+@[a-z]+.[a-z]{2,3}');
    const isValidEmail = emailValidationRegex.test(email);
    if (!isValidEmail) {
      return res.status(400).json({
        message: '올바른 이메일 형식이 아닙니다.'
      });
    }

    const ExistingUser = await Users.findOne({ where: { email } });

    if (ExistingUser) {
      return res.status(400).json({ message: '이미 가입된 이메일입니다.' });
    }

    const hashedPassword = bcrypt.hashSync(password, security.saltORrounds);

    const newUser = (await Users.create({ email, name, password: hashedPassword })).toJSON();

    return res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      data: { email, name }
    });
  } catch (error) {
    res.status(500).json({ message: '예상치 못한 오류가 발생하였습니다.' });
  }
});

// 로그인 API
authRouter.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: '이메일을 입력해주세요.' });
    }

    if (!password) {
      return res.status(400).json({ message: '비밀번호를 입력해주세요.' });
    }

    const user = (await Users.findOne({ where: { email } }))?.toJSON();
    const hashedPassword = user?.password ?? '';
    const passwordsMatched = bcrypt.compareSync(password, hashedPassword);

    if (!user || !passwordsMatched) {
      return res.status(401).json({
        message: '가입되지 않은 이메일 또는 일치하지 않는 비밀번호입니다.'
      });
    }

    const token = jwt.sign({ userId: user.id }, security.token_secretKey, {
      expiresIn: security.token_expiresIn
    });

    return res.status(200).json({ message: '로그인에 성공했습니다.', data: { token } });
  } catch (error) {
    res.status(500).json({ message: '예상치 못한 오류가 발생하였습니다.' });
  }
});

module.exports = authRouter;
