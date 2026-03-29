const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Travel = sequelize.define('Travel', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  province: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'user_id',
  },
}, {
  tableName: 'travels',
  timestamps: false,
});

module.exports = Travel;
