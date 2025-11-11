// Import Sequelize
const Sequelize = require("sequelize");

// Load environment variables
require("dotenv").config();

let sequelize;

// Check if JawsDB URL exists (production on Render)
if (process.env.JAWSDB_URL) {
  // Production: Use JawsDB connection string
  sequelize = new Sequelize(process.env.JAWSDB_URL, {
    dialect: "mysql",
    dialectOptions: {
      decimalNumbers: true,
    },
    logging: false,
  });
} else {
  // Development: Use local MySQL
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: "mysql",
      port: 3306,
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

// Export connection
module.exports = sequelize;
