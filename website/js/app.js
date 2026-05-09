// Khởi tạo các icon từ thư viện Lucide
lucide.createIcons();

/**
 * 1. KHỞI TẠO DỮ LIỆU BẰNG LOCAL STORAGE
 * Lưu dữ liệu không bị mất khi F5
 */
function loadRooms() {
    const saved = localStorage.getItem('motelRooms');
    if (saved) {
        return JSON.parse(saved);
    }
    // Nếu chưa có, tạo dữ liệu mặc định
    const defaultRooms = Array.from({ length: 10 }, (_, i) => ({
        id: 101 + i,
        number: `Phòng ${101 + i}`,
        status: 'empty', // 'empty', 'occupied', 'cleaning'
        customer: '',
        customerId: '',
        checkInTime: ''
    }));
    
    // Tạo sẵn một số dữ liệu mẫu
    defaultRooms[1].status = 'occupied';
    defaultRooms[1].customer = 'Nguyễn Văn A';
    defaultRooms[1].customerId = '012345678912';
    // Đặt giờ check in của người này là 2 tiếng trước
    const now = new Date();
    now.setHours(now.getHours() - 2);
    // Format lại thành YYYY-MM-DDThh:mm
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    defaultRooms[1].checkInTime = now.toISOString().slice(0,16);
    
    return defaultRooms;
}

function saveRooms() {
    localStorage.setItem('motelRooms', JSON.stringify(rooms));
}

let rooms = loadRooms();

// Bổ sung dữ liệu chi tiết phòng nếu chưa có (Migration cho tính năng Trang chi tiết)
let dataChanged = false;
rooms.forEach(room => {
    if (!room.type) {
        // Gán dữ liệu mặc định
        room.type = (room.id % 2 === 0) ? 'Phòng Đôi' : 'Phòng Đơn';
        room.price = (room.type === 'Phòng Đôi') ? 300000 : 200000;
        room.amenities = ["wifi", "air-vent", "tv"];
        if (room.type === 'Phòng Đôi') room.amenities.push("refrigerator");
        room.description = `Không gian rộng rãi, thoáng mát, được trang bị đầy đủ tiện nghi cơ bản. Phù hợp cho khách hàng cần sự thoải mái và yên tĩnh.`;
        dataChanged = true;
    }
});
if (dataChanged) {
    saveRooms();
}

/**
 * 2. CẤU HÌNH MÀU SẮC DỰA THEO TRẠNG THÁI
 * Xanh lá: Trống | Đỏ: Có khách | Vàng: Đang dọn dẹp
 */
const statusConfig = {
    empty: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-700',
        icon: 'door-open',
        badgeBg: 'bg-emerald-100',
        label: 'Trống'
    },
    occupied: {
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        text: 'text-rose-700',
        icon: 'user-check',
        badgeBg: 'bg-rose-100',
        label: 'Có khách'
    },
    cleaning: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-800',
        icon: 'sparkles',
        badgeBg: 'bg-amber-100',
        label: 'Đang dọn'
    },
    pending: {
        bg: 'bg-orange-50',
        border: 'border-orange-300',
        text: 'text-orange-700',
        icon: 'hourglass',
        badgeBg: 'bg-orange-100',
        label: 'Chờ duyệt'
    },
    checkout: {
        bg: 'bg-purple-50',
        border: 'border-purple-300',
        text: 'text-purple-700',
        icon: 'log-out',
        badgeBg: 'bg-purple-100',
        label: 'Chờ thanh toán'
    }
};

/**
 * 3. HÀM RENDER (VẼ) GIAO DIỆN SƠ ĐỒ PHÒNG
 */
const roomGrid = document.getElementById('room-grid');

function renderRooms() {
    roomGrid.innerHTML = ''; // Xóa sạch HTML cũ

    rooms.forEach(room => {
        const config = statusConfig[room.status];
        
        // Tạo một thẻ div đại diện cho một phòng
        const roomCard = document.createElement('div');
        
        // Kiểm tra xem phòng này có phải của User đang đăng nhập không
        const userStr = localStorage.getItem('currentUser');
        const user = userStr ? JSON.parse(userStr) : null;
        
        let isMyRoom = false;
        if (user && user.role === 'customer') {
            if (room.status === 'pending' && room.bookedBy === user.username) {
                isMyRoom = true;
            } else if ((room.status === 'occupied' || room.status === 'checkout') && (room.bookedBy === user.username || room.customer === user.fullName)) {
                isMyRoom = true;
            }
        }
        
        // Gán các class Tailwind CSS (Thêm hiệu ứng hover, shadow)
        roomCard.className = `group relative overflow-hidden rounded-2xl border ${config.border} ${config.bg} p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between min-h-[140px]`;
        
        // Nếu là phòng của mình, thêm viền nổi bật
        if (isMyRoom) {
            roomCard.className += ' ring-2 ring-indigo-500 ring-offset-2';
        }
        
        // Gán sự kiện click:
        // - Admin: Mở Modal chỉnh sửa
        // - Khách hàng: Chuyển sang trang xem Chi tiết phòng
        roomCard.onclick = () => {
            
            if (user && user.role === 'admin') {
                openModal(room.id);
            } else if (user && user.role === 'customer') {
                window.location.href = `room-detail.html?id=${room.id}`;
            }
        };

        // Nội dung HTML bên trong của thẻ phòng
        let myRoomBadge = '';
        if (isMyRoom) {
            myRoomBadge = `
                <div class="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl rounded-tr-2xl shadow-sm flex items-center gap-1 z-10">
                    <i data-lucide="star" class="w-3 h-3"></i> Của bạn
                </div>
            `;
        }

        roomCard.innerHTML = `
            ${myRoomBadge}
            <div class="flex justify-between items-start mb-4">
                <div class="flex items-center gap-3">
                    <span class="inline-flex items-center justify-center p-2 rounded-xl bg-white shadow-sm ${config.text}">
                        <i data-lucide="${config.icon}" class="w-5 h-5"></i>
                    </span>
                    <h3 class="font-bold text-lg text-slate-800">${room.number}</h3>
                </div>
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.badgeBg} ${config.text}">
                    ${config.label}
                </span>
            </div>
            
            <div class="mt-auto">
                ${room.status === 'occupied' || room.status === 'checkout' ? `
                    <div class="flex items-center gap-2 text-sm font-medium ${config.text} truncate">
                        <i data-lucide="user" class="w-4 h-4 opacity-70 shrink-0"></i>
                        <span class="truncate">${(user.role === 'admin' || isMyRoom) ? room.customer : 'Khách lưu trú'}</span>
                    </div>
                    ${room.checkInTime ? `
                    <div class="flex items-center gap-2 text-xs font-medium ${config.text} mt-1.5 opacity-80">
                        <i data-lucide="clock" class="w-3.5 h-3.5 shrink-0"></i>
                        ${new Date(room.checkInTime).toLocaleString('vi-VN', {hour: '2-digit', minute:'2-digit', day:'2-digit', month:'2-digit'})}
                    </div>` : ''}
                ` : `
                    <div class="text-sm opacity-60 font-medium ${config.text}">
                        ${room.status === 'cleaning' ? 'Chờ nhân viên dọn dẹp...' : 'Sẵn sàng đón khách mới'}
                    </div>
                `}
            </div>
            
            <!-- Hiệu ứng viền phát sáng khi di chuột qua -->
            <div class="absolute inset-0 border-2 border-transparent group-hover:border-indigo-500/20 rounded-2xl transition-colors pointer-events-none"></div>
        `;
        
        // Thêm phòng vào lưới
        roomGrid.appendChild(roomCard);
    });
    
    // Yêu cầu thư viện Lucide vẽ lại các icon mới được thêm vào HTML
    lucide.createIcons();
}

/**
 * 4. LOGIC XỬ LÝ CỬA SỔ POPUP (MODAL)
 */
const modal = document.getElementById('room-modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalPanel = document.getElementById('modal-panel');
const closeModalBtn = document.getElementById('close-modal');
const cancelBtn = document.getElementById('cancel-btn');
const saveBtn = document.getElementById('save-btn');
const checkoutBtn = document.getElementById('checkout-btn');
const customerInput = document.getElementById('customer-name');
const customerCccdInput = document.getElementById('customer-cccd');
const customerPhoneInput = document.getElementById('customer-phone');
const checkInTimeInput = document.getElementById('check-in-time');
const statusRadios = document.getElementsByName('status');
const customerInfoGroup = document.getElementById('customer-info-group');
const priceNightInput = document.getElementById('room-price-night');
const priceHourInput = document.getElementById('room-price-hour');
const priceNote = document.getElementById('room-price-note');

let currentEditingRoomId = null;

// Hàm Mở Modal
function openModal(roomId) {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;
    
    currentEditingRoomId = roomId;
    
    // Đổi tiêu đề Modal thành tên phòng đang chọn
    document.getElementById('modal-title').textContent = room.number;
    
    // Đổ dữ liệu cũ của phòng vào form
    customerInput.value = room.customer || '';
    customerCccdInput.value = room.customerCccd || '';
    customerPhoneInput.value = room.customerPhone || '';
    checkInTimeInput.value = room.checkInTime || '';

    // Hiển thị giá phòng (Hỗ trợ 2 loại giá)
    priceNightInput.value = room.pendingPriceNight || room.priceNight || room.price || '';
    priceHourInput.value = room.pendingPriceHour || room.priceHour || (room.price ? Math.round(room.price / 4) : ''); // Mặc định giá giờ = 1/4 giá đêm nếu chưa có
    // Nếu phòng đang có khách, hiện badge cảnh báo "Áp dụng lần trống tiếp theo"
    if (room.status === 'occupied' || room.status === 'checkout') {
        priceNote.classList.remove('hidden');
    } else {
        priceNote.classList.add('hidden');
    }

    // Chọn sẵn trạng thái hiện tại của phòng trên các Radio Button
    for(let radio of statusRadios) {
        if(radio.value === room.status || (room.status === 'checkout' && radio.value === 'occupied')) {
            radio.checked = true;
        }
    }
    
    // Xử lý cảnh báo Yêu cầu Trả phòng
    const checkoutAlertGroup = document.getElementById('checkout-alert-group');
    if (room.status === 'checkout') {
        checkoutAlertGroup.classList.remove('hidden');
    } else {
        checkoutAlertGroup.classList.add('hidden');
    }
    
    // Xử lý giao diện cho phòng Pending
    const pendingActionGroup = document.getElementById('pending-action-group');
    const statusRadioGroup = document.getElementById('status-radio-group');
    const saveBtnGroup = document.getElementById('save-btn');
    const pendingRequestInfo = document.getElementById('pending-request-info');

    if (room.status === 'pending') {
        pendingActionGroup.classList.remove('hidden');
        statusRadioGroup.classList.add('hidden');
        saveBtnGroup.classList.add('hidden');
        
        let infoHtml = `<div class="space-y-1">
            <p>Khách hàng: <strong>${room.bookedByName || room.bookedBy}</strong></p>`;
        
        if (room.checkInTime && room.expectedCheckOut) {
            const start = new Date(room.checkInTime).toLocaleString('vi-VN', {hour: '2-digit', minute:'2-digit', day:'2-digit', month:'2-digit', year:'numeric'});
            const end = new Date(room.expectedCheckOut).toLocaleString('vi-VN', {hour: '2-digit', minute:'2-digit', day:'2-digit', month:'2-digit', year:'numeric'});
            infoHtml += `
                <p class="text-xs">Lịch: <strong>${start}</strong> → <strong>${end}</strong></p>
                <p class="text-xs">Tổng tiền dự kiến: <strong class="text-indigo-600 text-sm">${(room.estimatedTotal || 0).toLocaleString()}đ</strong></p>
            `;
        }
        infoHtml += `</div>`;
        pendingRequestInfo.innerHTML = infoHtml;
        
        // Vô hiệu hóa form nhập liệu lúc chờ duyệt
        customerInput.disabled = true;
        customerCccdInput.disabled = true;
        customerPhoneInput.disabled = true;
        checkInTimeInput.disabled = true;
    } else {
        pendingActionGroup.classList.add('hidden');
        statusRadioGroup.classList.remove('hidden');
        saveBtnGroup.classList.remove('hidden');
        
        customerInput.disabled = false;
        customerCccdInput.disabled = false;
        customerPhoneInput.disabled = false;
        checkInTimeInput.disabled = false;
    }
    
    // Quyết định xem có hiển thị form nhập khách hàng và nút trả phòng không
    toggleCustomerInputVisibility(room.status);

    // Xử lý hiển thị dịch vụ đã dùng
    const servicesUsageGroup = document.getElementById('services-usage-group');
    const modalServicesList = document.getElementById('modal-services-list');
    const modalServiceTotal = document.getElementById('modal-service-total');

    if (room.servicesUsed && room.servicesUsed.length > 0) {
        servicesUsageGroup.classList.remove('hidden');
        modalServiceTotal.textContent = (room.serviceTotal || 0).toLocaleString() + 'đ';
        modalServicesList.innerHTML = room.servicesUsed.map(s => `
            <div class="flex justify-between items-center text-xs text-slate-600">
                <span>${s.qty}x ${s.name}</span>
                <span class="font-medium">${(s.price * s.qty).toLocaleString()}đ</span>
            </div>
        `).join('');
    } else {
        servicesUsageGroup.classList.add('hidden');
    }

    // Hiển thị modal (Bỏ class hidden)
    modal.classList.remove('hidden');
    
    // Tạo hiệu ứng mượt mà (Animation) bằng cách set timeout nhỏ
    setTimeout(() => {
        modalBackdrop.classList.remove('opacity-0');
        modalPanel.classList.remove('opacity-0', 'scale-95');
    }, 10);
}

// Hàm Đóng Modal
function closeModal() {
    // Chạy hiệu ứng mờ đi (Fade out)
    modalBackdrop.classList.add('opacity-0');
    modalPanel.classList.add('opacity-0', 'scale-95');
    
    // Chờ hiệu ứng kết thúc (200ms) rồi mới ẩn hẳn đi
    setTimeout(() => {
        modal.classList.add('hidden');
        currentEditingRoomId = null;
    }, 200);
}

// Hàm Ẩn/Hiện form nhập khách hàng và nút Checkout
function toggleCustomerInputVisibility(status) {
    if(status === 'occupied' || status === 'checkout') {
        customerInfoGroup.style.display = 'block'; // Hiển thị form
        checkoutBtn.style.display = 'block'; // Hiện nút Trả phòng
        // Tự động gán giờ hiện tại nếu đang trống
        if(!checkInTimeInput.value) {
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            checkInTimeInput.value = now.toISOString().slice(0,16);
        }
    } else {
        customerInfoGroup.style.display = 'none'; // Ẩn form
        checkoutBtn.style.display = 'none'; // Ẩn nút Trả phòng
        // Nếu không phải đang thuê thì xóa dữ liệu trên Form
        if (status === 'empty' || status === 'cleaning' || status === 'pending') {
             customerInput.value = ''; 
             customerCccdInput.value = '';
             customerPhoneInput.value = '';
             checkInTimeInput.value = '';
        }
    }
}

// Lắng nghe sự kiện người dùng bấm vào các tùy chọn Trạng thái (Trống/Có khách/Đang dọn)
statusRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        toggleCustomerInputVisibility(e.target.value);
    });
});

// Sự kiện nút Duyệt (Nhận phòng)
document.getElementById('approve-btn').addEventListener('click', () => {
    const roomIndex = rooms.findIndex(r => r.id === currentEditingRoomId);
    if (roomIndex === -1) return;
    
    const room = rooms[roomIndex];
    
    // Đổi giao diện sang trạng thái "occupied" để điền nốt CCCD
    document.getElementById('pending-action-group').classList.add('hidden');
    document.getElementById('status-radio-group').classList.remove('hidden');
    document.getElementById('save-btn').classList.remove('hidden');
    
    customerInput.disabled = false;
    customerCccdInput.disabled = false;
    customerPhoneInput.disabled = false;
    checkInTimeInput.disabled = false;
    
    // Gán sẵn tên khách
    customerInput.value = room.bookedByName || room.bookedBy;
    
    // Đánh dấu radio 'occupied' và kích hoạt sự kiện change để hiện form CCCD
    for(let radio of statusRadios) {
        if(radio.value === 'occupied') {
            radio.checked = true;
            radio.dispatchEvent(new Event('change')); 
        }
    }
    
    alert('Đã duyệt! Vui lòng điền số CCCD và ấn "Lưu thay đổi" để chính thức nhận phòng.');
});

// Sự kiện nút Từ chối đặt phòng
document.getElementById('reject-btn').addEventListener('click', () => {
    if (confirm('Bạn có chắc chắn muốn từ chối yêu cầu đặt phòng này?')) {
        const roomIndex = rooms.findIndex(r => r.id === currentEditingRoomId);
        if (roomIndex !== -1) {
            rooms[roomIndex].status = 'empty';
            delete rooms[roomIndex].bookedBy;
            delete rooms[roomIndex].bookedByName;
            saveRooms();
            renderRooms();
            updateSummary();
            closeModal();
            alert('Đã từ chối yêu cầu đặt phòng.');
        }
    }
});

// Sự kiện bấm nút Lưu
saveBtn.addEventListener('click', () => {
    if (!currentEditingRoomId) return;
    
    // Tìm phòng đang sửa trong danh sách
    const roomIndex = rooms.findIndex(r => r.id === currentEditingRoomId);
    if (roomIndex === -1) return;
    
    // Lấy trạng thái mới mà người dùng đã chọn
    let selectedStatus = 'empty';
    for(let radio of statusRadios) {
        if(radio.checked) selectedStatus = radio.value;
    }
    
    // Khai báo các biến validate
    const nameVal = customerInput.value.trim();
    const cccdVal = customerCccdInput.value.trim();
    const phoneVal = customerPhoneInput.value.trim();
    const errorName = document.getElementById('error-name');
    
    // Hàm helper để hiển thị lỗi
    const showError = (inputEl, errorEl, message) => {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
        inputEl.classList.add('border-rose-500', 'ring-1', 'ring-rose-500');
        inputEl.classList.remove('border-slate-300'); // Class mặc định
    };

    // Hàm helper để xóa lỗi
    const clearError = (inputEl, errorEl) => {
        if(errorEl) errorEl.classList.add('hidden');
        inputEl.classList.remove('border-rose-500', 'ring-1', 'ring-rose-500');
        inputEl.classList.add('border-slate-300');
    };

    // Reset lỗi trước khi check lại
    clearError(customerInput, errorName);

    // Kiểm tra tính hợp lệ nếu chọn "Có khách"
    if (selectedStatus === 'occupied') {
        let hasError = false;

        // 1. Kiểm tra tên không được bỏ trống
        if (nameVal === '') {
            showError(customerInput, errorName, 'Vui lòng nhập tên khách hàng');
            hasError = true;
        }

        if (hasError) return; // Nếu có lỗi thì dừng lại, không lưu
    }

    // Cập nhật lại mảng dữ liệu
    rooms[roomIndex].status = selectedStatus;
    if (selectedStatus === 'occupied') {
        rooms[roomIndex].customer = customerInput.value.trim();
        rooms[roomIndex].customerCccd = customerCccdInput.value.trim();
        rooms[roomIndex].customerPhone = customerPhoneInput.value.trim();
        rooms[roomIndex].checkInTime = checkInTimeInput.value;
    } else {
        rooms[roomIndex].customer = '';
        rooms[roomIndex].customerCccd = '';
        rooms[roomIndex].customerPhone = '';
        rooms[roomIndex].checkInTime = '';
    }
    
    if (selectedStatus === 'empty' || selectedStatus === 'cleaning') {
        // Chỉ xóa thông tin đặt trước khi phòng trở về Trống hoặc Đang dọn
        delete rooms[roomIndex].bookedBy;
        delete rooms[roomIndex].bookedByName;
    }
    
    // Lưu giá phòng mới
    const newPriceNight = Number(priceNightInput.value);
    const newPriceHour = Number(priceHourInput.value);

    if (room.status === 'occupied' || room.status === 'checkout') {
        // Nếu đang có khách, lưu vào hàng chờ để áp dụng sau
        room.pendingPriceNight = newPriceNight;
        room.pendingPriceHour = newPriceHour;
    } else {
        // Nếu phòng trống hoặc đang dọn, áp dụng ngay
        room.priceNight = newPriceNight;
        room.priceHour = newPriceHour;
        delete room.pendingPriceNight;
        delete room.pendingPriceHour;
    }

    // Lưu vào Local Storage và vẽ lại giao diện
    saveRooms();
    renderRooms();
    closeModal();
});

// Sự kiện bấm nút Trả phòng
checkoutBtn.addEventListener('click', () => {
    if (!currentEditingRoomId) return;
    
    // Xác nhận trả phòng
    if(confirm('Bạn có chắc chắn muốn làm thủ tục trả phòng cho khách này?')) {
        const roomIndex = rooms.findIndex(r => r.id === currentEditingRoomId);
        if (roomIndex !== -1) {
            const room = rooms[roomIndex];
            
            // 1. Tính toán số tiền theo đêm
            const checkInDate = new Date(room.checkInTime);
            const checkOutDate = new Date();
            // Tính số đêm (tối thiểu 1 đêm)
            const diffNights = Math.max(1, Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)));

            const pricePerNight = room.price || 200000;
            const roomAmount = diffNights * pricePerNight;
            const serviceAmount = room.serviceTotal || 0;
            const amount = roomAmount + serviceAmount;
            
            // 2. Lưu vào Lịch sử giao dịch (revenueHistory)
            const history = JSON.parse(localStorage.getItem('revenueHistory')) || [];
            const transaction = {
                id: 'HD' + Math.floor(10000 + Math.random() * 90000),
                room: room.number,
                customer: room.customer,
                customerId: room.customerCccd || room.customerPhone || 'Không có',
                amount: amount,
                status: 'Đã thanh toán',
                time: checkOutDate.toISOString(),
                nights: diffNights
            };
            history.unshift(transaction);
            localStorage.setItem('revenueHistory', JSON.stringify(history));

            // 3. Reset phòng (Chuyển sang trạng thái đang dọn)
            rooms[roomIndex].status = 'cleaning';
            rooms[roomIndex].customer = '';
            rooms[roomIndex].customerCccd = '';
            rooms[roomIndex].customerPhone = '';
            rooms[roomIndex].checkInTime = '';
            rooms[roomIndex].serviceTotal = 0;
            rooms[roomIndex].servicesUsed = [];
            // Áp dụng pendingPrice nếu admin đã đặt giá mới
            if (rooms[roomIndex].pendingPrice) {
                rooms[roomIndex].price = rooms[roomIndex].pendingPrice;
                delete rooms[roomIndex].pendingPrice;
            }
            
            saveRooms();
            renderRooms();
            closeModal();
            
            const formattedAmount = new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(amount);
            const nightInfo = `${diffNights} đêm × ${pricePerNight.toLocaleString()}đ/đêm`;
            const detailMsg = serviceAmount > 0
                ? `\n(Tiền phòng: ${nightInfo} = ${roomAmount.toLocaleString()}đ\n Dịch vụ: ${serviceAmount.toLocaleString()}đ)`
                : `\n(${nightInfo})`;
            alert(`Đã trả phòng thành công!\nThu của khách: ${formattedAmount}${detailMsg}`);
        }
    }
});

// Gắn sự kiện đóng cửa sổ khi bấm vào Nút X, Nút Hủy, hoặc bấm ra ngoài màn hình mờ
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

/**
 * 5. KHỞI ĐỘNG CHƯƠNG TRÌNH
 * Gọi hàm renderRooms để vẽ ra sơ đồ khi trang web vừa tải xong
 */
renderRooms();
