const express = require('express');

const apiRouter = require('./routers/index.router.js');
const port = 3003;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
