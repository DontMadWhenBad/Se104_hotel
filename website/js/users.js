lucide.createIcons();

// Auth Guard bổ sung: Chỉ admin mới được vào trang này
const currentUsr = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUsr || currentUsr.role !== 'admin') {
    alert('Bạn không có quyền truy cập trang này!');
    window.location.href = 'index.html';
}

function renderUsers() {
    const users = JSON.parse(localStorage.getItem('motelUsers')) || [];
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '';

    users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-slate-50/50 transition-colors';
        
        const date = user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'Không rõ';
        
        // Disable dropdown nếu đang là chính mình (để admin không tự khóa mình)
        const isSelf = user.username === currentUsr.username;
        const disableSelect = isSelf ? 'disabled' : '';
        const opacityClass = isSelf ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-brand-500 focus:ring-brand-500';

        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                        ${user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-slate-900">${user.fullName}</div>
                        ${isSelf ? '<span class="text-xs text-brand-600 font-medium">(Bạn)</span>' : ''}
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-slate-500">@${user.username}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-slate-500">${date}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <select 
                    class="bg-slate-50 border border-slate-200 text-sm rounded-lg block w-32 p-2 outline-none transition-colors ${opacityClass}"
                    onchange="updateRole(${index}, this.value)"
                    ${disableSelect}
                >
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                    <option value="customer" ${user.role === 'customer' ? 'selected' : ''}>Khách hàng</option>
                </select>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Hàm được gọi khi Admin thay đổi dropdown
window.updateRole = function(userIndex, newRole) {
    let users = JSON.parse(localStorage.getItem('motelUsers')) || [];
    
    if (users[userIndex]) {
        users[userIndex].role = newRole;
        localStorage.setItem('motelUsers', JSON.stringify(users));
        
        // Hiện thông báo (toast nhỏ góc phải sẽ đẹp hơn, nhưng alert là đủ cho người mới)
        alert(`Đã cập nhật quyền của ${users[userIndex].username} thành ${newRole.toUpperCase()}!`);
    }
}

// Chạy lần đầu
renderUsers();
