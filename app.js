require("dotenv").config();

const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3003;

const Product = require('./routers/products.router.js');
const User = require('./routers/users.router.js');
const connect = require('./models/index.js');
connect();

app.use(express.json());
app.use(cookieParser());
app.use('/api', Product);
app.use('/auth', User);

app.get('/', (req, res) => {
    res.send("Hello, World!");
  });

  app.listen(port, () => {
    console.log(port, "포트로 서버가 열렸어요!");
  });