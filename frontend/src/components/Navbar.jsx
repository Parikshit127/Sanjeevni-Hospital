import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { FaBars, FaTimes, FaPhoneAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';
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
    navigate('/');
    setMenuOpen(false);
  };

  const openLoginModal = () => {
    setLoginModalOpen(true);
    setMenuOpen(false);
  };

  const navLink = `text-[#2d3f4e] font-medium hover:text-[#67c0b3] transition duration-300 ease-in-out`;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
          scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Sanjivani Logo" className="w-8 h-8 rounded-full transition-all duration-300 ease-in-out" />
            <div>
              <h1 className="text-base font-bold text-[#2d3f4e]">Sanjivani Hospital</h1>
              <p className="text-xs text-gray-500">Orthopedic Excellence in Jhajjar</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="space-x-6 hidden md:flex items-center">
            <a href="/#about" className={navLink}>About</a>
            <a href="/#services" className={navLink}>Services</a>
            <Link to="/doctors" className={navLink}>Doctors</Link>
            <a href="/#reviews" className={navLink}>Reviews</a>
            <a href="/#contact" className={navLink}>Contact</a>
            
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Link
                    to="/admin"
                    className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-3 py-1.5 rounded-md text-sm transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/my-appointments"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-1.5 rounded-md text-sm transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    My Appointments
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1.5 rounded-md flex items-center gap-2 text-sm transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </>
            ) : (
              <button
                onClick={openLoginModal}
                className="bg-[#67c0b3] hover:bg-[#5ab0a3] text-white font-semibold px-4 py-1.5 rounded-md flex items-center gap-2 text-sm transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <FaUser /> Login
              </button>
            )}
            
            <a
              href="tel:+918950466995"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1.5 rounded-md flex items-center gap-2 transition-all duration-300 ease-in-out transform hover:scale-105 text-sm"
            >
              <FaPhoneAlt className="text-xs" /> Call Us
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-[#2d3f4e] text-xl"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <FaTimes className="rotate-90 transition-transform duration-300 ease-in-out" /> : <FaBars className="rotate-0 transition-transform duration-300 ease-in-out" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden bg-white px-6 py-3 transition-all duration-500 ease-in-out transform ${
            menuOpen ? 'max-h-screen opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4'
          }`}
        >
          <div className="flex flex-col space-y-3">
            <a onClick={toggleMenu} href="/#about" className={navLink}>About</a>
            <a onClick={toggleMenu} href="/#services" className={navLink}>Services</a>
            <Link onClick={toggleMenu} to="/doctors" className={navLink}>Doctors</Link>
            <a onClick={toggleMenu} href="/#reviews" className={navLink}>Reviews</a>
            <a onClick={toggleMenu} href="/#contact" className={navLink}>Contact</a>
            
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Link
                    onClick={toggleMenu}
                    to="/admin"
                    className="bg-purple-500 text-white px-3 py-1.5 rounded-md text-center text-sm"
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    onClick={toggleMenu}
                    to="/my-appointments"
                    className="bg-blue-500 text-white px-3 py-1.5 rounded-md text-center text-sm"
                  >
                    My Appointments
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-1.5 rounded-md text-center text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={openLoginModal}
                className="bg-[#67c0b3] text-white px-3 py-1.5 rounded-md text-center text-sm"
              >
                Login / Sign Up
              </button>
            )}
            
            <a
              href="tel:+918950466995"
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1.5 rounded-md text-center text-sm transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              📞 Call Us
            </a>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
}