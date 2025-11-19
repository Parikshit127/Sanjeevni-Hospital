import React from 'react';
import { FaWhatsapp, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import logo from '../assets/logo.png'; // Ensure correct path
import map from '../assets/map.png'; // Ensure correct path

export default function Footer() {
  return (
    <footer className="bg-[#2d3f4e] text-white py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
        {/* Logo & Name */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <img
            src={logo}
            alt="Sanjivani Hospital Logo"
            className="w-24 h-24 rounded-full object-cover mb-3 shadow-md"
          />
          <h3 className="text-xl font-semibold">Sanjivani Hospital</h3>
          <p className="text-sm text-gray-300">Expert Orthopedic Care in Jhajjar</p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-3 items-center md:items-start">
          <div className="flex items-center gap-2">
            <FaPhoneAlt className="text-[#67c0b3]" />
            <a href="tel:+918950466995" className="hover:underline">
              +91 89504 66995
            </a>
          </div>
          <div className="flex items-center gap-2">
            <FaWhatsapp className="text-[#67c0b3]" />
            <a
              href="https://wa.me/918950466995"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Chat on WhatsApp
            </a>
          </div>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-[#67c0b3]" />
            <a
              href="https://www.google.com/maps/@28.610753,76.6450987,17z?entry=ttu&g_ep=EgoyMDI1MDcwOS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Rishi Colony, Dadri Road, Jhajjar
            </a>
          </div>
        </div>

        {/* Map Preview */}
        <div className="flex justify-center md:justify-end">
          <a
            href="https://www.google.com/maps/@28.610753,76.6450987,17z?entry=ttu&g_ep=EgoyMDI1MDcwOS4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={map} // Static dummy preview or custom map preview image
              alt="Google Maps Location"
              className="rounded-lg shadow-md border-2 border-white hover:scale-105 transition w-[300px] h-[200px] object-cover"
            />
          </a>
        </div>
      </div>

      <p className="text-center text-xs mt-10 text-gray-400">
        © {new Date().getFullYear()} Sanjivani Hospital | All rights reserved
      </p>
    </footer>
  );
}
