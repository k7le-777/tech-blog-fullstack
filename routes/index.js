const router = require("express").Router();

// Import route modules
const userRoutes = require("./api/userRoutes");
const postRoutes = require("./api/postRoutes");
const commentRoutes = require("./api/commentRoutes");
const categoryRoutes = require("./api/categoryRoutes");

// Mount routes
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);
router.use("/categories", categoryRoutes);

module.exports = router;
