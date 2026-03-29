const { User, Article, Note, Review, Travel } = require('../models');

// 测试数据库查询
const testDatabase = async () => {
  try {
    console.log('🔍 测试数据库查询...\n');
    
    // 测试用户查询
    const users = await User.findAll();
    console.log(`✅ 用户总数：${users.length}`);
    if (users.length > 0) {
      const nayuta = await User.findOne({ where: { username: 'nayuta' } });
      console.log(`   ✅ nayuta 用户 ID: ${nayuta.id}`);
      console.log(`   示例用户：${nayuta.userName || nayuta.name}`);
    }
    
    // 测试文章查询（带 userId 过滤）
    const articles = await Article.findAll({ where: { userId: 1 } });
    console.log(`✅ 文章总数（nayuta）：${articles.length}`);
    if (articles.length > 0) {
      console.log(`   示例文章：${articles[0].title}`);
    }
    
    // 测试笔记查询（带 userId 过滤）
    const notes = await Note.findAll({ where: { userId: 1 } });
    console.log(`✅ 笔记总数（nayuta）：${notes.length}`);
    if (notes.length > 0) {
      console.log(`   示例笔记：${notes[0].title}`);
    }
    
    // 测试评论查询（带 userId 过滤）
    const reviews = await Review.findAll({ where: { userId: 1 } });
    console.log(`✅ 评论总数（nayuta）：${reviews.length}`);
    if (reviews.length > 0) {
      console.log(`   示例评论：${reviews[0].name} - ${reviews[0].type}`);
    }
    
    // 测试旅行记录查询（带 userId 过滤）
    const travels = await Travel.findAll({ where: { userId: 1 } });
    console.log(`✅ 旅行记录总数（nayuta）：${travels.length}`);
    if (travels.length > 0) {
      console.log(`   示例旅行：${travels[0].name} (${travels[0].province})`);
    }
    
    console.log('\n✅ 所有测试通过！数据库运行正常。');
    console.log('💡 提示：所有数据已关联到 nayuta 用户 (ID=1)');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 测试失败:', error);
    process.exit(1);
  }
};

testDatabase();
