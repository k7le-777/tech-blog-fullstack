// Import Sequelize data types
const { Model, DataTypes } = require("sequelize");

// Import bcrypt for password hashing
const bcrypt = require("bcrypt");

// Import database connection
const sequelize = require("../config/connection");

// Define User model
class User extends Model {
  // Method to check password
  checkPassword(loginPassword) {
    return bcrypt.compareSync(loginPassword, this.password);
  }
}

// Initialize User model
User.init(
  {
    // Define columns/fields
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 30], // Length between 3-30 characters
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Must be valid email format
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8], // Minimum 8 characters
      },
    },
  },
  {
    // Hooks: Functions that run before/after certain operations
    hooks: {
      // Before creating a new user, hash the password
      beforeCreate: async (newUser) => {
        newUser.password = await bcrypt.hash(newUser.password, 10);
        return newUser;
      },
      // Before updating a user, hash the password if it changed
      beforeUpdate: async (updatedUser) => {
        if (updatedUser.password) {
          updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
        }
        return updatedUser;
      },
    },
    // Model configuration options
    sequelize, // Pass connection
    timestamps: true, // Add createdAt and updatedAt
    freezeTableName: true, // Use 'user' not 'users'
    underscored: true, // Use snake_case (created_at)
    modelName: "user", // Model name
  }
);

// Export model
module.exports = User;
