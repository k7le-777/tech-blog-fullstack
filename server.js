// Load environment variables
require("dotenv").config();

// Import Express
const express = require("express");

// Import database connection
const sequelize = require("./config/connection");

// Import models
const { User } = require("./models");

// Create Express app
const app = express();

// Get port from environment
const PORT = process.env.PORT || 3001;

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Tech Blog API",
    status: "Server running",
    database: "Connected",
    models: {
      User: "Synced",
    },
  });
});

// Initialize server
async function init() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("Database connection established");

    // Sync models to database (create tables)
    await sequelize.sync({ force: false });
    console.log("All models synchronized");

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Error during initialization:", error);
    process.exit(1);
  }
}

// Initialize
init();
