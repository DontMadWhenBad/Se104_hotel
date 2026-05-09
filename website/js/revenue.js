// Khởi tạo icon
lucide.createIcons();

/**
 * 1. VẼ BIỂU ĐỒ BẰNG CHART.JS
 */
let revenueChartInstance = null;

function updateChart(transactions, filterType = '7days') {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    
    let labels = [];
    let dailyRevenue = [];

    if (filterType === '7days') {
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            labels.push(d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }));
        }
        dailyRevenue = new Array(7).fill(0);
    } else if (filterType === 'thisMonth') {
        const today = new Date();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
            const d = new Date(today.getFullYear(), today.getMonth(), i);
            labels.push(d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }));
        }
        dailyRevenue = new Array(daysInMonth).fill(0);
    } else if (filterType === 'lastMonth') {
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const daysInLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0).getDate();
        for (let i = 1; i <= daysInLastMonth; i++) {
            const d = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), i);
            labels.push(d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }));
        }
        dailyRevenue = new Array(daysInLastMonth).fill(0);
    }

    // Tính tổng doanh thu theo từng ngày
    transactions.forEach(tr => {
        const trDate = new Date(tr.time).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        const index = labels.indexOf(trDate);
        if (index !== -1) {
            dailyRevenue[index] += tr.amount;
        }
    });

    // Cập nhật biểu đồ nếu đã tồn tại, hoặc tạo mới
    if (revenueChartInstance) {
        revenueChartInstance.data.labels = labels;
        revenueChartInstance.data.datasets[0].data = dailyRevenue;
        revenueChartInstance.update();
    } else {
        let gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(37, 99, 235, 0.2)');
        gradient.addColorStop(1, 'rgba(37, 99, 235, 0)');

        const data = {
            labels: labels,
            datasets: [{
                label: 'Doanh thu (VNĐ)',
                data: dailyRevenue,
                borderColor: '#2563eb',
                backgroundColor: gradient,
                borderWidth: 3,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#2563eb',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.4
            }]
        };

        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        padding: 12,
                        titleFont: { size: 14, family: "'Inter', sans-serif" },
                        bodyFont: { size: 14, family: "'Inter', sans-serif" },
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: '#f1f5f9', drawBorder: false },
                        ticks: {
                            color: '#64748b',
                            font: { family: "'Inter', sans-serif" },
                            callback: function(value) {
                                return value === 0 ? '0' : (value / 1000) + 'k'; 
                            }
                        }
                    },
                    x: {
                        grid: { display: false, drawBorder: false },
                        ticks: { color: '#64748b', font: { family: "'Inter', sans-serif" } }
                    }
                },
                interaction: { intersect: false, mode: 'index' }
            }
        };

        revenueChartInstance = new Chart(ctx, config);
    }
}

/**
 * 2. LẤY DỮ LIỆU TỪ LOCAL STORAGE VÀ TÍNH TOÁN
 */
function loadData() {
    // Lấy lịch sử giao dịch
    const savedTransactions = localStorage.getItem('revenueHistory');
    const transactions = savedTransactions ? JSON.parse(savedTransactions) : [];
    
    // Lấy thông tin phòng để tính tỷ lệ lấp đầy
    const savedRooms = localStorage.getItem('motelRooms');
    const rooms = savedRooms ? JSON.parse(savedRooms) : [];
    
    return { transactions, rooms };
}

function updateDashboard(selectedDateStr = null) {
    const { transactions: allTransactions, rooms } = loadData();
    
    let filteredTransactions = allTransactions;

    // Lọc giao dịch theo ngày được chọn
    if (selectedDateStr) {
        filteredTransactions = allTransactions.filter(tr => {
            const trDate = new Date(tr.time);
            const trDateStr = `${trDate.getFullYear()}-${String(trDate.getMonth()+1).padStart(2, '0')}-${String(trDate.getDate()).padStart(2, '0')}`;
            return trDateStr === selectedDateStr;
        });
    }

    // 1. Tính toán Thống kê
    let totalRevenue = 0;
    filteredTransactions.forEach(tr => totalRevenue += tr.amount);
    
    // Giả định: 80% là tiền phòng, 20% là tiền dịch vụ
    const roomRevenue = totalRevenue * 0.8;
    const serviceRevenue = totalRevenue * 0.2;
    
    // Tính tỷ lệ lấp đầy
    let occupiedCount = 0;
    rooms.forEach(room => {
        if(room.status === 'occupied') occupiedCount++;
    });
    const occupancyRate = rooms.length > 0 ? Math.round((occupiedCount / rooms.length) * 100) : 0;
    
    // Hàm format tiền
    const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    
    // 2. Cập nhật lên Giao diện (Các thẻ Stat Cards)
    document.getElementById('stat-total-revenue').textContent = formatMoney(totalRevenue);
    document.getElementById('stat-room-revenue').textContent = formatMoney(roomRevenue);
    document.getElementById('stat-service-revenue').textContent = formatMoney(serviceRevenue);
    document.getElementById('stat-occupancy-rate').textContent = `${occupancyRate}%`;
    document.getElementById('stat-occupancy-bar').style.width = `${occupancyRate}%`;
    
    // 3. Hiển thị Bảng giao dịch
    const tbody = document.getElementById('transaction-table-body');
    tbody.innerHTML = ''; // Xóa dữ liệu cũ
    
    if (filteredTransactions.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-8 text-center text-slate-500">Chưa có giao dịch nào trong ngày này.</td></tr>`;
    } else {
        // Chỉ lấy 10 giao dịch gần nhất
        const recentTransactions = filteredTransactions.slice(0, 10);
        
        recentTransactions.forEach(tr => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-slate-50/50 transition-colors cursor-pointer';
            
            const formattedAmount = formatMoney(tr.amount);
            const formattedDate = new Date(tr.time).toLocaleString('vi-VN', {
                hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
            });
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm font-semibold text-brand-600">${tr.id}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm font-medium text-slate-700">${tr.room}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-slate-900">${tr.customer || 'Khách vãng lai'}</div>
                    <div class="text-xs text-slate-500">${formattedDate}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm font-bold text-slate-800">${formattedAmount}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <i data-lucide="check-circle-2" class="w-3 h-3 mr-1"></i> ${tr.status}
                    </span>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Chạy lại Lucide icons
    lucide.createIcons();
    
    // Cập nhật biểu đồ với TẤT CẢ giao dịch (không bị ảnh hưởng bởi bộ lọc ngày đơn lẻ)
    const chartFilterValue = document.getElementById('chart-filter')?.value || '7days';
    updateChart(allTransactions, chartFilterValue);

    // Bắt sự kiện thay đổi bộ lọc biểu đồ
    const chartFilter = document.getElementById('chart-filter');
    if (chartFilter) {
        chartFilter.onchange = (e) => {
            updateChart(allTransactions, e.target.value);
        };
    }
}

// Khởi tạo ngày hiện tại cho DatePicker
const dateFilterInput = document.getElementById('date-filter');
if (dateFilterInput) {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    dateFilterInput.value = todayStr;

    // Lắng nghe sự kiện đổi ngày
    dateFilterInput.addEventListener('change', (e) => {
        updateDashboard(e.target.value);
    });
}

// Gọi hàm cập nhật khi tải trang, mặc định lấy ngày hôm nay
updateDashboard(dateFilterInput ? dateFilterInput.value : null);
