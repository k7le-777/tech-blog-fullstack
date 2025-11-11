const router = require("express").Router();
const { Category, Post, User } = require("../../models");
const authenticate = require("../../middleware/auth");

// ==================== CREATE CATEGORY ====================
/**
 * POST /api/categories
 * Create a new category (requires authentication)
 */
router.post("/", authenticate, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const category = await Category.create({
      name,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
});

// ==================== GET ALL CATEGORIES ====================
/**
 * GET /api/categories
 * Get all categories
 */
router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [["name", "ASC"]],
    });

    res.json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
});

// ==================== GET POSTS BY CATEGORY ====================
/**
 * GET /api/categories/:id/posts
 * Get all posts in a specific category
 */
router.get("/:id/posts", async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id, {
      include: [
        {
          model: Post,
          include: [
            {
              model: User,
              attributes: ["id", "username", "email"],
            },
          ],
          order: [["createdAt", "DESC"]],
        },
      ],
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      category: category.name,
      count: category.posts.length,
      posts: category.posts,
    });
  } catch (error) {
    console.error("Get posts by category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
});

module.exports = router;
