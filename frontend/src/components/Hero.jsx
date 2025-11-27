import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, animate, useInView, useMotionValue } from 'framer-motion';
import { FaCalendarAlt, FaPhone, FaAward, FaHospital, FaUserMd, FaCheckCircle } from 'react-icons/fa';
import heroImage from '../assets/hos.jpg';
import AvailableDoctors from './AvailableDoctors';

// Counter Component
function AnimatedCounter({ to, duration = 2 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, to, {
        duration,
        ease: 'easeOut',
      });

      const unsubscribe = motionValue.on("change", (latest) => {
        setCurrentValue(Math.floor(latest));
      });

      return () => {
        controls.stop();
        unsubscribe();
      };
    }
  }, [isInView, motionValue, to, duration]);

  return <span ref={ref}>{currentValue.toLocaleString()}</span>;
}

export default function Hero() {
  const stats = [
    { label: 'Years of Excellence', value: 25, suffix: '+', icon: <FaAward /> },
    { label: 'Surgeries Performed', value: 10000, suffix: '+', icon: <FaHospital /> },
    { label: 'Happy Patients', value: 30000, suffix: '+', icon: <FaUserMd /> },
    { label: 'Success Rate', value: 98, suffix: '%', icon: <FaCheckCircle /> },
  ];

  const features = [
    'Retired Civil Surgeon with 25+ years experience',
    'Ayushman Bharat panel hospital',
    'Modern operation theatre',
    'Specialized joint replacement care'
  ];

  return (
    <section className="relative pt-24 pb-16 bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Main Hero Content */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          {/* Left Content */}
          <motion.div
            className="lg:w-1/2 space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-gray-700">Trusted Orthopedic Care in Jhajjar</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-slate-800">Your Joints.</span>
              <br />
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Our Priority.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-gray-600 leading-relaxed">
              At Sanjivani Hospital, we combine decades of orthopedic expertise with compassionate care to help you regain your mobility and live pain-free.
            </p>

            {/* Features List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <FaCheckCircle className="text-teal-600 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/doctors"
                className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <FaCalendarAlt className="group-hover:scale-110 transition-transform" />
                <span>Book Appointment</span>
              </Link>
              
              <a
                href="tel:+918950466995"
                className="inline-flex items-center gap-2 bg-white text-teal-700 border-2 border-teal-600 px-8 py-4 rounded-xl font-semibold shadow-md hover:bg-teal-50 transform hover:-translate-y-1 transition-all duration-300"
              >
                <FaPhone className="animate-pulse" />
                <span>Call Now</span>
              </a>
            </div>
          </motion.div>

          {/* Right Content - Image */}
          <motion.div
            className="lg:w-1/2 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="relative">
              {/* Decorative circles */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-full opacity-50"></div>
              <div className="absolute -bottom-4 -left-4 w-56 h-56 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-50"></div>
              
              {/* Main image container */}
              <div className="relative bg-white p-4 rounded-3xl shadow-2xl">
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img
                    src={heroImage}
                    alt="Sanjivani Hospital"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-100 to-cyan-100">
                          <svg class="w-24 h-24 text-teal-600 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                          </svg>
                        </div>
                      `;
                    }}
                  />
                </div>
              </div>

              {/* Floating card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <FaUserMd className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Led by</p>
                    <p className="font-bold text-gray-800">Dr. S.S. Chauhan</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Available Doctors Section */}
        <AvailableDoctors />

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="text-3xl text-teal-600 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  <AnimatedCounter to={stat.value} />{stat.suffix}
                </h3>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}