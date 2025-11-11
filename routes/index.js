const router = require("express").Router();

// Import route modules
const userRoutes = require("./api/userRoutes");
const postRoutes = require("./api/postRoutes"); 

// Mount routes
router.use("/users", userRoutes);
router.use("/posts", postRoutes); 

module.exports = router;
