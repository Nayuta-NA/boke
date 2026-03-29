// 导出所有 Model
const User = require('./User');
const Article = require('./Article');
const Note = require('./Note');
const Review = require('./Review');
const Travel = require('./Travel');

// 定义关联关系
Article.belongsTo(User, { foreignKey: 'authorId', as: 'user' });
Travel.belongsTo(User, { foreignKey: 'authorId', as: 'user' });
Note.belongsTo(User, { foreignKey: 'authorId', as: 'user' });
Review.belongsTo(User, { foreignKey: 'authorId', as: 'user' });

User.hasMany(Article, { foreignKey: 'authorId' });
User.hasMany(Travel, { foreignKey: 'authorId' });
User.hasMany(Note, { foreignKey: 'authorId' });
User.hasMany(Review, { foreignKey: 'authorId' });

module.exports = {
  User,
  Article,
  Note,
  Review,
  Travel,
};
