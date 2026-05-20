'use client';

import styles from './Benefits.module.css';

const benefits = [
  {
    icon: '⚡',
    title: 'Dễ Sử Dụng',
    description: 'Giao diện trực quan, không cần đào tạo phức tạp',
  },
  {
    icon: '🔒',
    title: 'An Toàn Dữ Liệu',
    description: 'Mã hóa end-to-end, sao lưu tự động',
  },
  {
    icon: '🕐',
    title: 'Hỗ Trợ 24/7',
    description: 'Đội ngũ chuyên viên sẵn sàng giúp bạn',
  },
];

export default function Benefits() {
  return (
    <section className={styles.benefits}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {benefits.map((benefit, index) => (
            <div key={index} className={styles.item}>
              <div className={styles.icon}>{benefit.icon}</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
