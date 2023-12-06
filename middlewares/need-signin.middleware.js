const jwt = require('jsonwebtoken');
const security = require('../config/config.js');
const db = require('../models/index.model.js');
const { Users } = db;

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers.authorization;

    if (!authorization) {
      return res.status(400).json({ message: '인증 정보가 없습니다.' });
    }
    const [tokenType, token] = authorization.split(' ');
    if (tokenType !== 'Bearer') {
      return res.status(400).json({ success: false, message: '토큰 타입이 일치하지 않습니다.' });
    }

    if (!token) {
      return res.status(400).json({ message: 'Access Token이 없습니다.' });
    }

    const decodedToken = jwt.verify(token, security.token_secretKey);
    const { userId } = decodedToken;

    const user = (await Users.findByPK(userId)).toJSON();

    if (!user) {
      return res.status(400).json({ message: '존재하지 않는 사용자입니다.' });
    }
    delete user.password;
    res.locals.user = user;

    next();
  } catch (error) {
    res.clearCookie('authorization');
    return res.status(401).json({ message: '비정상적인 요청입니다.' });
  }
};
