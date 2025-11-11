// Import models
const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");

// User ↔ Post relationships
User.hasMany(Post, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Post.belongsTo(User, {
  foreignKey: "userId",
});

// User ↔ Comment relationships
User.hasMany(Comment, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Comment.belongsTo(User, {
  foreignKey: "userId",
});

// Post ↔ Comment relationships
Post.hasMany(Comment, {
  foreignKey: "postId",
  onDelete: "CASCADE",
});

Comment.belongsTo(Post, {
  foreignKey: "postId",
});

// Export all models
module.exports = {
  User,
  Post,
  Comment,
};
