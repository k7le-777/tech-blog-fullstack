let allPosts = [];
let allCategories = [];

// Load categories
async function loadCategories() {
  try {
    const response = await fetch("/api/categories");
    const data = await response.json();

    if (data.success) {
      allCategories = data.categories;
      renderCategoryFilter();
    }
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

// Render category filter
function renderCategoryFilter() {
  const filterContainer = document.getElementById("categoryFilter");

  allCategories.forEach((cat) => {
    const badge = document.createElement("span");
    badge.className = "category-badge";
    badge.textContent = cat.name;
    badge.onclick = () => filterPosts(cat.id);
    filterContainer.appendChild(badge);
  });
}

// Load posts
async function loadPosts() {
  try {
    const response = await fetch("/api/posts");
    const data = await response.json();

    if (data.success) {
      allPosts = data.posts;
      renderPosts(allPosts);
    }
  } catch (error) {
    console.error("Error loading posts:", error);
    document.getElementById("postsContainer").innerHTML =
      '<div class="alert alert-error">Failed to load posts</div>';
  }
}

// Filter posts by category
async function filterPosts(categoryId) {
  const container = document.getElementById("postsContainer");
  container.innerHTML = '<div class="loading">Loading posts...</div>';

  try {
    let posts;

    if (categoryId === null) {
      // Show all posts
      posts = allPosts;
    } else {
      // Fetch posts by category
      const response = await fetch(`/api/categories/${categoryId}/posts`);
      const data = await response.json();
      posts = data.posts;
    }

    renderPosts(posts);
  } catch (error) {
    console.error("Error filtering posts:", error);
    container.innerHTML =
      '<div class="alert alert-error">Failed to filter posts</div>';
  }
}

// Render posts
function renderPosts(posts) {
  const container = document.getElementById("postsContainer");

  if (posts.length === 0) {
    container.innerHTML = '<div class="card">No posts found.</div>';
    return;
  }

  container.innerHTML = posts
    .map(
      (post) => `
    <div class="post-card">
      <h2 class="post-title" onclick="viewPost(${post.id})">${post.title}</h2>
      <div class="post-meta">
        By ${post.user.username} • ${new Date(
        post.createdAt
      ).toLocaleDateString()}
      </div>
      <div class="post-content">
        ${post.content.substring(0, 200)}${
        post.content.length > 200 ? "..." : ""
      }
      </div>
      ${
        post.categories && post.categories.length > 0
          ? `
        <div class="categories">
          ${post.categories
            .map(
              (cat) => `
            <span class="category-badge" onclick="filterPosts(${cat.id})">${cat.name}</span>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }
    </div>
  `
    )
    .join("");
}

// View post details
function viewPost(postId) {
  window.location.href = `/post.html?id=${postId}`;
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  loadPosts();
});
