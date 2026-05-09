# BÁO CÁO ĐỒ ÁN: HỆ THỐNG QUẢN LÝ NHÀ NGHỈ (MOTEL MANAGEMENT SYSTEM)

## 1. GIỚI THIỆU CHUNG
Hệ thống Quản lý Nhà nghỉ là một ứng dụng web hiện đại giúp tối ưu hóa quy trình vận hành nhà nghỉ, từ quản lý phòng, dịch vụ đến quản lý khách hàng và doanh thu. Website được thiết kế với giao diện cao cấp, trải nghiệm người dùng mượt mà và hỗ trợ phân quyền rạch ròi giữa Quản trị viên và Khách hàng.

---

## 2. CÁC TÍNH NĂNG CHÍNH ĐÃ HOÀN THÀNH

### A. Quản lý Sơ đồ Phòng (Dashboard)
- **Sơ đồ trực quan:** Hiển thị danh sách phòng dưới dạng thẻ với màu sắc phân biệt trạng thái:
  - **Xanh lá:** Phòng trống.
  - **Đỏ:** Phòng có khách.
  - **Vàng:** Phòng đang dọn dẹp.
  - **Cam:** Phòng đang chờ duyệt yêu cầu đặt.
  - **Tím:** Phòng đang chờ thanh toán (Checkout).
- **Cập nhật nhanh:** Admin có thể thay đổi trạng thái, tên khách, số CCCD ngay trên sơ đồ.

### B. Hệ thống Giá Kép (Nightly & Hourly)
- **Thiết lập linh hoạt:** Admin có thể đặt đồng thời hai loại giá cho mỗi phòng: **Giá theo đêm** và **Giá theo giờ**.
- **Tính tiền tự động:** Hệ thống tự động tính toán tổng tiền dựa trên thời gian thực tế của khách hàng khi trả phòng.

### C. Quy trình Đặt phòng Chuyên nghiệp (Dành cho Khách hàng)
- **Trang chi tiết phòng:** Khách hàng xem được ảnh, mô tả, tiện nghi và vị trí phòng.
- **Lên lịch thông minh:** Khách hàng chọn ngày nhận/trả phòng và hình thức thuê (Đêm/Giờ). Hệ thống tự động báo tổng tiền dự kiến trước khi đặt.
- **Yêu cầu đặt phòng:** Gửi yêu cầu đến Admin để phê duyệt trước khi chính thức nhận phòng.

### D. Quản lý Dịch vụ & Đặt món (Service System)
- **Danh mục dịch vụ:** Admin quản lý thực đơn (món ăn, đồ uống, dịch vụ khác) kèm giá tiền.
- **Khách hàng tự đặt món:** Khách hàng có thể mở menu, chọn món và chọn số phòng muốn phục vụ (nếu thuê nhiều phòng).
- **Xử lý đơn hàng:** Admin nhận thông báo đơn hàng theo thời gian thực và xử lý cho khách.

### E. Quản lý Khách hàng & Bảo mật (Privacy)
- **Danh sách khách:** Admin quản lý toàn bộ hồ sơ khách lưu trú.
- **Bảo mật thông tin:** Số điện thoại và CCCD của khách được mã hóa một phần (ví dụ: `091****678`) để chống nhìn trộm.
- **Vùng an toàn cho khách:** Khách hàng chỉ nhìn thấy thông tin lưu trú của chính mình, không thấy dữ liệu của khách khác.

### F. Quản lý Doanh thu (Revenue)
- **Lịch sử giao dịch:** Lưu lại toàn bộ hóa đơn đã thanh toán.
- **Thống kê:** Tính toán tổng doanh thu từ tiền phòng và tiền dịch vụ.

---

## 3. CÔNG NGHỆ SỬ DỤNG
- **Frontend:** HTML5, Vanilla CSS (Custom properties & Flexbox/Grid).
- **Logic xử lý:** JavaScript ES6+ (Thuần).
- **Iconography:** Lucide Icons (Thư viện icon hiện đại).
- **Cơ sở dữ liệu:** LocalStorage (Lưu trữ dữ liệu trực tiếp trên trình duyệt, không mất dữ liệu khi tải lại trang).

---

## 4. HƯỚNG DẪN TRUY CẬP VÀ SỬ DỤNG

### Bước 1: Khởi động Website
- Truy cập vào tệp `login.html` bằng trình duyệt (Chrome, Edge, v.v.).

### Bước 2: Đăng nhập
1. **Tài khoản Quản trị viên (Admin):**
   - **Tài khoản:** `admin`
   - **Mật khẩu:** `123456`
   - *Quyền hạn:* Toàn quyền quản lý phòng, duyệt yêu cầu, xem doanh thu, chỉnh sửa dịch vụ.

2. **Tài khoản Khách hàng (Customer):**
   - Bạn có thể đăng ký tài khoản mới tại `register.html`.
   - *Quyền hạn:* Đặt phòng, xem thông tin cá nhân, đặt dịch vụ phòng.

### Bước 3: Các thao tác cơ bản
- **Để Đặt phòng (Khách):** Vào Sơ đồ phòng -> Chọn phòng trống -> Chọn ngày & hình thức thuê -> Gửi yêu cầu.
- **Để Duyệt phòng (Admin):** Bấm vào phòng có màu Cam (Chờ duyệt) -> Kiểm tra thông tin -> Nhấn Duyệt.
- **Để Đặt dịch vụ:** Vào trang "Dịch vụ phòng" -> Nhấn "Đặt dịch vụ ngay" -> Chọn món và chọn phòng nhận đồ.
- **Để Trả phòng (Admin):** Bấm vào phòng đang ở -> Nhấn "Trả phòng" -> Hệ thống sẽ tính tiền và xuất hóa đơn.

---

*Báo cáo được tạo tự động bởi Hệ thống Quản lý Nhà nghỉ v1.0*
