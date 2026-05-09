// Auth Guard: Kiểm tra đăng nhập
const isLoggedIn = localStorage.getItem('isLoggedIn');
const currentUserRaw = localStorage.getItem('currentUser');

// Nếu thiếu 1 trong 2 thì đá về trang login ngay lập tức
if (isLoggedIn !== 'true' || !currentUserRaw) {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.replace('login.html');
}

let currentUser = null;
if (currentUserRaw) {
    currentUser = JSON.parse(currentUserRaw);
}

// File xử lý giao diện chung (Menu Mobile & RBAC)
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');

    // Mở Menu
    function openSidebar() {
        sidebar.classList.remove('-translate-x-full');
        backdrop.classList.remove('hidden');
        // Timeout nhỏ để có hiệu ứng mờ dần (Fade in)
        setTimeout(() => backdrop.classList.remove('opacity-0'), 10);
    }

    // Đóng Menu
    function closeSidebar() {
        sidebar.classList.add('-translate-x-full');
        backdrop.classList.add('opacity-0');
        // Chờ hiệu ứng xong mới ẩn hẳn
        setTimeout(() => backdrop.classList.add('hidden'), 300);
    }

    // Gắn sự kiện click
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', openSidebar);
    }

    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', closeSidebar);
    }

    // Bấm ra ngoài màn hình mờ để đóng Menu
    if (backdrop) {
        backdrop.addEventListener('click', closeSidebar);
    }

    // Xử lý sự kiện Đăng xuất
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?')) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('currentUser'); // Xóa thông tin user
                window.location.href = 'login.html';
            }
        });
    }

    // HIỂN THỊ THÔNG TIN USER (RBAC)
    const profileNameEl = document.getElementById('profile-name');
    const profileRoleEl = document.getElementById('profile-role');
    const profileAvatarEl = document.getElementById('profile-avatar');

    if (profileNameEl) profileNameEl.textContent = currentUser.fullName;
    if (profileRoleEl) profileRoleEl.textContent = currentUser.role === 'admin' ? 'Quản trị viên' : 'Khách hàng';
    if (profileAvatarEl) profileAvatarEl.textContent = currentUser.fullName.charAt(0).toUpperCase();

    // 1. ĐIỀU KHIỂN ACCOUNT POPOVER (MENU THẢ XUỐNG)
    const accountToggleBtn = document.getElementById('account-toggle-btn');
    const accountPopover = document.getElementById('account-popover');

    if (accountToggleBtn && accountPopover) {
        accountToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            accountPopover.classList.toggle('hidden');
        });

        // Bấm ra ngoài màn hình để đóng menu
        document.addEventListener('click', () => {
            accountPopover.classList.add('hidden');
        });

        // Ngăn menu bị đóng khi click vào bên trong nó
        accountPopover.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // 2. XỬ LÝ MODAL THÔNG TIN CÁ NHÂN
    const viewProfileBtn = document.getElementById('view-profile-btn');
    const profileModal = document.getElementById('profile-modal');
    const profileModalBackdrop = document.getElementById('profile-modal-backdrop');
    const profileModalPanel = document.getElementById('profile-modal-panel');
    const closeProfileModal = document.getElementById('close-profile-modal');

    if (viewProfileBtn && profileModal) {
        viewProfileBtn.addEventListener('click', () => {
            // Đổ dữ liệu vào modal
            document.getElementById('modal-profile-name').textContent = currentUser.fullName;
            document.getElementById('modal-profile-role').textContent = currentUser.role === 'admin' ? 'Quản trị viên' : 'Khách hàng';
            document.getElementById('modal-profile-id').textContent = currentUser.username; // Username thường là SĐT/CCCD
            document.getElementById('modal-profile-avatar').textContent = currentUser.fullName.charAt(0).toUpperCase();

            // Hiện modal với hiệu ứng
            profileModal.classList.remove('hidden');
            setTimeout(() => {
                profileModalBackdrop.classList.remove('opacity-0');
                profileModalPanel.classList.remove('opacity-0', 'scale-95');
            }, 10);

            // Đóng popover sau khi bấm
            accountPopover.classList.add('hidden');
        });
    }

    function hideProfileModal() {
        if (!profileModal) return;
        profileModalBackdrop.classList.add('opacity-0');
        profileModalPanel.classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
            profileModal.classList.add('hidden');
        }, 300);
    }

    if (closeProfileModal) closeProfileModal.addEventListener('click', hideProfileModal);
    if (profileModalBackdrop) profileModalBackdrop.addEventListener('click', hideProfileModal);

    // 3. PHÂN QUYỀN VÀ ẨN MENU TRONG POPOVER
    const popoverMenuUsers = document.getElementById('popover-menu-users');
    if (popoverMenuUsers && currentUser.role !== 'admin') {
        popoverMenuUsers.style.display = 'none';
    }

    // 4. ẨN CÁC MENU KHÁC TRÊN SIDEBAR ĐỐI VỚI CUSTOMER
    if (currentUser.role === 'customer') {
        const revenueMenu = document.getElementById('menu-revenue');
        const usersMenu = document.getElementById('menu-users');
        if (revenueMenu) revenueMenu.style.display = 'none';
        if (usersMenu) usersMenu.style.display = 'none';

        // Bảo vệ các trang quản trị
        const currentPath = window.location.pathname;
        if (currentPath.includes('revenue.html') || currentPath.includes('users.html')) {
            window.location.href = 'index.html';
        }
    }
});
