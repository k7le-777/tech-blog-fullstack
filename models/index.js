// Import models
const User = require("./User");
const Post = require("./Post");

// Define relationships
User.hasMany(Post, {
  foreignKey: "userId",
  onDelete: "CASCADE", // If user deleted, delete their posts
});

Post.belongsTo(User, {
  foreignKey: "userId",
});

// Export all models
module.exports = {
  User,
  Post,
};
