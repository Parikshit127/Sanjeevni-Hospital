import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaPhoneAlt, FaMapMarkerAlt, FaClock, FaHeart, FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import logo from '../assets/logo.png';
import map from '../assets/map.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'About Us', href: '/#about' },
    { label: 'Services', href: '/#services' },
    { label: 'Doctors', href: '/doctors' },
    { label: 'Reviews', href: '/#reviews' },
    { label: 'Contact', href: '/#contact' }
  ];

  const services = [
    'Joint Replacement',
    'Fracture Treatment',
    'Arthroscopy',
    'Trauma Care',
    'Bone Health'
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, href: '#', label: 'Facebook' },
    { icon: <FaInstagram />, href: '#', label: 'Instagram' },
    { icon: <FaLinkedinIn />, href: '#', label: 'LinkedIn' },
    { icon: <FaTwitter />, href: '#', label: 'Twitter' }
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Logo & About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full opacity-20 blur-md"></div>
                <img
                  src={logo}
                  alt="Sanjivani Hospital Logo"
                  className="w-16 h-16 rounded-full object-cover shadow-lg relative z-10"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">Sanjivani Hospital</h3>
                <p className="text-sm text-gray-400">Orthopedic Excellence</p>
              </div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              Providing expert orthopedic care in Jhajjar with 25+ years of experience. Your trusted partner for joint health and mobility.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-white/10 hover:bg-gradient-to-r hover:from-teal-500 hover:to-cyan-500 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <h4 className="text-lg font-bold text-white relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500"></span>
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-teal-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full group-hover:scale-150 transition-transform"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h4 className="text-lg font-bold text-white relative inline-block">
              Our Services
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500"></span>
            </h4>
            <ul className="space-y-3">
              {services.map((service, idx) => (
                <li key={idx}>
                  <a
                    href="/#services"
                    className="text-gray-400 hover:text-teal-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full group-hover:scale-150 transition-transform"></span>
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Contact & Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <h4 className="text-lg font-bold text-white relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500"></span>
            </h4>
            <div className="space-y-4">
              {/* Phone */}
              <a
                href="tel:+918950466995"
                className="flex items-start gap-3 text-gray-400 hover:text-teal-400 transition-colors duration-300 group"
              >
                <div className="w-10 h-10 bg-white/10 group-hover:bg-teal-500/20 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                  <FaPhoneAlt className="text-teal-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Phone</p>
                  <p className="text-sm">+91 89504 66995</p>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/918950466995"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-gray-400 hover:text-teal-400 transition-colors duration-300 group"
              >
                <div className="w-10 h-10 bg-white/10 group-hover:bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                  <FaWhatsapp className="text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">WhatsApp</p>
                  <p className="text-sm">Chat with us</p>
                </div>
              </a>

              {/* Location */}
              <a
                href="https://www.google.com/maps/@28.610753,76.6450987,17z?entry=ttu&g_ep=EgoyMDI1MDcwOS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-gray-400 hover:text-teal-400 transition-colors duration-300 group"
              >
                <div className="w-10 h-10 bg-white/10 group-hover:bg-teal-500/20 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                  <FaMapMarkerAlt className="text-teal-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Location</p>
                  <p className="text-sm">Rishi Colony, Dadri Road, Jhajjar</p>
                </div>
              </a>

              {/* Hours */}
              <div className="flex items-start gap-3 text-gray-400">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaClock className="text-teal-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Hours</p>
                  <p className="text-sm">Mon-Sat: 10 AM - 10 PM</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pb-12 border-t border-white/10 pt-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h4 className="text-2xl font-bold">Visit Our Hospital</h4>
              <p className="text-gray-400 text-sm">
                We're conveniently located in Jhajjar, Haryana. Click on the map to get directions.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.google.com/maps/@28.610753,76.6450987,17z?entry=ttu&g_ep=EgoyMDI1MDcwOS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm"
                >
                  <FaMapMarkerAlt />
                  <span>Get Directions</span>
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 text-sm"
                >
                  <FaPhoneAlt />
                  <span>Contact Us</span>
                </a>
              </div>
            </div>
            <a
              href="https://www.google.com/maps/@28.610753,76.6450987,17z?entry=ttu&g_ep=EgoyMDI1MDcwOS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
              <img
                src={map}
                alt="Google Maps Location"
                className="w-full h-64 object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                  <p className="text-slate-800 font-semibold text-sm flex items-center gap-2">
                    <FaMapMarkerAlt className="text-teal-600" />
                    Open in Maps
                  </p>
                </div>
              </div>
            </a>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Sanjivani Hospital. All rights reserved.
            </p>
            
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Made with</span>
              <FaHeart className="text-red-500 animate-pulse" />
              <span>for better healthcare</span>
            </div>

            <div className="flex gap-6 text-sm">
              <button className="text-gray-400 hover:text-teal-400 transition-colors cursor-pointer">
                Privacy Policy
              </button>
              <button className="text-gray-400 hover:text-teal-400 transition-colors cursor-pointer">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}