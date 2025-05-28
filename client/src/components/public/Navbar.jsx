import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50 top-0">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="School Medical Care System"
              className="h-12"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300"
            >
              Trang Chủ
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300"
            >
              Giới Thiệu
            </Link>
            <Link
              to="/health-resources"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300"
            >
              Tài Liệu Sức Khỏe
            </Link>
            <Link
              to="/blog"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300"
            >
              Blog
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300"
            >
              Liên Hệ
            </Link>
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
            >
              Đăng Nhập
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="py-4 space-y-2">
              <Link
                to="/"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Trang Chủ
              </Link>
              <Link
                to="/about"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Giới Thiệu
              </Link>
              <Link
                to="/health-resources"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Tài Liệu Sức Khỏe
              </Link>
              <Link
                to="/blog"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/contact"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Liên Hệ
              </Link>
              <Link
                to="/login"
                className="block mx-4 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-center transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Đăng Nhập
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
