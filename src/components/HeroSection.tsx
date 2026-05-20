'use client'

import Image from 'next/image'

export function HeroSection() {
  return (
    <section className="pt-32 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-light to-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-dark leading-tight">
              Quản Lý Nhà Nghỉ Toàn Diện,{' '}
              <span className="text-primary">Tránh Thất Thoát 100%</span>
            </h1>

            <p className="text-lg text-neutral leading-relaxed">
              Giải pháp quản lý nhà nghỉ thông minh giúp bạn kiểm soát toàn bộ hoạt động, từ quản lý phòng, tính tiền tự động đến báo cáo doanh thu.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-bold text-lg shadow-lg hover:shadow-xl">
                Trải Nghiệm Miễn Phí Ngay
              </button>
              <button className="px-8 py-4 border-2 border-primary text-primary rounded-lg hover:bg-primary-light transition font-bold text-lg">
                Xem Demo
              </button>
            </div>

            {/* Trust Badge */}
            <div className="pt-4 flex items-center space-x-4 text-sm text-neutral">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Không cần cài đặt phức tạp</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/dashboard-mockup.jpg"
                alt="EZMotel Dashboard"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 w-48">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <span className="font-bold text-neutral-dark">Dễ sử dụng</span>
              </div>
              <p className="text-sm text-neutral">Giao diện thân thiện với mọi người</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
