'use client';

import styles from './Pricing.module.css';

const plans = [
  {
    name: 'Starter',
    price: '99.000',
    period: '/tháng',
    description: 'Dành cho nhà nghỉ nhỏ',
    features: [
      'Quản lý tối đa 20 phòng',
      'Báo cáo cơ bản',
      'Hỗ trợ email',
      'Lưu trữ 1GB',
    ],
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '249.000',
    period: '/tháng',
    description: 'Dành cho nhà nghỉ vừa',
    features: [
      'Quản lý tối đa 50 phòng',
      'Báo cáo chi tiết',
      'Hỗ trợ 24/7',
      'Lưu trữ 10GB',
      'Tính năng nâng cao',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Liên hệ',
    period: 'để báo giá',
    description: 'Dành cho nhà nghỉ lớn',
    features: [
      'Quản lý không giới hạn phòng',
      'Báo cáo tùy chỉnh',
      'Hỗ trợ ưu tiên',
      'Lưu trữ không giới hạn',
      'Tích hợp API',
    ],
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className={styles.pricing}>
      <div className={styles.container}>
        <h2 className={styles.title}>Bảng Giá</h2>
        <p className={styles.subtitle}>
          Chọn gói phù hợp với nhu cầu của nhà nghỉ bạn
        </p>

        <div className={styles.grid}>
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`${styles.card} ${plan.highlighted ? styles.highlighted : ''}`}
            >
              {plan.highlighted && <div className={styles.badge}>Phổ biến nhất</div>}
              <h3 className={styles.planName}>{plan.name}</h3>
              <p className={styles.description}>{plan.description}</p>
              <div className={styles.priceSection}>
                <span className={styles.price}>{plan.price}</span>
                <span className={styles.period}>{plan.period}</span>
              </div>
              <button className={`${styles.btn} ${plan.highlighted ? styles.btnPrimary : styles.btnSecondary}`}>
                {plan.highlighted ? 'Bắt Đầu Ngay' : 'Chọn Gói'}
              </button>
              <div className={styles.features}>
                {plan.features.map((feature, idx) => (
                  <div key={idx} className={styles.feature}>
                    <span className={styles.check}>✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
