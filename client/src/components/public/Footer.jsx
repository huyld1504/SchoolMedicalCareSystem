import React from 'react';
import { Link } from 'react-router-dom';
import logoWhite from '../../assets/logo-white.svg';

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2 pt-4">
            <div className="flex items-center mb-8">
              <img
                src={logoWhite}
                alt="School Medical Care System"
                className="h-16 w-auto drop-shadow-lg"
              />
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Hệ thống chăm sóc y tế học đường hiện đại, đảm bảo sức khỏe toàn diện
              cho học sinh với đội ngũ y tế chuyên nghiệp và trang thiết bị tiên tiến.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-300">123 Đường ABC, Quận 1, TP.HCM</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <span className="text-gray-300">(028) 3825 1234</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <span className="text-gray-300">info@schoolmedical.edu.vn</span>
              </div>
            </div>
          </div>          {/* Quick Links */}
          <div className="pt-4">
            <h3 className="text-xl font-bold mb-6 text-white border-b-2 border-blue-600 pb-2 inline-block">
              Liên Kết Nhanh
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-blue-400 transition duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 group-hover:bg-blue-400 transition duration-300"></span>
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-blue-400 transition duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 group-hover:bg-blue-400 transition duration-300"></span>
                  Giới Thiệu
                </Link>
              </li>
              <li>
                <Link
                  to="/health-resources"
                  className="text-gray-300 hover:text-blue-400 transition duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 group-hover:bg-blue-400 transition duration-300"></span>
                  Tài Liệu Sức Khỏe
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-300 hover:text-blue-400 transition duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 group-hover:bg-blue-400 transition duration-300"></span>
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-blue-400 transition duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 group-hover:bg-blue-400 transition duration-300"></span>
                  Liên Hệ
                </Link>
              </li>
            </ul>
          </div>          {/* Services */}
          <div className="pt-4">
            <h3 className="text-xl font-bold mb-6 text-white border-b-2 border-blue-600 pb-2 inline-block">
              Dịch Vụ Y Tế
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-300">Khám Sức Khỏe Định Kỳ</span>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-300">Quản Lý Thuốc</span>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-300">Tiêm Chủng</span>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-300">Cấp Cứu Y Tế</span>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-300">Tư Vấn Sức Khỏe</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 School Medical Care System. Tất cả quyền được bảo lưu.
            </div>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition duration-300 group"
              >
                <span className="sr-only">Facebook</span>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-red-600 rounded-full flex items-center justify-center transition duration-300 group"
              >
                <span className="sr-only">YouTube</span>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 5.523 4.477 10 10 10s10-4.477 10-10zM7.5 14.5V5.5L14.5 10l-7 4.5z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-green-600 rounded-full flex items-center justify-center transition duration-300 group"
              >
                <span className="sr-only">Email</span>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-pink-600 rounded-full flex items-center justify-center transition duration-300 group"
              >
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0a10 10 0 100 20 10 10 0 000-20zM8.5 6A1.5 1.5 0 0110 4.5 1.5 1.5 0 0111.5 6A1.5 1.5 0 0110 7.5 1.5 1.5 0 018.5 6zM6 10a4 4 0 118 0 4 4 0 01-8 0z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
