const express = require("express");
const Product = require("../models/products.model.js");
const router = express.Router();

// const { mongo } = require("mongoose");

// 상품 작성
router.post("/products", async (req, res) => {
  try {
    if (!req.body) {
      // 입력받을 값마다 유효성 검사 철저히
      // body 값을 입력받지 못한 경우
      return res
        .status(400)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }

    // 상품명, 내용, 작성자, 비밀번호 req로 입력받기
    const { title, content, author, password } = req.body;

    const newProduct = new Product({
      title,
      content,
      author,
      password,
    });
    await newProduct.save();
    res.status(201).json({ message: "판매 상품을 등록하였습니다." });
  } catch (error) {
    // 사실 에러 로깅해야 됨
    res.status(500).json({ message: "예기치 못한 에러가 발생하였습니다." });
  }
});

// 상품 목록 조회
router.get("/products", async (req, res) => {
  try {
    // id, 상품명, 작성자, 상태, 날짜(내림차순)
    const products = await Product.find()
      .select("_id title author status createdAt")
      .sort({ createdAt: -1 });

    res.json({ products });
  } catch (error) {
    // 에러 로깅
    res.status(500).json({ message: "예기치 못한 에러가 발생하였습니다." });
  }
});

// 상품 상세 조회
router.get("/product/:productId", async (req, res) => {
  try {
    // id, 상품명, 내용, 작성자, 상태, 날짜
    const product = await Product.findById(req.params.productId).select(
      "_id title content author status createdAt",
    );

    if (!product) {
      return res.status(404).json({ message: "상품 조회에 실패했습니다." });
    }

    res.json({ product });
  } catch (error) {
    // 에러 로깅 해야함
    res.status(500).json({ message: "예기치 못한 에러가 발생하였습니다." });
  }
});

// 상품 수정
router.put("/product/:productId", async (req, res) => {
  try {
    if (!req.body || !req.params) {
      // 유효성검사 꼼꼼하게 수정
      return res
        .status(400)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }

    // 상품명, 내용, 비밀번호, 상태
    const { title, content, password, status } = req.body;
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: "상품 조회에 실패했습니다." });
    }

    if (password !== product.password) {
      return res
        .status(401)
        .json({ message: "상품을 수정할 권한이 존재하지 않습니다." });
    }

    product.title = title;
    product.content = content;
    product.status = status;

    await product.save();
    res.json({ message: "상품 정보를 수정하였습니다." });
  } catch (error) {
    // 에러 로깅 해야함
    res.status(500).json({ message: "예기치 못한 에러가 발생하였습니다." });
  }
});

// 상품 삭제
router.delete("/product/:productId", async (req, res) => {
  try {
    if (!req.body || !req.params) {
      // 유효성검사 꼼꼼하게 수정
      return res
        .status(400)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }

    // 상품명, 내용, 비밀번호, 상태
    const productId = req.params.productId;
    const { password } = req.body;
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: "상품 조회에 실패했습니다." });
    }

    if (password !== product.password) {
      return res
        .status(401)
        .json({ message: "상품을 수정할 권한이 존재하지 않습니다." });
    }

    await product.deleteOne({ id: productId });
    res.json({ message: "상품을 삭제하였습니다." });
  } catch (error) {
    // 에러 로깅 해야함
    res.status(500).json({ message: "예기치 못한 에러가 발생하였습니다." });
  }
});

module.exports = router;