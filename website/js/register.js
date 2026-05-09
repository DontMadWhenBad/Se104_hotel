// Khởi tạo icon
lucide.createIcons();

const registerForm = document.getElementById('register-form');

const showErr = (id, msg) => {
    const el = document.getElementById(id);
    el.textContent = msg;
    el.classList.remove('hidden');
}

const hideErr = (id) => {
    document.getElementById(id).classList.add('hidden');
}

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Ẩn tất cả lỗi cũ
    ['error-fullname', 'error-username', 'error-password', 'error-repassword'].forEach(hideErr);
    
    const fullName = document.getElementById('fullname').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rePassword = document.getElementById('re-password').value;

    let hasError = false;

    if (!fullName) { showErr('error-fullname', 'Vui lòng nhập họ tên'); hasError = true; }
    if (!username) { showErr('error-username', 'Vui lòng nhập tên đăng nhập'); hasError = true; }
    if (!password) { showErr('error-password', 'Vui lòng nhập mật khẩu'); hasError = true; }
    if (password && password.length < 6) { showErr('error-password', 'Mật khẩu phải từ 6 ký tự'); hasError = true; }
    if (password !== rePassword) { showErr('error-repassword', 'Mật khẩu nhập lại không khớp'); hasError = true; }

    if (hasError) return;

    // Lấy danh sách users
    let users = JSON.parse(localStorage.getItem('motelUsers')) || [];

    // Kiểm tra username trùng lặp
    const exists = users.find(u => u.username === username);
    if (exists) {
        showErr('error-username', 'Tên đăng nhập đã được sử dụng');
        return;
    }

    // Thêm user mới với quyền customer
    users.push({
        fullName: fullName,
        username: username,
        password: password,
        role: 'customer', // Mặc định là khách hàng
        createdAt: new Date().toISOString()
    });

    localStorage.setItem('motelUsers', JSON.stringify(users));

    alert('Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay.');
    window.location.href = 'login.html';
});
