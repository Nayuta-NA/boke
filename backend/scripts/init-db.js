const { sequelize, testConnection } = require('../config/database');
const { User, Article, Note, Review, Travel } = require('../models');

// 同步数据库（创建表）
const syncDatabase = async () => {
  try {
    console.log('🔄 开始同步数据库...');
    
    // 强制同步（删除后重建）
    await sequelize.sync({ force: true });
    
    // 普通同步（如果表不存在则创建）
    // await sequelize.sync();
    
    console.log('✅ 数据库同步完成！');
    console.log('✅ 所有表已创建：');
    console.log('   - users');
    console.log('   - articles');
    console.log('   - notes');
    console.log('   - reviews');
    console.log('   - travels');
  } catch (error) {
    console.error('❌ 数据库同步失败:', error);
  }
};

// 初始化数据库
const initDatabase = async () => {
  await testConnection();
  await syncDatabase();
  process.exit(0);
};

initDatabase();
