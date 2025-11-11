const sequelize = require("../config/connection");
const { User, Post, Comment, Category } = require("../models");

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("\nDatabase synced!\n");

    // Create users
    const users = await User.bulkCreate(
      [
        {
          username: "ali",
          email: "ali@email.com",
          password: "password123",
        },
        {
          username: "ahmed",
          email: "ahmed@email.com",
          password: "password123",
        },
        {
          username: "sarah",
          email: "sarah@email.com",
          password: "password123",
        },
      ],
      {
        individualHooks: true,
      }
    );
    console.log("Users seeded!");

    // Create categories
    const categories = await Category.bulkCreate([
      {
        name: "JavaScript",
        description: "All about JavaScript programming",
      },
      {
        name: "Node.js",
        description: "Server-side JavaScript with Node.js",
      },
      {
        name: "Databases",
        description: "Database design and management",
      },
      {
        name: "Web Development",
        description: "General web development topics",
      },
      {
        name: "Security",
        description: "Web security and authentication",
      },
    ]);
    console.log("Categories seeded!");

    // Create posts
    const posts = await Post.bulkCreate([
      {
        title: "Getting Started with Node.js",
        content:
          "Node.js is a powerful JavaScript runtime built on Chrome's V8 engine. It allows you to build scalable server-side applications using JavaScript.",
        userId: users[0].id,
      },
      {
        title: "Understanding JWT Authentication",
        content:
          "JSON Web Tokens (JWT) provide a stateless authentication mechanism. They consist of three parts: header, payload, and signature.",
        userId: users[0].id,
      },
      {
        title: "Sequelize ORM Guide",
        content:
          "Sequelize is a promise-based Node.js ORM that supports multiple databases. It makes database operations much easier with JavaScript.",
        userId: users[1].id,
      },
      {
        title: "RESTful API Best Practices",
        content:
          "When building REST APIs, follow proper HTTP methods, use meaningful status codes, and structure your endpoints logically.",
        userId: users[2].id,
      },
    ]);
    console.log("Posts seeded!");

    // Add categories to posts
    await posts[0].setCategories([categories[0].id, categories[1].id]); // JS + Node
    await posts[1].setCategories([categories[1].id, categories[4].id]); // Node + Security
    await posts[2].setCategories([categories[1].id, categories[2].id]); // Node + DB
    await posts[3].setCategories([categories[3].id]); // Web Dev
    console.log("Post categories linked!");

    // Create comments
    await Comment.bulkCreate([
      {
        content: "Great introduction! Very helpful for beginners.",
        userId: users[1].id,
        postId: posts[0].id,
      },
      {
        content: "Thanks! Glad it was helpful.",
        userId: users[0].id,
        postId: posts[0].id,
      },
      {
        content: "This cleared up my confusion about JWT security!",
        userId: users[2].id,
        postId: posts[1].id,
      },
      {
        content: "Sequelize has been a game-changer for my projects.",
        userId: users[0].id,
        postId: posts[2].id,
      },
      {
        content: "Excellent best practices guide!",
        userId: users[1].id,
        postId: posts[3].id,
      },
    ]);
    console.log("Comments seeded!");

    console.log("\nDatabase seeded successfully!\n");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedDatabase();
