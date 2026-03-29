const fs = require('fs');
const path = require('path');
const { sequelize, testConnection } = require('../config/database');
const { User, Article, Note, Review, Travel } = require('../models');

// 读取 JSON 文件
const readJsonFile = (filename) => {
  const filePath = path.resolve(__dirname, '../data', filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`文件不存在：${filePath}`);
  }
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// 迁移用户数据
const migrateUsers = async () => {
  try {
    console.log('📝 开始迁移用户数据...');
    const users = readJsonFile('users.json');
    
    for (const userData of users) {
      await User.findOrCreate({
        where: { id: userData.id },
        defaults: userData,
      });
    }
    
    console.log(`✅ 成功迁移 ${users.length} 个用户`);
  } catch (error) {
    console.error('❌ 用户数据迁移失败:', error);
  }
};

// 迁移文章数据
const migrateArticles = async () => {
  try {
    console.log('📝 开始迁移文章数据...');
    const articles = readJsonFile('articles.json');
    
    for (const articleData of articles) {
      // 移除可能存在的 userId 字段，统一设置为 nayuta 的 ID
      const { userId, ...restData } = articleData;
      await Article.findOrCreate({
        where: { id: articleData.id },
        defaults: {
          ...restData,
          userId: 1, // 所有数据都属于 nayuta 用户
        },
      });
    }
    
    console.log(`✅ 成功迁移 ${articles.length} 篇文章`);
  } catch (error) {
    console.error('❌ 文章数据迁移失败:', error);
  }
};

// 迁移笔记数据
const migrateNotes = async () => {
  try {
    console.log('📝 开始迁移笔记数据...');
    const notes = readJsonFile('notes.json');
    
    for (const noteData of notes) {
      // 移除可能存在的 userId 字段，统一设置为 nayuta 的 ID
      const { userId, ...restData } = noteData;
      await Note.findOrCreate({
        where: { id: noteData.id },
        defaults: {
          ...restData,
          userId: 1, // 所有数据都属于 nayuta 用户
        },
      });
    }
    
    console.log(`✅ 成功迁移 ${notes.length} 篇笔记`);
  } catch (error) {
    console.error('❌ 笔记数据迁移失败:', error);
  }
};

// 迁移评论数据
const migrateReviews = async () => {
  try {
    console.log('📝 开始迁移评论数据...');
    const reviews = readJsonFile('reviews.json');
    
    for (const reviewData of reviews) {
      // 移除可能存在的 userId 字段，统一设置为 nayuta 的 ID
      const { userId, ...restData } = reviewData;
      await Review.findOrCreate({
        where: { id: reviewData.id },
        defaults: {
          ...restData,
          userId: 1, // 所有数据都属于 nayuta 用户
        },
      });
    }
    
    console.log(`✅ 成功迁移 ${reviews.length} 条评论`);
  } catch (error) {
    console.error('❌ 评论数据迁移失败:', error);
  }
};

// 迁移旅行记录数据
const migrateTravels = async () => {
  try {
    console.log('📝 开始迁移旅行记录数据...');
    const travels = readJsonFile('travels.json');
    
    for (const travelData of travels) {
      // 移除可能存在的 userId 字段，统一设置为 nayuta 的 ID
      const { userId, ...restData } = travelData;
      await Travel.findOrCreate({
        where: { id: travelData.id },
        defaults: {
          ...restData,
          userId: 1, // 所有数据都属于 nayuta 用户
        },
      });
    }
    
    console.log(`✅ 成功迁移 ${travels.length} 条旅行记录`);
  } catch (error) {
    console.error('❌ 旅行记录数据迁移失败:', error);
  }
};

// 执行所有迁移
const migrateAll = async () => {
  try {
    console.log('🚀 开始数据迁移...\n');
    
    await testConnection();
    
    // 同步数据库结构
    await sequelize.sync();
    console.log('✅ 数据库表结构已就绪\n');
    
    // 执行所有迁移
    await migrateUsers();
    await migrateArticles();
    await migrateNotes();
    await migrateReviews();
    await migrateTravels();
    
    console.log('\n🎉 所有数据迁移完成！');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 数据迁移失败:', error);
    process.exit(1);
  }
};

migrateAll();
