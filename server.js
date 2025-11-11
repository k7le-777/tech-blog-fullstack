// Load environment variables
require("dotenv").config();

// Import Express
const express = require("express");

// Import database connection
const sequelize = require("./config/connection");

// Import models
const { User, Post, Comment } = require("./models");

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

app.use(express.static("public"));

// Mount API routes
app.use("/api", routes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Tech Blog API",
    status: "Server running",
    endpoints: {
      register: "POST /api/users/register",
      login: "POST /api/users/login",
      profile: "GET /api/users/me (requires auth)",
    },
  });
});

// Initialize server
async function init() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("Database connection established");

    // Sync models to database
    await sequelize.sync({ force: false });
    console.log("All models synchronized");

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("Error during initialization:", error);
    process.exit(1);
  }
}

// Initialize
init();
