const express = require('express');
const Sequelize = require('sequelize');
const authMiddleWare = require('../middlewares/need-signin.middleware.js');
const db = require('../models/index.model.js');

const productsRouter = express.Router();
const { Products, Users } = db;

// 상품 작성
productsRouter.post('', authMiddleWare, async (req, res) => {
  try {
    const { id: userId, name: userName } = res.locals.user;
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({ message: '제목을 입력해주세요.' });
    }

    if (!content) {
      return res.status(400).json({ message: '내용을 입력해주세요.' });
    }

    const newProduct = Products.create({ userId, title, content }).toJSON();

    res.status(201).json({ message: '판매 상품을 등록하였습니다.' });
  } catch (error) {
    res.status(500).json({ message: '예상치 못한 오류가 발생하였습니다.' });
  }
});

// 상품 목록 조회
productsRouter.get('', async (req, res) => {
  try {
    const { sort } = req.query;
    let upperCaseSort = sort?.toUpperCase();

    if (upperCaseSort !== 'ASC' && upperCaseSort !== 'DESC')
      upperCaseSort = 'DESC';

    // id, 상품명, 작성자, 상태, 날짜(내림차순)
    const products = await Product.findAll({
      attributes: [
        'id',
        'title',
        'content',
        'userId',
        'status',
        [Sequelize.col('user.name'), 'userName'],
        'createdAt',
        'updatedAt'
      ],
      order: [['createdAt', upperCaseSort]],
      include: { model: Users, as: 'user', attributes: [] }
    });

    res.status(200).json({ data: products });
  } catch (error) {
    res.status(500).json({ message: '예상치 못한 오류가 발생하였습니다.' });
  }
});

// 상품 상세 조회
productsRouter.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    // id, 상품명, 내용, 작성자, 상태, 날짜
    const product = await Products.findByPK(productId, {
      attributes: [
        'id',
        'title',
        'content',
        'userId',
        'status',
        [Sequelize.col('user.name'), 'userName'],
        'createdAt',
        'updatedAt'
      ],
      include: { model: Users, as: 'user', attributes: [] }
    });

    if (!product) {
      return res.status(404).json({ message: '상품 조회에 실패했습니다.' });
    }

    res.status(200).json({ data: product });
  } catch (error) {
    res.status(500).json({ message: '예상치 못한 오류가 발생하였습니다.' });
  }
});

// 상품 수정
productsRouter.put('/:productId', authMiddleWare, async (req, res) => {
  try {
    const { productId } = req.params;
    // 상품명, 내용, 비밀번호, 상태
    const { title, content, status } = req.body;
    const { id: userId, name: userName } = res.locals.user;

    if (!title && !content && !status) {
      return res.status(400).json({ message: '수정한 정보가 없습니다.' });
    }

    if (status !== 'FOR_SALE' || status !== 'SOLD_OUT') {
      return res.status(400).json({
        message: '상품의 판매상태가 올바르지 않습니다. (FOR_SALE or SOLD_OUT)'
      });
    }

    const product = await Product.findByPK(productId);

    if (!product) {
      return res.status(404).json({ message: '상품 조회에 실패했습니다.' });
    }

    if (product.userId !== userId) {
      return res.status(403).json({ message: '작성자만 수정할 수 있습니다.' });
    }

    await product.update(
      {
        ...(title && { title }),
        ...(content && { content }),
        ...(status && { status })
      },
      { where: { id: productId } }
    );

    res.status(200).json({ message: '상품 정보를 수정하였습니다.' });
  } catch (error) {
    res.status(500).json({ message: '예상치 못한 오류가 발생하였습니다.' });
  }
});

// 상품 삭제
productsRouter.delete('/:productId', authMiddleWare, async (req, res) => {
  try {
    // 상품명, 내용, 비밀번호, 상태
    const { productId } = req.params;
    const { id: userId, name: userName } = res.locals.user;

    const product = await Product.findByPK(productId);

    if (!product) {
      return res.status(404).json({ message: '상품 조회에 실패했습니다.' });
    }

    if (product.userId !== userId) {
      return res.status(403).json({ message: '작성자만 삭제할 수 있습니다.' });
    }

    await product.destroy({ where: { id: productId } });

    res.json({ message: '상품을 삭제하였습니다.' });
  } catch (error) {
    // 에러 로깅 해야함
    res.status(500).json({ message: '예상치 못한 오류가 발생하였습니다.' });
  }
});

module.exports = productsRouter;
