'use client';

import Image from 'next/image';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Quản Lý Nhà Nghỉ Toàn Diện, Tránh Thất Thoát 100%
          </h1>
          <p className={styles.subtitle}>
            EZMotel giúp bạn quản lý phòng, tính tiền, và theo dõi doanh thu một cách tự động và chính xác. Tiết kiệm thời gian, tăng lợi nhuận.
          </p>
          <button className={styles.cta}>Trải Nghiệm Miễn Phí Ngay →</button>
        </div>

        <div className={styles.image}>
          <Image
            src="/dashboard-mockup.jpg"
            alt="EZMotel Dashboard"
            width={600}
            height={500}
            priority
            style={{ borderRadius: '12px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}
          />
        </div>
      </div>
    </section>
  );
}
