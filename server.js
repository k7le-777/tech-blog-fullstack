// Load environment variables
require("dotenv").config();

// Import Express
const express = require("express");

// Import database connection
const sequelize = require("./config/connection");

// Create Express app
const app = express();

// Get port from environment
const PORT = process.env.PORT || 3001;

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Tech Blog API",
    status: "Server running",
    database: "Connected (see console)",
  });
});

// Test database connection and start server
async function init() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("Database connection established successfully");

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Unable to connect to database:", error.message);
    process.exit(1); // Exit if can't connect
  }
}

// Initialize
init();
