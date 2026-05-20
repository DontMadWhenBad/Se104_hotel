'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-neutral-dark text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">EZMotel</h3>
            <p className="text-blue-100">
              Giải pháp quản lý nhà nghỉ toàn diện cho doanh thu tối ưu
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold mb-4">Sản Phẩm</h4>
            <ul className="space-y-2 text-blue-100">
              <li><Link href="#" className="hover:text-white transition">Tính Năng</Link></li>
              <li><Link href="#" className="hover:text-white transition">Bảng Giá</Link></li>
              <li><Link href="#" className="hover:text-white transition">Bảo Mật</Link></li>
              <li><Link href="#" className="hover:text-white transition">API</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4">Công Ty</h4>
            <ul className="space-y-2 text-blue-100">
              <li><Link href="#" className="hover:text-white transition">Về Chúng Tôi</Link></li>
              <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="#" className="hover:text-white transition">Việc Làm</Link></li>
              <li><Link href="#" className="hover:text-white transition">Liên Hệ</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-4">Hỗ Trợ</h4>
            <ul className="space-y-2 text-blue-100">
              <li><Link href="#" className="hover:text-white transition">Trung Tâm Trợ Giúp</Link></li>
              <li><Link href="#" className="hover:text-white transition">Tài Liệu</Link></li>
              <li><Link href="#" className="hover:text-white transition">Cộng Đồng</Link></li>
              <li><Link href="#" className="hover:text-white transition">Liên Hệ Hỗ Trợ</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-100 text-sm">
              © 2024 EZMotel. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-blue-100 hover:text-white transition text-sm">
                Chính Sách Bảo Mật
              </Link>
              <Link href="#" className="text-blue-100 hover:text-white transition text-sm">
                Điều Khoản Dịch Vụ
              </Link>
              <Link href="#" className="text-blue-100 hover:text-white transition text-sm">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
