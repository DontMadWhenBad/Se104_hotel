'use client';

import styles from './CTA.module.css';

export default function CTA() {
  return (
    <section className={styles.cta}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>
            Sẵn sàng tối ưu doanh thu cho nhà nghỉ của bạn?
          </h2>
          <p className={styles.subtitle}>
            Hơn 500 nhà nghỉ đã tin tưởng EZMotel. Đây là lúc cho bạn!
          </p>
          <button className={styles.btn}>Đăng Ký Ngay →</button>
        </div>
      </div>
    </section>
  );
}
