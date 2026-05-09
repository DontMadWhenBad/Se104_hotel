document.addEventListener('DOMContentLoaded', () => {
    // 1. Lấy thông tin User và ID phòng từ URL
    const userStr = localStorage.getItem('currentUser');
    const user = userStr ? JSON.parse(userStr) : null;
    
    // Nếu chưa đăng nhập, đá về trang đăng nhập
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const roomIdStr = urlParams.get('id');
    const roomId = parseInt(roomIdStr);
    
    if (!roomId) {
        alert('Không tìm thấy thông tin phòng!');
        window.location.href = 'index.html';
        return;
    }

    // 2. Load dữ liệu phòng
    let rooms = [];
    try {
        const saved = localStorage.getItem('motelRooms');
        if (saved) rooms = JSON.parse(saved);
    } catch(e) {
        console.error(e);
    }

    const room = rooms.find(r => r.id === roomId);
    if (!room) {
        alert('Phòng không tồn tại!');
        window.location.href = 'index.html';
        return;
    }

    // 3. Cấu hình trạng thái (Copy từ app.js)
    const statusConfig = {
        empty: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Trống' },
        occupied: { bg: 'bg-rose-50', text: 'text-rose-700', label: 'Có khách' },
        cleaning: { bg: 'bg-amber-50', text: 'text-amber-800', label: 'Đang dọn' },
        pending: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Chờ duyệt' },
        checkout: { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Chờ thanh toán' }
    };

    // Từ điển tiện ích
    const amenityConfig = {
        'wifi': { icon: 'wifi', label: 'Wifi miễn phí' },
        'air-vent': { icon: 'wind', label: 'Máy lạnh' },
        'tv': { icon: 'tv', label: 'Smart TV' },
        'refrigerator': { icon: 'refrigerator', label: 'Tủ lạnh mini' }
    };

    // Kiểm tra xem phòng này có phải của khách hàng đang xem không
    let isMyRoom = false;
    if (user.role === 'customer') {
        if (room.status === 'pending' && room.bookedBy === user.username) {
            isMyRoom = true;
        } else if ((room.status === 'occupied' || room.status === 'checkout') && (room.bookedBy === user.username || room.customer === user.fullName)) {
            isMyRoom = true;
        }
    }

    // 4. Render dữ liệu lên UI
    document.getElementById('detail-name').textContent = room.number;
    document.getElementById('detail-type').innerHTML = `<i data-lucide="bed-double" class="w-4 h-4"></i> ${room.type || 'Phòng Tiêu Chuẩn'}`;
    document.getElementById('detail-desc').textContent = room.description || 'Chưa có mô tả.';

    // Render Badge Trạng thái
    const config = statusConfig[room.status];
    const badgeEl = document.getElementById('detail-status-badge');
    badgeEl.className = `inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${config.bg} ${config.text}`;
    badgeEl.textContent = config.label;
    
    // Nếu là phòng của mình, hiện thêm huy hiệu Của bạn
    if (isMyRoom) {
        badgeEl.insertAdjacentHTML('afterend', `
            <span class="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm bg-indigo-500 text-white">
                <i data-lucide="star" class="w-4 h-4"></i> Của bạn
            </span>
        `);
    }

    // Render Tiện ích
    const amenitiesEl = document.getElementById('detail-amenities');
    const amenitiesList = room.amenities || [];
    if (amenitiesList.length === 0) {
        amenitiesEl.innerHTML = '<p class="text-slate-400 text-sm">Chưa cập nhật tiện ích</p>';
    } else {
        let html = '';
        amenitiesList.forEach(key => {
            const amen = amenityConfig[key];
            if(amen) {
                html += `
                    <div class="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-100 text-sm font-medium text-slate-700 shadow-sm">
                        <i data-lucide="${amen.icon}" class="w-4 h-4 text-indigo-500"></i> ${amen.label}
                    </div>
                `;
            }
        });
        amenitiesEl.innerHTML = html;
    }

    // Render Nút Hành động
    const actionsEl = document.getElementById('detail-actions');
    
    // Nút Lưu thay đổi chung
    const saveAndReload = () => {
        localStorage.setItem('motelRooms', JSON.stringify(rooms));
        window.location.reload();
    };

    if (user.role === 'customer') {
        if (room.status === 'empty') {
            const formContainer = document.getElementById('booking-form-container');
            if (formContainer) {
                formContainer.classList.remove('hidden');
                
                const checkinInput = document.getElementById('book-checkin');
                const checkoutInput = document.getElementById('book-checkout');
                const nightsEl = document.getElementById('book-nights');
                const unitPriceEl = document.getElementById('book-unit-price');
                const totalEl = document.getElementById('book-total');
                
                const priceNight = room.priceNight || room.price || 200000;
                const priceHour = room.priceHour || Math.round(priceNight / 4);
                
                document.getElementById('display-price-night').textContent = priceNight.toLocaleString() + 'đ/đêm';
                document.getElementById('display-price-hour').textContent = priceHour.toLocaleString() + 'đ/giờ';

                const calculateTotal = () => {
                    const start = new Date(checkinInput.value);
                    const end = new Date(checkoutInput.value);
                    const type = document.querySelector('input[name="booking-type"]:checked')?.value || 'night';
                    
                    if (end > start) {
                        const diffTime = Math.abs(end - start);
                        if (type === 'night') {
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                            totalEl.textContent = (diffDays * priceNight).toLocaleString() + 'đ';
                        } else {
                            const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
                            totalEl.textContent = (diffHours * priceHour).toLocaleString() + 'đ';
                        }
                    } else {
                        totalEl.textContent = '0đ';
                    }
                };
                
                calculateTotal();
                checkinInput.addEventListener('change', calculateTotal);
                checkoutInput.addEventListener('change', calculateTotal);
                document.querySelectorAll('input[name="booking-type"]').forEach(radio => {
                    radio.addEventListener('change', calculateTotal);
                });

                actionsEl.innerHTML = `
                    <button id="action-book" class="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]">
                        Gửi yêu cầu đặt phòng
                    </button>
                `;

                document.getElementById('action-book').onclick = () => {
                    const start = new Date(checkinInput.value);
                    const end = new Date(checkoutInput.value);
                    const type = document.querySelector('input[name="booking-type"]:checked')?.value || 'night';
                    
                    if (end <= start) {
                        alert('Ngày trả phòng phải sau ngày nhận phòng!');
                        return;
                    }

                    const typeText = type === 'night' ? 'Theo đêm' : 'Theo giờ';
                    if(confirm(`Bạn đặt phòng ${typeText} từ ${start.toLocaleString()} đến ${end.toLocaleString()}?`)) {
                        const diffTime = Math.abs(end - start);
                        let estimatedTotal = 0;
                        if (type === 'night') {
                            estimatedTotal = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) * priceNight;
                        } else {
                            estimatedTotal = Math.ceil(diffTime / (1000 * 60 * 60)) * priceHour;
                        }

                        room.status = 'pending';
                        room.bookedBy = user.username;
                        room.bookedByName = user.fullName;
                        room.bookingType = type;
                        room.checkInTime = checkinInput.value;
                        room.expectedCheckOut = checkoutInput.value;
                        room.estimatedTotal = estimatedTotal;
                        saveAndReload();
                        alert('Gửi yêu cầu đặt phòng thành công!');
                    }
                };
            }
        } else if (room.status === 'pending') {
            if (isMyRoom) {
                actionsEl.innerHTML = `
                    <div class="text-center p-3 rounded-xl bg-orange-100 text-orange-800 font-medium text-sm">
                        Đang chờ Lễ tân duyệt...
                    </div>
                `;
            } else {
                actionsEl.innerHTML = `
                    <div class="text-center p-3 rounded-xl bg-slate-200 text-slate-500 font-medium text-sm">
                        Phòng đã có người đặt
                    </div>
                `;
            }
        } else if (room.status === 'occupied') {
            if (isMyRoom) {
                actionsEl.innerHTML = `
                    <button id="action-checkout" class="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors shadow-sm shadow-purple-600/20 flex items-center justify-center gap-2">
                        <i data-lucide="log-out" class="w-5 h-5"></i> Yêu cầu trả phòng
                    </button>
                `;
                document.getElementById('action-checkout').onclick = () => {
                    if(confirm('Bạn có muốn gửi yêu cầu thanh toán và trả phòng không?')) {
                        room.status = 'checkout';
                        saveAndReload();
                        alert('Đã gửi yêu cầu Trả phòng thành công!');
                    }
                };
            } else {
                actionsEl.innerHTML = `
                    <div class="text-center p-3 rounded-xl bg-slate-200 text-slate-500 font-medium text-sm">
                        Phòng đang có người thuê
                    </div>
                `;
            }
        } else if (room.status === 'checkout') {
            if (isMyRoom) {
                actionsEl.innerHTML = `
                    <div class="text-center p-3 rounded-xl bg-purple-100 text-purple-800 font-medium text-sm">
                        Lễ tân đang xử lý thanh toán...
                    </div>
                `;
            } else {
                actionsEl.innerHTML = `
                    <div class="text-center p-3 rounded-xl bg-slate-200 text-slate-500 font-medium text-sm">
                        Phòng đang làm thủ tục trả
                    </div>
                `;
            }
        } else if (room.status === 'cleaning') {
            actionsEl.innerHTML = `
                <div class="text-center p-3 rounded-xl bg-amber-100 text-amber-800 font-medium text-sm">
                    Phòng đang được dọn dẹp
                </div>
            `;
        }
    } else if (user.role === 'admin') {
        // Admin chỉ xem hoặc có thể quay về
        actionsEl.innerHTML = `
            <div class="text-sm text-slate-500 mb-3 text-center">Bạn đang ở quyền Lễ tân. Hãy quay lại Sơ đồ phòng để chỉnh sửa.</div>
            <a href="index.html" class="block text-center w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors shadow-sm shadow-indigo-600/20">
                Về sơ đồ phòng
            </a>
        `;
    }

    // Yêu cầu vẽ lại icon
    lucide.createIcons();
});
