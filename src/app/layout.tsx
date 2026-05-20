import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EZMotel - Phần Mềm Quản Lý Nhà Nghỉ',
  description: 'Quản lý nhà nghỉ toàn diện, tránh thất thoát 100%. Tính tiền tự động, báo cáo doanh thu từ xa.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className="bg-neutral-light text-neutral-dark antialiased">
        {children}
      </body>
    </html>
  )
}
