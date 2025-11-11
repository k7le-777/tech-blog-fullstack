const router = require("express").Router();
const { Post, User, Comment, Category } = require("../../models");
const authenticate = require("../../middleware/auth");

// ==================== CREATE POST ====================
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content, categoryIds } = req.body;  // ← Add categoryIds
    
    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }
    
    // Create post
    const newPost = await Post.create({
      title,
      content,
      userId: req.user.userId
    });
    
    // Add categories if provided
    if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
      await newPost.setCategories(categoryIds);
    }
    
    // Get post with author and categories
    const postWithDetails = await Post.findByPk(newPost.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email']
        },
        {
          model: Category,
          attributes: ['id', 'name'],
          through: { attributes: [] }  // Don't include join table data
        }
      ]
    });
    
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: postWithDetails
    });
    
  } catch (error) {
    console.error('Create post error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create post',
      error: error.message
    });
  }
});

// ==================== GET ALL POSTS ====================
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email']
        },
        {
          model: Category,
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      count: posts.length,
      posts: posts
    });
    
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts',
      error: error.message
    });
  }
});

// ==================== GET SINGLE POST ====================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email']
        },
        {
          model: Category,
          attributes: ['id', 'name'],
          through: { attributes: [] }
        },
        {
          model: Comment,
          include: [{
            model: User,
            attributes: ['id', 'username', 'email']
          }],
          order: [['createdAt', 'ASC']]
        }
      ]
    });
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    res.json({
      success: true,
      post: post
    });
    
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch post',
      error: error.message
    });
  }
});

// ==================== UPDATE POST ====================
/**
 * PUT /api/posts/:id
 * Update a post (requires authentication + ownership)
 * Request body: { title?, content? }
 * Response: { success: boolean, post: object }
 */
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // Find post
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check ownership (authorization)
    if (post.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own posts",
      });
    }

    // Update post (only provided fields)
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;

    await post.save();

    // Get updated post with author
    const updatedPost = await Post.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["id", "username", "email"],
        },
      ],
    });

    res.json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Update post error:", error);

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors.map((e) => e.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update post",
      error: error.message,
    });
  }
});

// ==================== DELETE POST ====================
/**
 * DELETE /api/posts/:id
 * Delete a post (requires authentication + ownership)
 * Response: { success: boolean, message: string }
 */
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Find post
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check ownership (authorization)
    if (post.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own posts",
      });
    }

    // Delete post
    await post.destroy();

    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete post",
      error: error.message,
    });
  }
});

module.exports = router;
