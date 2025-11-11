const router = require("express").Router();

// Import route modules
const userRoutes = require("./api/userRoutes");
const postRoutes = require("./api/postRoutes");
const commentRoutes = require("./api/commentRoutes");

// Mount routes
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);

module.exports = router;
