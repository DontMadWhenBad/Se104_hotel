'use client'

export function FeaturesSection() {
  const features = [
    {
      icon: '📊',
      title: 'Quản Lý Trạng Thái Phòng Trực Quan',
      description: 'Xem rõ ràng tình trạng của từng phòng (Trống, Đang ở, Chưa dọn) với giao diện hiển thị theo thời gian thực.',
    },
    {
      icon: '💰',
      title: 'Tính Tiền Giờ, Tiền Đêm Tự Động',
      description: 'Hệ thống tính tiền chính xác 100%, tự động áp dụng các mức giá khác nhau theo giờ, ngày và đặc biệt ngày lễ.',
    },
    {
      icon: '📈',
      title: 'Báo Cáo Doanh Thu Từ Xa',
      description: 'Theo dõi doanh thu, lợi nhuận và các chỉ số kinh doanh quan trọng qua điện thoại, bất cứ lúc nào, bất cứ nơi đâu.',
    },
  ]

  return (
    <section id="features" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-neutral-light">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-dark mb-4">
            Tính Năng Chính
          </h2>
          <p className="text-lg text-neutral max-w-2xl mx-auto">
            Mọi công cụ bạn cần để quản lý nhà nghỉ hiệu quả và tối ưu hóa doanh thu
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition group"
            >
              {/* Icon */}
              <div className="text-5xl mb-4 group-hover:scale-110 transition">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-neutral-dark mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-neutral leading-relaxed">
                {feature.description}
              </p>

              {/* Accent Line */}
              <div className="mt-6 h-1 w-12 bg-primary rounded-full group-hover:w-full transition"></div>
            </div>
          ))}
        </div>

        {/* Additional Benefits */}
        <div className="mt-16 bg-primary-light rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <p className="text-neutral">Độ chính xác tính tiền</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <p className="text-neutral">Hỗ trợ khách hàng</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">5 phút</div>
              <p className="text-neutral">Thiết lập ban đầu</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
