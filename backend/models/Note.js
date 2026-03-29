const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Note = sequelize.define('Note', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  time: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  readTime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  desc: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  mood: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  weather: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  likeCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  commentCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'user_id',
  },
}, {
  tableName: 'notes',
  timestamps: true,
});

module.exports = Note;
