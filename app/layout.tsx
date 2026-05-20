import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EZMotel - Phần mềm quản lý nhà nghỉ',
  description: 'Quản lý nhà nghỉ toàn diện, tránh thất thoát 100%',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
