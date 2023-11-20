require("dotenv").config();

const express = require('express');
const app = express();
const port = 3002;

const Product = require('./routers/products.router.js');
const Auth = require('./routers/auth.router.js');
const connect = require('./models/index.js');
connect();

app.use(express.json());
app.use('/api', Product);
app.use('/auth', Auth);

app.get('/', (req, res) => {
    res.send("Hello, World!");
  });

  app.listen(port, () => {
    console.log(port, "포트로 서버가 열렸어요!");
  });