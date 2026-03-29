// 数据库配置文件
const { Sequelize } = require('sequelize');
const path = require('path');

// 创建 SQLite 数据库连接
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../data/database.sqlite'),
  logging: false, // 关闭 SQL 日志
  define: {
    timestamps: true, // 自动添加 createdAt 和 updatedAt
    underscored: true, // 使用下划线命名
  },
});

// 测试连接
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功!');
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
  }
};

module.exports = { sequelize, testConnection };
