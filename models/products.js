'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Products.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    userId: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('FOR_SALE', 'SOLD_OUT'),
      defaultValue: 'FOR_SALE'
    }
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};