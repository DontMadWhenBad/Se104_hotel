'use client'

export function CTASection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-primary">
      <div className="max-w-4xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          Sẵn Sàng Tối Ưu Hóa Doanh Thu Cho Nhà Nghỉ Của Bạn?
        </h2>

        {/* Subheading */}
        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
          Hãy bắt đầu ngay hôm nay. Không cần thẻ tín dụng. Dùng thử hoàn toàn miễn phí trong 30 ngày.
        </p>

        {/* CTA Button */}
        <button className="px-10 py-4 bg-white text-primary rounded-lg hover:bg-blue-50 transition font-bold text-lg shadow-xl hover:shadow-2xl inline-block">
          Đăng Ký Ngay
        </button>

        {/* Trust Badge */}
        <div className="mt-8 flex justify-center items-center space-x-4 text-blue-100">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Được tin tưởng bởi hơn 5000+ nhà quản lý nhà nghỉ</span>
        </div>
      </div>
    </section>
  )
}
