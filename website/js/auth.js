// Khởi tạo icon
lucide.createIcons();

const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Ngăn trình duyệt tự reload lại trang khi bấm submit form
    
    const user = usernameInput.value.trim();
    const pass = passwordInput.value.trim();

    // Ẩn dòng lỗi cũ
    errorMessage.classList.add('hidden');

    if (user === '' || pass === '') {
        errorMessage.textContent = 'Vui lòng nhập đầy đủ tài khoản và mật khẩu!';
        errorMessage.classList.remove('hidden');
        return;
    }

    // Khởi tạo mảng User nếu lần đầu chạy ứng dụng
    let users = JSON.parse(localStorage.getItem('motelUsers'));
    if (!users || users.length === 0) {
        users = [{
            fullName: 'Quản trị viên',
            username: 'admin',
            password: '123456',
            role: 'admin',
            createdAt: new Date().toISOString()
        }];
        localStorage.setItem('motelUsers', JSON.stringify(users));
    }

    // Kiểm tra đăng nhập
    const validUser = users.find(u => u.username === user && u.password === pass);

    if (validUser) {
        // Đăng nhập thành công -> Lưu cờ và thông tin user vào Local Storage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({
            username: validUser.username,
            fullName: validUser.fullName,
            role: validUser.role
        }));
        
        // Chuyển hướng sang trang chủ
        window.location.href = 'index.html';
    } else {
        // Đăng nhập thất bại
        errorMessage.textContent = 'Tài khoản hoặc mật khẩu không chính xác!';
        errorMessage.classList.remove('hidden');
    }
});
