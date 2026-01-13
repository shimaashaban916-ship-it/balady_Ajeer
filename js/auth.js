// Authentication Guard
function checkAuth() {
    const loggedInUser = localStorage.getItem('ajeer_logged_in_user');
    if (!loggedInUser) {
        window.location.href = 'login.html';
        return null;
    }
    return JSON.parse(loggedInUser);
}

// Logout function
function logout() {
    localStorage.removeItem('ajeer_logged_in_user');
    window.location.href = 'login.html';
}

// Show user info in navbar
function showUserInfo() {
    const user = checkAuth();
    if (!user) return;

    const navbarBrand = document.querySelector('.navbar-brand');
    if (navbarBrand && navbarBrand.parentElement) {
        const userInfo = document.createElement('div');
        userInfo.className = 'd-flex align-items-center gap-3';
        userInfo.innerHTML = `
            <span class="text-muted">أهلاً <strong>شيماء</strong></span>
            <button onclick="logout()" class="btn btn-sm btn-outline-danger">
                <i class="bi bi-box-arrow-left ms-1"></i>
                تسجيل الخروج
            </button>
        `;
        navbarBrand.parentElement.appendChild(userInfo);
    }
}

// Check auth on page load (for protected pages)
if (window.location.pathname !== '/login.html' && !window.location.pathname.includes('login.html')) {
    const user = checkAuth();
    if (user) {
        window.addEventListener('DOMContentLoaded', showUserInfo);
    }
}
