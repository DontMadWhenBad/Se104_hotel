'use client'

import { useState } from 'react'
import Link from 'next/link'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="#" className="text-2xl font-bold text-primary">
              EZMotel
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-neutral hover:text-primary transition">
              Tính năng
            </Link>
            <Link href="#pricing" className="text-neutral hover:text-primary transition">
              Bảng giá
            </Link>
            <Link href="#testimonials" className="text-neutral hover:text-primary transition">
              Testimonials
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="px-4 py-2 text-primary hover:text-primary-dark transition">
              Đăng nhập
            </button>
            <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold">
              Dùng thử miễn phí
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg bg-secondary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="#features" className="block px-4 py-2 hover:bg-secondary rounded-lg">
              Tính năng
            </Link>
            <Link href="#pricing" className="block px-4 py-2 hover:bg-secondary rounded-lg">
              Bảng giá
            </Link>
            <Link href="#testimonials" className="block px-4 py-2 hover:bg-secondary rounded-lg">
              Testimonials
            </Link>
            <div className="space-y-2 pt-2">
              <button className="w-full px-4 py-2 text-primary hover:bg-primary-light rounded-lg transition">
                Đăng nhập
              </button>
              <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold">
                Dùng thử miễn phí
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
