const router = require("express").Router();
const { Comment, User, Post } = require("../../models");
const authenticate = require("../../middleware/auth");

// ==================== CREATE COMMENT ====================
/**
 * POST /api/comments
 * Create a comment on a post (requires authentication)
 * Request body: { content, postId }
 */
router.post("/", authenticate, async (req, res) => {
  try {
    const { content, postId } = req.body;

    // Validate required fields
    if (!content || !postId) {
      return res.status(400).json({
        success: false,
        message: "Content and postId are required",
      });
    }

    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Create comment
    const newComment = await Comment.create({
      content,
      postId,
      userId: req.user.userId,
    });

    // Get comment with user info
    const commentWithUser = await Comment.findByPk(newComment.id, {
      include: [
        {
          model: User,
          attributes: ["id", "username", "email"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment: commentWithUser,
    });
  } catch (error) {
    console.error("Create comment error:", error);

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors.map((e) => e.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create comment",
      error: error.message,
    });
  }
});

// ==================== GET COMMENTS FOR POST ====================
/**
 * GET /api/comments/post/:postId
 * Get all comments for a specific post
 */
router.get("/post/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.findAll({
      where: { postId },
      include: [
        {
          model: User,
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["createdAt", "ASC"]], // Oldest first
    });

    res.json({
      success: true,
      count: comments.length,
      comments: comments,
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
      error: error.message,
    });
  }
});

// ==================== DELETE COMMENT ====================
/**
 * DELETE /api/comments/:id
 * Delete a comment (requires authentication + ownership)
 */
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check ownership
    if (comment.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comments",
      });
    }

    await comment.destroy();

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete comment",
      error: error.message,
    });
  }
});

module.exports = router;
