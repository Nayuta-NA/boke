const { sequelize } = require('../config/database');

const fixCategoryIds = async () => {
  try {
    console.log(' 开始修复分类 ID...');
    
    // 1. 查询所有分类（按 order 排序）
    const categories = await sequelize.query(
      'SELECT * FROM article_categories ORDER BY [order] ASC',
      { type: sequelize.QueryTypes.SELECT }
    );
    
    if (categories.length === 0) {
      console.log('✅ 没有分类需要修复');
      return;
    }
    
    console.log('修复前的分类:');
    categories.forEach(cat => {
      console.log(`  原 ID: ${cat.id}, 名称：${cat.name}, order: ${cat.order}`);
    });
    
    // 2. 备份旧数据
    const oldData = categories.map(cat => ({
      name: cat.name,
      userId: cat.userId,
      isDefault: cat.isDefault,
      cardType: cat.cardType,
      order: cat.order,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    }));
    
    console.log('\n📦 已备份旧数据');
    
    // 3. 删除旧表
    console.log('\n🗑️  删除旧表...');
    await sequelize.query('DROP TABLE IF EXISTS article_categories');
    
    // 4. 重新创建表
    console.log('📋 重新创建 article_categories 表...');
    await sequelize.query(`
      CREATE TABLE article_categories (
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
    
    // 5. 插入新数据（ID 会自动从 1 开始）
    console.log('💾 插入新数据...');
    for (let i = 0; i < oldData.length; i++) {
      const cat = oldData[i];
      const newId = i + 1;
      
      await sequelize.query(`
        INSERT INTO article_categories (id, name, userId, isDefault, cardType, [order], createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, {
        replacements: [
          newId,
          cat.name,
          cat.userId,
          cat.isDefault,
          cat.cardType,
          cat.order,
          cat.createdAt,
          cat.updatedAt,
        ],
        type: sequelize.QueryTypes.INSERT
      });
      
      console.log(`  ✅ 插入分类：ID=${newId}, 名称=${cat.name}`);
    }
    
    // 6. 验证结果
    const newCategories = await sequelize.query(
      'SELECT * FROM article_categories ORDER BY id ASC',
      { type: sequelize.QueryTypes.SELECT }
    );
    
    console.log('\n✅ 修复完成！');
    console.log('修复后的分类:');
    newCategories.forEach(cat => {
      console.log(`  新 ID: ${cat.id}, 名称：${cat.name}, order: ${cat.order}`);
    });
    
    // 7. 重置 AUTOINCREMENT 计数器
    await sequelize.query("DELETE FROM sqlite_sequence WHERE name='article_categories'");
    console.log('\n🔄 已重置 AUTOINCREMENT 计数器');
    
  } catch (error) {
    console.error('❌ 修复失败:', error);
    throw error;
  }
};

// 执行修复
fixCategoryIds().then(() => {
  console.log('\n✨ 所有操作完成');
  process.exit(0);
}).catch((err) => {
  console.error('\n💥 执行失败:', err);
  process.exit(1);
});
