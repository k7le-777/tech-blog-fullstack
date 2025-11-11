// Protect dashboard - redirect if not logged in
if (!isLoggedIn()) {
  window.location.href = "/login.html";
}

// Display username
const user = getCurrentUser();
document.getElementById("username").textContent = user.username;

let allCategories = [];

// Load categories for select dropdown
async function loadCategories() {
  try {
    const response = await fetch("/api/categories");
    const data = await response.json();

    if (data.success) {
      allCategories = data.categories;
      renderCategorySelect();
    }
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

// Render category select
function renderCategorySelect() {
  const select = document.getElementById("categories");
  select.innerHTML = allCategories
    .map(
      (cat) => `
    <option value="${cat.id}">${cat.name}</option>
  `
    )
    .join("");
}

// Create post
document
  .getElementById("createPostForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const categorySelect = document.getElementById("categories");
    const categoryIds = Array.from(categorySelect.selectedOptions).map((opt) =>
      parseInt(opt.value)
    );

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ title, content, categoryIds }),
      });

      const data = await response.json();

      if (data.success) {
        showAlert("Post created successfully!", "success");
        document.getElementById("createPostForm").reset();
        loadMyPosts();
      } else {
        showAlert(data.message, "error");
      }
    } catch (error) {
      showAlert("Failed to create post", "error");
    }
  });

// Load user's posts
async function loadMyPosts() {
  try {
    const response = await fetch("/api/posts");
    const data = await response.json();

    if (data.success) {
      // Filter posts by current user
      const myPosts = data.posts.filter((post) => post.userId === user.id);
      renderMyPosts(myPosts);
    }
  } catch (error) {
    console.error("Error loading posts:", error);
  }
}

// Render user's posts
function renderMyPosts(posts) {
  const container = document.getElementById("myPostsContainer");

  if (posts.length === 0) {
    container.innerHTML = "<p>You haven't created any posts yet.</p>";
    return;
  }

  container.innerHTML = posts
    .map(
      (post) => `
    <div class="post-card">
      <h3 class="post-title" onclick="viewPost(${post.id})">${post.title}</h3>
      <div class="post-meta">${new Date(
        post.createdAt
      ).toLocaleDateString()}</div>
      <div class="post-content">${post.content.substring(0, 150)}...</div>
      ${
        post.categories && post.categories.length > 0
          ? `
        <div class="categories">
          ${post.categories
            .map((cat) => `<span class="category-badge">${cat.name}</span>`)
            .join("")}
        </div>
      `
          : ""
      }
      <div style="margin-top: 1rem;">
        <button class="btn btn-secondary" onclick="editPost(${
          post.id
        })">Edit</button>
        <button class="btn btn-danger" onclick="deletePost(${
          post.id
        })">Delete</button>
      </div>
    </div>
  `
    )
    .join("");
}

// View post
function viewPost(postId) {
  window.location.href = `/post.html?id=${postId}`;
}

// Delete post
async function deletePost(postId) {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    const response = await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      showAlert("Post deleted successfully", "success");
      loadMyPosts();
    } else {
      showAlert(data.message, "error");
    }
  } catch (error) {
    showAlert("Failed to delete post", "error");
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  loadMyPosts();
});
