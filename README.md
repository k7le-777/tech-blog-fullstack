# Tech Blog - Full Stack Application

A full-stack blogging platform where users can register, create posts, and browse content by category.

## Features (Planned)

- User authentication (register, login, logout)
- Create, read, update, delete blog posts
- Filter posts by category
- Secure password hashing
- JWT-based authentication
- MySQL database with Sequelize ORM

## Technologies

- **Backend:** Node.js, Express.js
- **Database:** MySQL, Sequelize ORM
- **Authentication:** bcrypt, jsonwebtoken
- **Frontend:** HTML, CSS, Vanilla JavaScript

## Installation (Coming Soon)

Instructions will be added as we build the project.

## Project Structure
```
tech-blog-fullstack/
├── config/          # Database configuration
├── models/          # Sequelize models
├── routes/          # API routes
├── middleware/      # Authentication middleware
├── utils/           # Helper functions
├── public/          # Frontend files
├── seeds/           # Database seed data
├── server.js        # Main server file
├── .env.example     # Environment template
└── README.md        # This file
```

## Setup Instructions

Will be updated as project develops.

## Author

Ryan 

## License

MIT# Tech Blog API

A full-stack RESTful API for a tech blogging platform built with Node.js, Express, MySQL, and Sequelize.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Post Management**: Create, read, update, and delete blog posts
- **Comments**: Users can comment on posts and manage their comments
- **Authorization**: Users can only modify their own content
- **Relationships**: Proper database relationships between users, posts, and comments
- **Password Security**: Bcrypt hashing with salt rounds
- **Input Validation**: Comprehensive validation for all user inputs
- **Error Handling**: Proper error responses with meaningful messages

## Technologies Used

- **Node.js** v16+ - JavaScript runtime
- **Express.js** v4.x - Web framework
- **MySQL** v8+ - Relational database
- **Sequelize** v6.x - ORM for database operations
- **bcrypt** v5.x - Password hashing
- **jsonwebtoken** v9.x - JWT authentication
- **dotenv** v16.x - Environment variable management

## Project Structure
```
tech-blog-fullstack/
├── config/
│   └── connection.js      # Database connection
├── middleware/
│   └── auth.js            # Authentication middleware
├── models/
│   ├── User.js            # User model
│   ├── Post.js            # Post model
│   ├── Comment.js         # Comment model
│   └── index.js           # Model relationships
├── routes/
│   ├── index.js           # Route aggregator
│   └── api/
│       ├── userRoutes.js  # User endpoints
│       ├── postRoutes.js  # Post endpoints
│       └── commentRoutes.js # Comment endpoints
├── seeds/
│   └── seed.js            # Test data
├── .env.example           # Environment template
├── .gitignore
├── package.json
├── README.md
└── server.js              # Application entry point
```

## Installation & Setup

### Prerequisites

- Node.js v16 or higher
- MySQL v8 or higher
- npm or yarn

### Steps

1. **Clone the repository**
```bash
   git clone https://github.com/YOUR_USERNAME/tech-blog-fullstack.git
   cd tech-blog-fullstack
```

2. **Install dependencies**
```bash
   npm install
```

3. **Set up environment variables**
```bash
   cp .env.example .env
```
   
   Edit `.env` and add your values:
```
   DB_NAME=tech_blog
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_HOST=localhost
   PORT=3001
   JWT_SECRET=your_super_secret_key_here
```

4. **Create MySQL database**
```bash
   mysql -u root -p
```
```sql
   CREATE DATABASE tech_blog;
   EXIT;
```

5. **Seed database (optional)**
```bash
   npm run seed
```

6. **Start the server**
```bash
   npm start
```
   
   Server will run on `http://localhost:3001`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/users/register` | Register new user | No |
| POST | `/api/users/login` | Login user | No |
| GET | `/api/users/me` | Get current user profile | Yes |

### Posts

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/posts` | Create new post | Yes |
| GET | `/api/posts` | Get all posts | No |
| GET | `/api/posts/:id` | Get post by ID (with comments) | No |
| PUT | `/api/posts/:id` | Update post | Yes (owner only) |
| DELETE | `/api/posts/:id` | Delete post | Yes (owner only) |

### Comments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/comments` | Create comment | Yes |
| GET | `/api/comments/post/:postId` | Get comments for post | No |
| DELETE | `/api/comments/:id` | Delete comment | Yes (owner only) |

## Testing with Postman

### 1. Register a User
```
POST http://localhost:3001/api/users/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@email.com",
  "password": "password123"
}
```

### 2. Login
```
POST http://localhost:3001/api/users/login
Content-Type: application/json

{
  "email": "test@email.com",
  "password": "password123"
}
```

**Copy the token from response!**

### 3. Create a Post
```
POST http://localhost:3001/api/posts
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "title": "My First Post",
  "content": "This is the content of my first blog post!"
}
```

### 4. Add a Comment
```
POST http://localhost:3001/api/comments
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "content": "Great post!",
  "postId": 1
}
```

## Database Schema

### Users
- `id` (PK, AUTO_INCREMENT)
- `username` (UNIQUE, NOT NULL)
- `email` (UNIQUE, NOT NULL)
- `password` (HASHED, NOT NULL)
- `created_at`, `updated_at`

### Posts
- `id` (PK, AUTO_INCREMENT)
- `title` (NOT NULL)
- `content` (TEXT, NOT NULL)
- `user_id` (FK → users.id, CASCADE DELETE)
- `created_at`, `updated_at`

### Comments
- `id` (PK, AUTO_INCREMENT)
- `content` (TEXT, NOT NULL)
- `user_id` (FK → users.id, CASCADE DELETE)
- `post_id` (FK → posts.id, CASCADE DELETE)
- `created_at`, `updated_at`

## Security Features

- **Password Hashing**: Bcrypt with 10 salt rounds
- **JWT Authentication**: Tokens expire after 24 hours
- **Authorization**: Users can only modify their own content
- **Input Validation**: Sequelize validation + custom checks
- **SQL Injection Prevention**: Parameterized queries via Sequelize
- **Environment Variables**: Sensitive data in .env (not committed)

## Challenges & Learnings

### Challenges Faced
1. **JWT Security**: Understanding that JWT payload is public (Base64 encoded, not encrypted)
2. **Authorization Logic**: Implementing ownership checks for update/delete operations
3. **Relationship Management**: Setting up CASCADE deletes and foreign key constraints
4. **Password Hashing**: Implementing beforeCreate/beforeUpdate hooks properly

### Key Learnings
- JWT provides authentication (who you are), not authorization (what you can do)
- Authorization must be checked at the application level (ownership verification)
- Sequelize hooks are powerful for automatic data processing
- Proper error handling improves API usability significantly

## Future Enhancements

- [ ] Categories/tags for posts
- [ ] Pagination for posts and comments
- [ ] Search functionality
- [ ] Post likes/upvotes
- [ ] User profiles with bio
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Rate limiting
- [ ] Frontend interface

## Author

**Your Name**
- GitHub: [@k7le-777](https://github.com/k7le-777)

## License

This project is licensed under the MIT License.

