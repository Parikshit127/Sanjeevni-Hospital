import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { FaBars, FaTimes, FaPhoneAlt, FaUser, FaSignOutAlt, FaCalendarAlt, FaUserMd, FaShieldAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import LoginModal from './LoginModal';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/', { replace: true });
  };

  const openLoginModal = () => {
    setLoginModalOpen(true);
    setMenuOpen(false);
  };

  const navLink = `text-gray-700 font-medium hover:text-teal-600 transition-all duration-300 relative group`;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' 
            : 'bg-white/80 backdrop-blur-sm py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></div>
              <img 
                src={logo} 
                alt="Sanjivani Logo" 
                className="w-10 h-10 rounded-full transition-transform duration-300 group-hover:scale-110 relative z-10" 
              />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Sanjivani Hospital
              </h1>
              <p className="text-xs text-gray-500 font-medium">Orthopedic Excellence</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8">
            <a href="/#about" className={navLink}>
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="/#services" className={navLink}>
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <Link to="/doctors" className={navLink}>
              Doctors
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <a href="/#reviews" className={navLink}>
              Reviews
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="/#contact" className={navLink}>
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
            </a>
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Link
                    to="/admin"
                    className="group flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    <FaShieldAlt className="group-hover:rotate-12 transition-transform" />
                    <span>Admin</span>
                  </Link>
                ) : user.role === 'doctor' ? (
                  <Link
                    to="/doctor-dashboard"
                    className="group flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    <FaUserMd className="group-hover:scale-110 transition-transform" />
                    <span>Dashboard</span>
                  </Link>
                ) : (
                  <Link
                    to="/my-appointments"
                    className="group flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    <FaCalendarAlt className="group-hover:scale-110 transition-transform" />
                    <span>My Appointments</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="group flex items-center gap-2 bg-white border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105"
                >
                  <FaSignOutAlt className="group-hover:rotate-12 transition-transform" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={openLoginModal}
                className="group flex items-center gap-2 bg-white border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105"
              >
                <FaUser className="group-hover:scale-110 transition-transform" />
                <span>Login</span>
              </button>
            )}

            <a
              href="tel:+918950466995"
              className="group flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold px-5 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm"
            >
              <FaPhoneAlt className="text-xs animate-pulse group-hover:animate-none" />
              <span>Call Us</span>
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={toggleMenu}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700 transition-all duration-300"
            aria-label="Toggle Menu"
          >
            {menuOpen ? (
              <FaTimes className="text-xl transition-transform duration-300 rotate-90" />
            ) : (
              <FaBars className="text-xl transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden bg-white border-t border-gray-100 transition-all duration-500 overflow-hidden ${
            menuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
            {/* Mobile Navigation Links */}
            <div className="space-y-3 pb-4 border-b border-gray-100">
              <a 
                onClick={toggleMenu} 
                href="/#about" 
                className="block text-gray-700 hover:text-teal-600 font-medium py-2 transition-colors"
              >
                About
              </a>
              <a 
                onClick={toggleMenu} 
                href="/#services" 
                className="block text-gray-700 hover:text-teal-600 font-medium py-2 transition-colors"
              >
                Services
              </a>
              <Link 
                onClick={toggleMenu} 
                to="/doctors" 
                className="block text-gray-700 hover:text-teal-600 font-medium py-2 transition-colors"
              >
                Doctors
              </Link>
              <a 
                onClick={toggleMenu} 
                href="/#reviews" 
                className="block text-gray-700 hover:text-teal-600 font-medium py-2 transition-colors"
              >
                Reviews
              </a>
              <a 
                onClick={toggleMenu} 
                href="/#contact" 
                className="block text-gray-700 hover:text-teal-600 font-medium py-2 transition-colors"
              >
                Contact
              </a>
            </div>

            {/* Mobile Action Buttons */}
            <div className="space-y-3">
              {user ? (
                <>
                  {user.role === 'admin' ? (
                    <Link
                      onClick={toggleMenu}
                      to="/admin"
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-3 rounded-lg text-sm font-semibold shadow-md"
                    >
                      <FaShieldAlt />
                      <span>Admin Dashboard</span>
                    </Link>
                  ) : user.role === 'doctor' ? (
                    <Link
                      onClick={toggleMenu}
                      to="/doctor-dashboard"
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-4 py-3 rounded-lg text-sm font-semibold shadow-md"
                    >
                      <FaUserMd />
                      <span>Doctor Dashboard</span>
                    </Link>
                  ) : (
                    <Link
                      onClick={toggleMenu}
                      to="/my-appointments"
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg text-sm font-semibold shadow-md"
                    >
                      <FaCalendarAlt />
                      <span>My Appointments</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-white border-2 border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm font-semibold"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={openLoginModal}
                  className="w-full flex items-center justify-center gap-2 bg-white border-2 border-teal-600 text-teal-600 px-4 py-3 rounded-lg text-sm font-semibold"
                >
                  <FaUser />
                  <span>Login / Sign Up</span>
                </button>
              )}

              <a
                href="tel:+918950466995"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold px-4 py-3 rounded-lg text-sm shadow-lg"
              >
                <FaPhoneAlt className="animate-pulse" />
                <span>Call Us Now</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
}