// Load environment variables
require("dotenv").config();

// Import Express
const express = require("express");

// Import database connection
const sequelize = require("./config/connection");

// Import models
const { User, Post, Comment, Category } = require("./models");

// Import routes
const routes = require("./routes");

// Create Express app
const app = express();

// Get port from environment
const PORT = process.env.PORT || 3001;

// ===== MIDDLEWARE =====
// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies (for form data)
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static("public"));

// Mount API routes
app.use("/api", routes);

// Catch-all route to serve index.html for client-side routing
app.get("*", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

// Initialize server
async function init() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("Database connection established");

    // Sync models to database
    // In production, use { alter: true } or migrations instead of { force: false }
    await sequelize.sync({ force: false });
    console.log("All models synchronized");

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at /api`);
    });
  } catch (error) {
    console.error("Error during initialization:", error);
    process.exit(1);
  }
}

// Initialize
init();
