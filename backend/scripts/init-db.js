const { sequelize, testConnection } = require('../config/database');
const { User, Article, Note, Review, Travel } = require('../models');

// 同步数据库（创建表）
const syncDatabase = async () => {
  try {
    console.log('🔄 开始同步数据库...');
    
    // 强制同步（删除后重建）
    await sequelize.sync({ force: true });
    
    // 创建 article_categories 表
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS article_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        userId INTEGER NOT NULL,
        isDefault BOOLEAN DEFAULT false,
        cardType VARCHAR(20) DEFAULT 'card1',
        [order] INTEGER DEFAULT 0,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    console.log('✅ 数据库同步完成！');
    console.log('✅ 所有表已创建：');
    console.log('   - users');
    console.log('   - articles');
    console.log('   - notes');
    console.log('   - reviews');
    console.log('   - travels');
    console.log('   - article_categories');
    
    // 初始化默认用户
    console.log('\n👤 初始化默认用户...');
    const userNow = new Date().toISOString();
    await User.findOrCreate({
      where: { id: 1 },
      defaults: {
        name: 'nayuta',
        email: 'admin@example.com',
        password: '$2b$10$XYZ123456789', // 占位密码
        avatar: '/default-avatar.png',
        role: 'admin',
        createdAt: userNow,
        updatedAt: userNow
      }
    });
    console.log('   ✓ 默认用户已创建 (ID: 1, 用户名：nayuta)');
    
    // 初始化默认分类
    console.log('\n📋 初始化默认分类...');
    const defaultCategories = [
      { name: '旅游', isDefault: true, order: 0, cardType: 'card1' },
      { name: '前端', isDefault: true, order: 1, cardType: 'card2' },
      { name: '生活', isDefault: true, order: 2, cardType: 'card2' },
    ];
    
    const now = new Date().toISOString();
    for (const category of defaultCategories) {
      await sequelize.query(`
        INSERT INTO article_categories (name, userId, isDefault, cardType, [order], createdAt, updatedAt)
        VALUES (?, 1, ?, ?, ?, ?, ?)
      `, {
        replacements: [category.name, category.isDefault, category.cardType, category.order, now, now]
      });
      console.log(`   ✓ 创建分类:${category.name} (${category.cardType})`);
    }
    
    console.log('\n✅ 默认分类初始化完成!');
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
