const express = require('express');

const Product = require("./products.router.js");
const User = require("./users.router.js");
const Auth = require("./auth.router.js");

const apiRouter = express.Router();

apiRouter.use("/products", Product);
apiRouter.use("/users", User);
apiRouter.use("/auth", Auth);

module.exports = apiRouter;