'use client';

import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h4>EZMotel</h4>
            <p>Phần mềm quản lý nhà nghỉ hàng đầu Việt Nam</p>
          </div>

          <div className={styles.section}>
            <h4>Sản Phẩm</h4>
            <ul>
              <li><a href="#features">Tính Năng</a></li>
              <li><a href="#pricing">Bảng Giá</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4>Công Ty</h4>
            <ul>
              <li><a href="#">Về Chúng Tôi</a></li>
              <li><a href="#">Liên Hệ</a></li>
              <li><a href="#">Điều Khoản</a></li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4>Liên Hệ</h4>
            <ul>
              <li>Email: <a href="mailto:hello@ezmotel.vn">hello@ezmotel.vn</a></li>
              <li>Phone: <a href="tel:+842838292929">+84 283 829 2929</a></li>
              <li>Địa chỉ: TP. Hồ Chí Minh</li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; 2024 EZMotel. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
