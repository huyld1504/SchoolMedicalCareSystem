import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function MagnusNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Determine which section is currently in view
      const sections = [
        "home",
        "about",
        "services",
        "doctors",
        "testimonials",
        "contact",
      ];
      let currentSection = "home";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section;
            break;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest(".magnus-navbar")) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [mobileMenuOpen]);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop =
        element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-lg" : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {" "}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/src/assets/logo.svg"
                alt="School Medical System"
                className="h-10"
              />
            </Link>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">            <a
            href="#home"
            className={`nav-link ${activeSection === "home" ? "active" : ""}`}
          >
            Trang chủ
          </a>
            <a
              href="#about"
              className={`nav-link ${activeSection === "about" ? "active" : ""
                }`}
            >
              Về chúng tôi
            </a>
            <a
              href="#services"
              className={`nav-link ${activeSection === "services" ? "active" : ""
                }`}
            >
              Dịch vụ
            </a>
            <a
              href="#doctors"
              className={`nav-link ${activeSection === "doctors" ? "active" : ""
                }`}
            >
              Bác sĩ
            </a>
            <a
              href="#testimonials"
              className={`nav-link ${activeSection === "testimonials" ? "active" : ""
                }`}
            >
              Nhận xét
            </a>
            <a
              href="#contact"
              className={`nav-link ${activeSection === "contact" ? "active" : ""
                }`}
            >
              Liên hệ
            </a>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              Đăng nhập
            </Link>
          </div>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (<div className="md:hidden mt-4 pb-4">
          <a href="#home" className="block py-2 px-4 hover:bg-gray-100">
            Trang chủ
          </a>
          <a href="#about" className="block py-2 px-4 hover:bg-gray-100">
            Về chúng tôi
          </a>
          <a href="#services" className="block py-2 px-4 hover:bg-gray-100">
            Dịch vụ
          </a>
          <a href="#doctors" className="block py-2 px-4 hover:bg-gray-100">
            Bác sĩ
          </a>
          <a
            href="#testimonials"
            className="block py-2 px-4 hover:bg-gray-100"
          >
            Nhận xét
          </a>
          <a href="#contact" className="block py-2 px-4 hover:bg-gray-100">
            Liên hệ
          </a>
          <Link
            to="/login"
            className="block py-2 px-4 text-blue-600 hover:bg-gray-100"
          >
            Đăng nhập
          </Link>
        </div>
        )}
      </div>
    </nav>
  );
}

export default MagnusNavbar;
