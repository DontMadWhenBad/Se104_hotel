document.addEventListener('DOMContentLoaded', () => {
    // 1. Dữ liệu mặc định nếu chưa có trong localStorage
    const defaultServices = [
        { id: 'f1', name: 'Mì tôm trứng', price: 25000, icon: 'soup', category: 'Đồ ăn' },
        { id: 'f2', name: 'Bánh mì thịt', price: 20000, icon: 'sandwich', category: 'Đồ ăn' },
        { id: 'd1', name: 'Nước suối', price: 10000, icon: 'droplet', category: 'Đồ uống' },
        { id: 'd2', name: 'Coca Cola', price: 15000, icon: 'cup-soda', category: 'Đồ uống' },
        { id: 's1', name: 'Giặt ủi (kg)', price: 30000, icon: 'shirt', category: 'Dịch vụ' }
    ];

    // Khởi tạo dữ liệu dịch vụ từ localStorage
    if (!localStorage.getItem('motelServices')) {
        localStorage.setItem('motelServices', JSON.stringify(defaultServices));
    }

    let serviceItems = JSON.parse(localStorage.getItem('motelServices')) || [];

    const userStr = localStorage.getItem('currentUser');
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;

    const customerView = document.getElementById('customer-view');
    const adminView = document.getElementById('admin-view');
    const adminHeaderActions = document.getElementById('admin-header-actions');
    const pageTitle = document.getElementById('page-title');

    // Phân quyền hiển thị
    if (user.role === 'admin') {
        adminView?.classList.remove('hidden');
        adminHeaderActions?.classList.remove('hidden');
        if (pageTitle) pageTitle.textContent = 'Quản lý Yêu cầu Dịch vụ';
        renderAdminOrders();
    } else {
        customerView?.classList.remove('hidden');
        if (pageTitle) pageTitle.textContent = 'Dịch vụ phòng';
        initCustomerView();
    }

    // --- LOGIC CHUNG MODAL ---
    const modals = document.querySelectorAll('.fixed.inset-0');
    modals.forEach(modal => {
        modal.querySelectorAll('.modal-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        });
    });

    function openModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove('hidden');
            lucide.createIcons();
        }
    }

    // --- LOGIC CHO ADMIN: QUẢN LÝ DỊCH VỤ ---
    const addServiceBtn = document.getElementById('add-service-btn');
    const viewServicesBtn = document.getElementById('view-services-btn');
    const addServiceForm = document.getElementById('add-service-form');

    addServiceBtn?.addEventListener('click', () => openModal('add-service-modal'));
    viewServicesBtn?.addEventListener('click', () => {
        renderServiceManagementList();
        openModal('service-list-modal');
    });

    addServiceForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('new-service-name').value;
        const price = parseInt(document.getElementById('new-service-price').value);
        const category = document.getElementById('new-service-category').value;
        
        const newService = {
            id: 's' + Date.now(),
            name,
            price,
            category,
            icon: category === 'Đồ ăn' ? 'soup' : (category === 'Đồ uống' ? 'cup-soda' : 'package')
        };

        serviceItems.push(newService);
        localStorage.setItem('motelServices', JSON.stringify(serviceItems));
        
        addServiceForm.reset();
        document.getElementById('add-service-modal').classList.add('hidden');
        alert('Đã thêm dịch vụ mới thành công!');
    });

    function renderServiceManagementList() {
        const listEl = document.getElementById('service-management-list');
        if (!listEl) return;
        
        listEl.innerHTML = serviceItems.map(item => `
            <div class="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-white transition-all group">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-indigo-600 shadow-sm">
                        <i data-lucide="${item.icon}" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-800">${item.name}</h4>
                        <p class="text-xs text-slate-500">${item.category} • ${item.price.toLocaleString()}đ</p>
                    </div>
                </div>
                <button onclick="deleteService('${item.id}')" class="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        `).join('');
        lucide.createIcons();
    }

    window.deleteService = (id) => {
        if (!confirm('Bạn có chắc muốn xóa dịch vụ này?')) return;
        serviceItems = serviceItems.filter(item => item.id !== id);
        localStorage.setItem('motelServices', JSON.stringify(serviceItems));
        renderServiceManagementList();
    };

    // --- LOGIC CHO KHÁCH HÀNG ---
    let cart = [];

    function initCustomerView() {
        const openOrderBtn = document.getElementById('open-order-modal-btn');
        
        // Luôn gắn sự kiện cho nút, nhưng kiểm tra phòng khi bấm
        openOrderBtn?.addEventListener('click', () => {
            const rooms = JSON.parse(localStorage.getItem('motelRooms')) || [];
            const myRooms = rooms.filter(r => (r.status === 'occupied' || r.status === 'checkout') && (r.bookedBy === user.username || r.customer === user.fullName));
            
            if (myRooms.length === 0) {
                alert('Bạn hiện không lưu trú tại phòng nào nên không thể đặt dịch vụ.');
                return;
            }

            // Cập nhật bộ chọn phòng
            const selectContainer = document.getElementById('room-selection-container');
            const roomSelect = document.getElementById('order-room-select');
            
            if (roomSelect && selectContainer) {
                if (myRooms.length > 1) {
                    selectContainer.classList.remove('hidden');
                    roomSelect.innerHTML = myRooms.map(r => `<option value="${r.id}">Dịch vụ cho ${r.number}</option>`).join('');
                } else {
                    selectContainer.classList.add('hidden');
                    roomSelect.innerHTML = `<option value="${myRooms[0].id}">${myRooms[0].number}</option>`;
                }
            }
            
            renderOrderMenu();
            openModal('order-modal');
        });

        const rooms = JSON.parse(localStorage.getItem('motelRooms')) || [];
        const myRooms = rooms.filter(r => (r.status === 'occupied' || r.status === 'checkout') && (r.bookedBy === user.username || r.customer === user.fullName));
        
        if (myRooms.length > 0) {
            renderCustomerOrders(myRooms[0].id); // Mặc định hiện đơn của phòng đầu tiên
        } else {
            document.getElementById('not-staying-alert')?.classList.remove('hidden');
        }
    }

    function renderOrderMenu() {
        serviceItems = JSON.parse(localStorage.getItem('motelServices')) || [];
        const menuGrid = document.getElementById('order-menu-grid');
        if (!menuGrid) return;

        if (serviceItems.length === 0) {
            menuGrid.innerHTML = '<div class="col-span-full py-12 text-center text-slate-400">Chưa có dịch vụ nào khả dụng.</div>';
            return;
        }

        menuGrid.innerHTML = serviceItems.map(item => {
            const inCart = cart.find(c => c.id === item.id);
            const qty = inCart ? inCart.qty : 0;
            return `
                <div class="bg-white p-4 rounded-2xl border ${qty > 0 ? 'border-indigo-500 bg-indigo-50/20' : 'border-slate-200'} shadow-sm flex items-center justify-between group transition-all">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl ${qty > 0 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'} flex items-center justify-center transition-colors">
                            <i data-lucide="${item.icon}"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-slate-800">${item.name}</h3>
                            <p class="text-xs font-bold text-indigo-600">${item.price.toLocaleString()}đ</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        ${qty > 0 ? `
                            <button onclick="updateCart('${item.id}', -1)" class="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-rose-500 transition-colors">
                                <i data-lucide="minus" class="w-4 h-4"></i>
                            </button>
                            <span class="font-bold text-slate-900 w-4 text-center">${qty}</span>
                        ` : ''}
                        <button onclick="updateCart('${item.id}', 1)" class="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors">
                            <i data-lucide="plus" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        lucide.createIcons();
    }

    window.updateCart = (id, delta) => {
        const item = serviceItems.find(i => i.id === id);
        const existing = cart.find(c => c.id === id);
        if (existing) {
            existing.qty += delta;
            if (existing.qty <= 0) cart = cart.filter(c => c.id !== id);
        } else if (delta > 0) {
            cart.push({ ...item, qty: 1 });
        }
        renderOrderMenu();
        updateCartFooter();
    };

    function updateCartFooter() {
        const footer = document.getElementById('order-cart-footer');
        const countEl = document.getElementById('cart-summary-text');
        const totalEl = document.getElementById('cart-total');
        if (!footer || !countEl || !totalEl) return;
        
        if (cart.length === 0) {
            footer.classList.add('hidden');
            return;
        }

        footer.classList.remove('hidden');
        const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
        const totalPrice = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        countEl.textContent = `${totalItems} món được chọn`;
        totalEl.textContent = totalPrice.toLocaleString() + 'đ';
    }

    document.getElementById('submit-order-btn')?.addEventListener('click', () => {
        if (cart.length === 0) return;
        
        const roomSelect = document.getElementById('order-room-select');
        if (!roomSelect) return;
        
        const selectedRoomId = Number(roomSelect.value);
        const rooms = JSON.parse(localStorage.getItem('motelRooms')) || [];
        const myRoom = rooms.find(r => r.id === selectedRoomId);
        
        if (!myRoom) {
            alert('Lỗi: Không xác định được phòng phục vụ.');
            return;
        }

        const orders = JSON.parse(localStorage.getItem('serviceOrders')) || [];
        const totalPrice = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        
        const newOrder = {
            id: 'ORD' + Date.now(),
            roomId: myRoom.id,
            roomNumber: myRoom.number,
            customerName: user.fullName,
            items: cart,
            total: totalPrice,
            status: 'pending',
            timestamp: new Date().toISOString()
        };

        orders.push(newOrder);
        localStorage.setItem('serviceOrders', JSON.stringify(orders));

        alert('Đặt dịch vụ thành công!');
        cart = [];
        updateCartFooter();
        document.getElementById('order-modal')?.classList.add('hidden');
        renderCustomerOrders(myRoom.id);
    });

    function renderCustomerOrders(roomId) {
        const orders = JSON.parse(localStorage.getItem('serviceOrders')) || [];
        const myOrders = orders.filter(o => o.roomId === roomId);
        const activeContainer = document.getElementById('customer-active-orders');
        const orderListEl = document.getElementById('customer-order-list');
        const activeCountEl = document.getElementById('active-order-count');
        if (!activeContainer || !orderListEl) return;

        if (myOrders.length === 0) {
            activeContainer.classList.add('hidden');
            return;
        }

        activeContainer.classList.remove('hidden');
        const pendingCount = myOrders.filter(o => o.status === 'pending').length;
        if (activeCountEl) activeCountEl.textContent = `${pendingCount} Đang chờ`;

        orderListEl.innerHTML = myOrders.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).map(order => `
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div class="absolute top-0 right-0 p-2">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${order.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}">
                        ${order.status === 'pending' ? 'Chờ phục vụ' : 'Hoàn thành'}
                    </span>
                </div>
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                        <i data-lucide="package" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-800 text-sm">Đơn hàng #${order.id.slice(-4)}</h4>
                        <p class="text-[10px] text-slate-500 font-medium">${new Date(order.timestamp).toLocaleString('vi-VN')}</p>
                    </div>
                </div>
                <div class="space-y-1.5 mb-4">
                    ${order.items.map(item => `
                        <div class="flex justify-between text-xs">
                            <span class="text-slate-600">${item.qty}x ${item.name}</span>
                            <span class="font-bold text-slate-700">${(item.price * item.qty).toLocaleString()}đ</span>
                        </div>
                    `).join('')}
                </div>
                <div class="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span class="text-xs font-bold text-slate-400">TỔNG CỘNG</span>
                    <span class="text-base font-black text-indigo-600">${order.total.toLocaleString()}đ</span>
                </div>
            </div>
        `).join('');
        lucide.createIcons();
    }

    // --- LOGIC CHO ADMIN ---
    function renderAdminOrders() {
        const orders = JSON.parse(localStorage.getItem('serviceOrders')) || [];
        const orderListEl = document.getElementById('admin-order-list');
        if (!orderListEl) return;

        if (orders.length === 0) {
            orderListEl.innerHTML = `<div class="col-span-full bg-white border border-dashed border-slate-300 rounded-3xl p-16 text-center text-slate-400">Hiện không có yêu cầu nào</div>`;
            lucide.createIcons();
            return;
        }

        const sortedOrders = [...orders].sort((a, b) => {
            if (a.status === b.status) return new Date(b.timestamp) - new Date(a.timestamp);
            return a.status === 'pending' ? -1 : 1;
        });

        orderListEl.innerHTML = sortedOrders.map(order => `
            <div class="bg-white p-6 rounded-3xl border ${order.status === 'pending' ? 'border-indigo-200 ring-4 ring-indigo-50' : 'border-slate-200'} shadow-sm">
                <div class="flex justify-between items-start mb-6">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
                            ${order.roomNumber.replace('Phòng ','')}
                        </div>
                        <div>
                            <h3 class="font-bold text-slate-900 text-lg">${order.customerName}</h3>
                            <p class="text-xs text-slate-500">${new Date(order.timestamp).toLocaleString('vi-VN')}</p>
                        </div>
                    </div>
                    <span class="px-4 py-1.5 rounded-full text-xs font-bold ${order.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}">
                        ${order.status === 'pending' ? 'Đang chờ' : 'Đã xong'}
                    </span>
                </div>
                <div class="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    ${order.items.map(item => `
                        <div class="flex justify-between text-sm items-center">
                            <div class="flex items-center gap-2">
                                <span class="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded text-[10px] font-bold text-indigo-600">${item.qty}</span>
                                <span class="text-slate-700">${item.name}</span>
                            </div>
                            <span class="font-bold">${(item.price * item.qty).toLocaleString()}đ</span>
                        </div>
                    `).join('')}
                    <div class="border-t border-slate-200 pt-3 mt-3 flex justify-between font-black">
                        <span class="text-xs text-slate-400">TỔNG</span>
                        <span class="text-xl text-indigo-600">${order.total.toLocaleString()}đ</span>
                    </div>
                </div>
                ${order.status === 'pending' ? `
                    <button onclick="completeOrder('${order.id}')" class="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2">
                        <i data-lucide="check-circle" class="w-5 h-5"></i> Xác nhận phục vụ
                    </button>
                ` : ''}
            </div>
        `).join('');
        lucide.createIcons();
    }

    window.completeOrder = (orderId) => {
        let orders = JSON.parse(localStorage.getItem('serviceOrders')) || [];
        const order = orders.find(o => o.id === orderId);
        if (!order) return;
        order.status = 'completed';
        localStorage.setItem('serviceOrders', JSON.stringify(orders));

        let allRooms = JSON.parse(localStorage.getItem('motelRooms')) || [];
        const room = allRooms.find(r => r.id === order.roomId);
        if (room) {
            if (!room.servicesUsed) room.servicesUsed = [];
            if (!room.serviceTotal) room.serviceTotal = 0;
            order.items.forEach(item => room.servicesUsed.push({ name: item.name, price: item.price, qty: item.qty, timestamp: new Date().toISOString() }));
            room.serviceTotal += order.total;
            localStorage.setItem('motelRooms', JSON.stringify(allRooms));
        }
        renderAdminOrders();
    };

    document.getElementById('refresh-btn')?.addEventListener('click', renderAdminOrders);
});
