require('dotenv').config();

const development = {
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  host: process.env.MYSQL_HOST,
  dialect: 'mysql'
};

const security = {
  saltORrounds: Number.parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS, 10),
  token_secretKey: process.env.JWT_ACCESS_TOKEN_SECRET,
  token_expiresIn: '12h'
};

module.exports = development;
module.exports = security;
