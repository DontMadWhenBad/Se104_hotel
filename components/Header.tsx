'use client';

import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⚙️</span>
          <span className={styles.logoText}>EZMotel</span>
        </div>
        
        <nav className={styles.nav}>
          <a href="#features">Tính năng</a>
          <a href="#pricing">Bảng giá</a>
          <a href="#testimonials">Đánh giá</a>
        </nav>

        <div className={styles.buttons}>
          <button className={styles.loginBtn}>Đăng nhập</button>
          <button className={styles.trialBtn}>Dùng thử miễn phí</button>
        </div>
      </div>
    </header>
  );
}
