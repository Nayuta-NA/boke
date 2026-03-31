const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 数据库文件路径
const dbPath = path.join(__dirname, '../data/database.sqlite');
const db = new sqlite3.Database(dbPath);

// 添加"技术"分类到 article_categories 表
db.serialize(() => {
  // 检查是否已存在"技术"分类
  db.get(`SELECT * FROM article_categories WHERE name = '技术'`, (err, row) => {
    if (err) {
      console.error('查询失败:', err.message);
      return;
    }
    
    if (row) {
      console.log('"技术"分类已存在，无需添加');
    } else {
      // 获取当前最大的 order 值
      db.get(`SELECT MAX([order]) as maxOrder FROM article_categories`, (err, orderRow) => {
        if (err) {
          console.error('查询 order 失败:', err.message);
          return;
        }
        
        const nextOrder = (orderRow?.maxOrder || 0) + 1;
        
        // 插入"技术"分类，cardType 为 'card2'(前端/生活盒子)
        db.run(
          `INSERT INTO article_categories (name, userId, isDefault, cardType, [order], createdAt, updatedAt)
           VALUES ('技术', 1, true, 'card2', ?, datetime('now'), datetime('now'))`,
          [nextOrder],
          function(err) {
            if (err) {
              console.error('添加分类失败:', err.message);
            } else {
              console.log(`✅ 成功添加"技术"分类，ID: ${this.lastID}, Order: ${nextOrder}`);
            }
            
            // 验证结果
            db.all(`SELECT * FROM article_categories ORDER BY [order]`, (err, rows) => {
              if (err) {
                console.error('查询所有分类失败:', err.message);
              } else {
                console.log('\n📋 当前所有分类:');
                rows.forEach(cat => {
                  console.log(`  - ${cat.name} (ID: ${cat.id}, cardType: ${cat.cardType}, order: ${cat.order})`);
                });
              }
              
              db.close();
            });
          }
        );
      });
    }
  });
});
