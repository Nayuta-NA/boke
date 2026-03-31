const path = require('path');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'data/database.sqlite'),
  logging: false,
});

async function checkData() {
  try {
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功\n');
    
    // 查询所有有省份的记录
    const [results] = await sequelize.query(`
      SELECT id, title, province, city 
      FROM articles 
      WHERE province IS NOT NULL
    `);
    
    console.log('📋 所有包含省份的文章:');
    console.table(results);
    
    // 特别检查云南的记录
    const [yunnan] = await sequelize.query(`
      SELECT id, title, province, city 
      FROM articles 
      WHERE province LIKE '%云南%'
    `);
    
    console.log('\n 云南相关记录:');
    console.table(yunnan);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 错误:', error);
    process.exit(1);
  }
}

checkData();
