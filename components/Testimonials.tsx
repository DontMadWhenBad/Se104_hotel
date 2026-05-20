'use client';

import styles from './Testimonials.module.css';

const testimonials = [
  {
    name: 'Nguyễn Văn A',
    business: 'Nhà nghỉ Mặt Trời',
    rating: 5,
    text: 'EZMotel giúp tôi tiết kiệm 3 giờ mỗi ngày trong quản lý phòng. Doanh thu tăng 25% sau 3 tháng sử dụng!',
  },
  {
    name: 'Trần Thị B',
    business: 'Nhà nghỉ Hoa Anh Đào',
    rating: 5,
    text: 'Giao diện rất dễ dùng, nhân viên của tôi chỉ cần 1 ngày là đã sử dụng thành thạo. Tuyệt vời!',
  },
  {
    name: 'Lê Văn C',
    business: 'Nhà nghỉ Sao Vàng',
    rating: 5,
    text: 'Hỗ trợ khách hàng rất tuyệt vời. Mỗi khi gặp vấn đề, họ giải quyết rất nhanh và chuyên nghiệp.',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className={styles.testimonials}>
      <div className={styles.container}>
        <h2 className={styles.title}>Đánh Giá Từ Khách Hàng</h2>
        
        <div className={styles.grid}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.stars}>
                {'⭐'.repeat(testimonial.rating)}
              </div>
              <p className={styles.text}>"{testimonial.text}"</p>
              <div className={styles.author}>
                <p className={styles.name}>{testimonial.name}</p>
                <p className={styles.business}>{testimonial.business}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
