// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem("token") !== null;
}

// Get token
function getToken() {
  return localStorage.getItem("token");
}

// Get current user
function getCurrentUser() {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}

// Save login data
function saveLoginData(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

// Clear login data
function clearLoginData() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// Logout
async function logout() {
  try {
    // Call logout endpoint
    await fetch("/api/users/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Clear local storage regardless of API call result
    clearLoginData();
    window.location.href = "/";
  }
}

// Update navigation based on auth state
function updateNav() {
  const loggedIn = isLoggedIn();

  document.getElementById("nav-login").classList.toggle("hidden", loggedIn);
  document.getElementById("nav-register").classList.toggle("hidden", loggedIn);
  document
    .getElementById("nav-dashboard")
    .classList.toggle("hidden", !loggedIn);
  document.getElementById("nav-logout").classList.toggle("hidden", !loggedIn);
}

// Show alert message
function showAlert(message, type = "success") {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;

  const container = document.querySelector(".container");
  container.insertBefore(alertDiv, container.firstChild);

  setTimeout(() => alertDiv.remove(), 3000);
}

// Initialize navigation on page load
document.addEventListener("DOMContentLoaded", updateNav);
