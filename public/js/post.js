// Get post ID from URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

if (!postId) {
  window.location.href = "/";
}

// Show comment form if logged in
if (isLoggedIn()) {
  document.getElementById("commentForm").classList.remove("hidden");
}

// Load post
async function loadPost() {
  try {
    const response = await fetch(`/api/posts/${postId}`);
    const data = await response.json();

    if (data.success) {
      renderPost(data.post);
      renderComments(data.post.comments);
    } else {
      showAlert("Post not found", "error");
      setTimeout(() => (window.location.href = "/"), 2000);
    }
  } catch (error) {
    console.error("Error loading post:", error);
    showAlert("Failed to load post", "error");
  }
}

// Render post
function renderPost(post) {
  const container = document.getElementById("postContainer");
  container.innerHTML = `
    <div class="card">
      <h1>${post.title}</h1>
      <div class="post-meta">
        By ${post.user.username} • ${new Date(
    post.createdAt
  ).toLocaleDateString()}
      </div>
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
      <div class="post-content" style="margin-top: 1.5rem; white-space: pre-wrap;">
        ${post.content}
      </div>
    </div>
  `;
}

// Render comments
function renderComments(comments) {
  const container = document.getElementById("commentsContainer");

  if (!comments || comments.length === 0) {
    container.innerHTML = "<p>No comments yet. Be the first to comment!</p>";
    return;
  }

  container.innerHTML = comments
    .map(
      (comment) => `
    <div class="comment">
      <div class="comment-author">
        ${comment.user.username} • ${new Date(
        comment.createdAt
      ).toLocaleDateString()}
      </div>
      <div class="comment-content">${comment.content}</div>
    </div>
  `
    )
    .join("");
}

// Add comment
document
  .getElementById("addCommentForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const content = document.getElementById("commentContent").value;

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ content, postId: parseInt(postId) }),
      });

      const data = await response.json();

      if (data.success) {
        showAlert("Comment added!", "success");
        document.getElementById("commentContent").value = "";
        loadPost(); // Reload to show new comment
      } else {
        showAlert(data.message, "error");
      }
    } catch (error) {
      showAlert("Failed to add comment", "error");
    }
  });

// Initialize
document.addEventListener("DOMContentLoaded", loadPost);
