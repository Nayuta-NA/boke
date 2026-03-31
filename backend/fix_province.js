const { Sequelize } = require('sequelize');
const path = require('path');

// 创建数据库连接
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'data/database.sqlite'),
  logging: false,
});

async function fixProvince() {
  try {
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功\n');

    // 将'云南省'改为'云南'
    const [result] = await sequelize.query(`
      UPDATE articles 
      SET province = '云南'
      WHERE province = '云南省'
    `);

    console.log('✅ 成功更新', result, '条记录\n');
    
    // 验证修改结果
    const [yunnan] = await sequelize.query(`
      SELECT id, title, province, city 
      FROM articles 
      WHERE province = '云南'
    `);
    
    console.log('📋 更新后的云南记录:');
    console.table(yunnan);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 错误:', error);
    process.exit(1);
  }
}

fixProvince();
