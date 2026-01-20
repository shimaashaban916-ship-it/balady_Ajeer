// Authentication Guard
function checkAuth() {
    const loggedInUser = localStorage.getItem('portal_logged_in_user');
    if (!loggedInUser) {
        // Fallback to ajeer_logged_in_user for transition
        const legacyUser = localStorage.getItem('ajeer_logged_in_user');
        if (legacyUser) {
            localStorage.setItem('portal_logged_in_user', legacyUser);
            return JSON.parse(legacyUser);
        }
        // Detect depth and redirect to login.html in shared folder
        const isSubdir = window.location.pathname.includes('/ajeer/') || window.location.pathname.includes('/health/');
        window.location.href = '/shared/login.html';
        return null;
    }
    return JSON.parse(loggedInUser);
}

// Logout function
function logout() {
    localStorage.removeItem('portal_logged_in_user');
    localStorage.removeItem('ajeer_logged_in_user');
    localStorage.removeItem('health_logged_in_user');
    const isSubdir = window.location.pathname.includes('/ajeer/') || window.location.pathname.includes('/health/');
    window.location.href = '/shared/login.html';
}

// Show user info in navbar
function showUserInfo() {
    const user = checkAuth();
    if (!user) return;

    const navbarBrand = document.querySelector('.navbar-brand');
    const userContainer = document.querySelector('.d-flex.align-items-center.gap-3');

    if (navbarBrand && navbarBrand.parentElement) {
        // If container already exists, just update it, otherwise create
        let userInfo = userContainer;
        if (!userInfo) {
            userInfo = document.createElement('div');
            userInfo.className = 'd-flex align-items-center gap-3 ms-auto';
            navbarBrand.parentElement.appendChild(userInfo);
        }

        userInfo.innerHTML = `
            <span class="text-muted d-none d-md-inline">أهلاً، <strong>${user.full_name || user.username}</strong></span>
            <button onclick="logout()" class="btn btn-sm btn-outline-danger">
                <i class="bi bi-box-arrow-left ms-1"></i>
                خروج
            </button>
        `;
    }
}

// Check auth on page load (for protected pages)
if (!window.location.pathname.includes('/login')) {
    const user = checkAuth();
    if (user) {
        window.addEventListener('DOMContentLoaded', showUserInfo);
    }
}
