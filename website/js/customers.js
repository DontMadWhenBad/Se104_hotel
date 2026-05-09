// Khởi tạo icon
lucide.createIcons();

// Hàm tải dữ liệu từ Local Storage
function loadRooms() {
    try {
        const saved = localStorage.getItem('motelRooms');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error("Lỗi tải dữ liệu phòng:", e);
        return [];
    }
}

// Chờ DOM tải xong
document.addEventListener('DOMContentLoaded', () => {
    const userStr = localStorage.getItem('currentUser');
    const currentUser = userStr ? JSON.parse(userStr) : null;

    if (!currentUser) {
        console.warn("Không tìm thấy thông tin người dùng hiện tại.");
        return;
    }

    const adminView = document.getElementById('admin-view');
    const customerView = document.getElementById('customer-view');
    const tableBody = document.getElementById('customers-table-body');
    const emptyState = document.getElementById('empty-state');
    const searchInput = document.getElementById('search-input');

    let allRooms = loadRooms();

    // --- PHÂN QUYỀN HIỂN THỊ ---
    if (currentUser.role === 'admin') {
        adminView?.classList.remove('hidden');
        customerView?.classList.add('hidden');
        searchInput?.parentElement?.parentElement?.classList.remove('hidden');
        
        // Lấy các phòng đang có khách hoặc chờ thanh toán
        const occupiedRooms = allRooms.filter(room => room.status === 'occupied' || room.status === 'checkout');
        renderTable(occupiedRooms);
        
        // Gắn sự kiện tìm kiếm
        searchInput?.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            const filtered = occupiedRooms.filter(r => 
                (r.customer || '').toLowerCase().includes(term) || 
                (r.number || '').toLowerCase().includes(term) || 
                (r.customerCccd || '').includes(term) ||
                (r.customerPhone || '').includes(term)
            );
            renderTable(filtered);
        });
    } else {
        customerView?.classList.remove('hidden');
        adminView?.classList.add('hidden');
        searchInput?.parentElement?.parentElement?.classList.add('hidden');
        
        // Tìm tất cả các phòng của khách hàng hiện tại
        const myRooms = allRooms.filter(r => 
            (r.status === 'occupied' || r.status === 'checkout' || r.status === 'pending') && 
            (r.bookedBy === currentUser.username || r.customer === currentUser.fullName || (r.customerPhone === currentUser.username && r.customerPhone))
        );
        renderMyInfo(myRooms);
    }

    // --- HÀM VẼ BẢNG CHO ADMIN ---
    function renderTable(data) {
        if (!tableBody) return;
        tableBody.innerHTML = '';
        
        if (data.length === 0) {
            emptyState?.classList.remove('hidden');
            emptyState?.classList.add('flex');
            tableBody.closest('.bg-white')?.classList.add('hidden');
            return;
        }
        
        emptyState?.classList.add('hidden');
        emptyState?.classList.remove('flex');
        tableBody.closest('.bg-white')?.classList.remove('hidden');

        data.forEach(room => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-slate-50 transition-colors group border-b border-slate-100 last:border-0';
            
            const checkInDate = room.checkInTime ? new Date(room.checkInTime).toLocaleString('vi-VN') : '---';
            const avatarLetter = room.customer ? room.customer.charAt(0).toUpperCase() : '?';
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="inline-flex items-center px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-sm">${room.number}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="h-9 w-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">${avatarLetter}</div>
                        <div class="ml-3"><div class="text-sm font-semibold text-slate-900">${room.customer || 'Chưa có tên'}</div></div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <button onclick="openDetailModal('${room.id}')" class="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-100 transition-all">
                        Xem chi tiết
                    </button>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                    <div class="flex items-center gap-2">
                        <i data-lucide="calendar" class="w-4 h-4 opacity-40"></i>
                        ${checkInDate}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a href="index.html" class="text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1">
                        Sơ đồ <i data-lucide="arrow-right" class="w-4 h-4"></i>
                    </a>
                </td>
            `;
            tableBody.appendChild(row);
        });
        lucide.createIcons();
    }

    // --- HÀM HIỂN THỊ INFO CHO KHÁCH ---
    function renderMyInfo(rooms) {
        const container = document.getElementById('my-booking-info');
        if (!container) return;

        if (!rooms || rooms.length === 0) {
            container.innerHTML = `
                <div class="flex flex-col items-center py-16 text-center">
                    <div class="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-6">
                        <i data-lucide="inbox" class="w-10 h-10"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-800 mb-2">Bạn chưa có phòng lưu trú</h3>
                    <p class="text-slate-500 max-w-xs mx-auto">Vui lòng quay lại Sơ đồ phòng để chọn phòng và gửi yêu cầu đặt phòng cho chúng tôi.</p>
                    <a href="index.html" class="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">Đến sơ đồ phòng</a>
                </div>
            `;
        } else {
            let roomsHtml = rooms.map(room => `
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Số phòng</p>
                            <p class="text-3xl font-black text-indigo-600">${room.number}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Trạng thái</p>
                            <p class="text-sm font-bold ${room.status === 'occupied' ? 'text-emerald-600' : 'text-orange-600'}">
                                ${room.status === 'occupied' ? 'Đang lưu trú' : (room.status === 'pending' ? 'Chờ duyệt' : 'Chờ trả phòng')}
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 pt-3 border-t border-slate-50">
                        <i data-lucide="clock" class="w-4 h-4 text-slate-400"></i>
                        <span class="text-sm font-medium text-slate-600">
                            Nhận phòng: ${room.checkInTime ? new Date(room.checkInTime).toLocaleString('vi-VN') : 'Đang chờ...'}
                        </span>
                    </div>
                </div>
            `).join('');

            container.innerHTML = `
                <div class="space-y-6">
                    <div class="grid grid-cols-1 gap-4">
                        ${roomsHtml}
                    </div>

                    <div class="bg-indigo-600 p-6 rounded-2xl text-white flex items-center gap-5 shadow-lg shadow-indigo-600/20">
                        <div class="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                            <i data-lucide="shield-check" class="w-7 h-7"></i>
                        </div>
                        <div>
                            <p class="text-xs text-indigo-100 font-bold uppercase tracking-wider mb-1">Cam kết bảo mật</p>
                            <p class="text-sm opacity-90 leading-relaxed">Chúng tôi cam kết bảo mật tuyệt đối danh tính và lịch trình của khách hàng. Chỉ bạn mới thấy được thông tin này.</p>
                        </div>
                    </div>
                </div>
            `;
        }
        lucide.createIcons();
    }
});

// --- TIỆN ÍCH MODAL (GLOBAL ĐỂ ONCLICK GỌI ĐƯỢC) ---
function maskInfo(str) {
    if (!str || str.length < 6) return str;
    return str.substring(0, 3) + '****' + str.substring(str.length - 3);
}

window.openDetailModal = (roomId) => {
    const saved = localStorage.getItem('motelRooms');
    const allRooms = saved ? JSON.parse(saved) : [];
    const room = allRooms.find(r => r.id === Number(roomId));
    if (!room) return;

    const detailModal = document.getElementById('customer-detail-modal');
    const detailBackdrop = document.getElementById('detail-modal-backdrop');
    const detailPanel = document.getElementById('detail-modal-panel');

    if (detailModal) {
        document.getElementById('detail-name').textContent = room.customer || 'Chưa nhập tên';
        document.getElementById('detail-room').textContent = room.number;
        document.getElementById('detail-cccd').textContent = maskInfo(room.customerCccd) || 'Không có';
        document.getElementById('detail-phone').textContent = maskInfo(room.customerPhone) || 'Không có';
        document.getElementById('detail-avatar').textContent = room.customer ? room.customer.charAt(0).toUpperCase() : '?';
        document.getElementById('detail-time').textContent = room.checkInTime ? new Date(room.checkInTime).toLocaleString('vi-VN') : '---';

        detailModal.classList.remove('hidden');
        setTimeout(() => {
            detailBackdrop?.classList.remove('opacity-0');
            detailPanel?.classList.remove('opacity-0', 'scale-95');
        }, 10);
        lucide.createIcons();
    }
};

window.closeDetailModal = () => {
    const detailModal = document.getElementById('customer-detail-modal');
    const detailBackdrop = document.getElementById('detail-modal-backdrop');
    const detailPanel = document.getElementById('detail-modal-panel');
    
    detailBackdrop?.classList.add('opacity-0');
    detailPanel?.classList.add('opacity-0', 'scale-95');
    setTimeout(() => { detailModal?.classList.add('hidden'); }, 300);
};

// Gắn sự kiện đóng modal (Chạy ngay khi script load)
document.addEventListener('click', (e) => {
    if (e.target.id === 'close-detail-modal' || e.target.id === 'close-detail-modal-btn' || e.target.id === 'detail-modal-backdrop') {
        window.closeDetailModal();
    }
});
