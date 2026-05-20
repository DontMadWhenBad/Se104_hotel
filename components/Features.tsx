'use client';

import styles from './Features.module.css';

const features = [
  {
    icon: '📊',
    title: 'Quản lý trạng thái phòng trực quan',
    description: '(Trống, Đang ở, Chưa dọn)',
  },
  {
    icon: '💰',
    title: 'Tính tiền giờ, tiền đêm tự động',
    description: 'Chính xác và không sai sót',
  },
  {
    icon: '📱',
    title: 'Báo cáo doanh thu từ xa',
    description: 'Qua điện thoại, bất cứ lúc nào',
  },
];

export default function Features() {
  return (
    <section id="features" className={styles.features}>
      <div className={styles.container}>
        <h2 className={styles.title}>Tính Năng Chính</h2>
        <p className={styles.subtitle}>
          EZMotel cung cấp tất cả những gì bạn cần để quản lý nhà nghỉ hiệu quả
        </p>

        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.icon}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
