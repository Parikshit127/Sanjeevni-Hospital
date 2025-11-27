import React from 'react';
import { motion } from 'framer-motion';
import { FaUserMd, FaAward, FaHospital, FaMapMarkerAlt, FaGraduationCap, FaBriefcase, FaStethoscope, FaCheckCircle } from 'react-icons/fa';
import doctorImg from '../assets/hos1.jpg';

export default function DoctorSection() {
  const specializations = [
    'Joint replacement surgeries (Knee & Hip)',
    'Complex trauma & fracture management',
    'Minimally invasive arthroscopy procedures',
    'Geriatric bone care & osteoporosis treatment'
  ];

  const credentials = [
    { icon: <FaGraduationCap />, label: 'Qualification', value: 'M.B.B.S, M.S. (Ortho)', color: 'from-blue-500 to-indigo-600' },
    { icon: <FaBriefcase />, label: 'Experience', value: '25+ Years in Orthopedic Surgery', color: 'from-teal-500 to-cyan-600' },
    { icon: <FaMapMarkerAlt />, label: 'Location', value: 'Rishi Colony, Dadri Road, Jhajjar', color: 'from-purple-500 to-pink-600' }
  ];

  return (
    <section id="doctor" className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-teal-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold">
              <FaUserMd />
              <span>Our Founder</span>
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="text-slate-800">Meet </span>
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Dr. S.S. Chauhan
            </span>
          </h2>

          <p className="text-lg text-gray-600">
            Senior Orthopedic Surgeon & Founder of Sanjivani Hospital
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Doctor Image Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative bg-white p-6 rounded-3xl shadow-2xl">
              {/* Decorative gradient border */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 rounded-3xl opacity-10"></div>
              
              {/* Image Container */}
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={doctorImg}
                  alt="Dr. S.S. Chauhan"
                  className="w-full h-[500px] object-cover"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                {/* Badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaAward className="text-white text-xl" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-lg">25+ Years</p>
                      <p className="text-sm text-gray-600">Orthopedic Excellence</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-4 rounded-xl text-center">
                  <p className="text-3xl font-bold text-teal-600">10K+</p>
                  <p className="text-sm text-gray-600 mt-1">Surgeries</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl text-center">
                  <p className="text-3xl font-bold text-blue-600">30K+</p>
                  <p className="text-sm text-gray-600 mt-1">Patients Treated</p>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-full opacity-50 -z-10"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-50 -z-10"></div>
          </motion.div>

          {/* Right: Doctor Bio & Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* About Text */}
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed text-lg">
                <strong className="text-slate-800">Dr. S.S. Chauhan</strong> is a highly respected and experienced orthopedic surgeon with a legacy of over <strong className="text-teal-600">25 years</strong> in bone and joint care. He previously served as a Senior Surgeon at <strong className="text-teal-600">Civil Hospital, Jhajjar</strong>, where he handled thousands of complex trauma and joint replacement cases with excellence and empathy.
              </p>
              
              <p className="text-gray-700 leading-relaxed text-lg">
                Known for his calm demeanor, sharp diagnostic skills, and surgical precision, Dr. Chauhan has gained the trust of countless patients not just in Jhajjar, but across Haryana.
              </p>
            </div>

            {/* Specializations */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <FaStethoscope className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Areas of Expertise</h3>
              </div>
              
              <ul className="space-y-3">
                {specializations.map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <FaCheckCircle className="text-teal-600 mt-1 flex-shrink-0" />
                    <span className="text-base">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Philosophy */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-2xl border border-teal-100">
              <div className="flex items-start gap-3">
                <FaHospital className="text-teal-600 text-2xl mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Our Philosophy</h4>
                  <p className="text-gray-700 leading-relaxed">
                    As the founder of <strong>Sanjivani Hospital</strong>, Dr. Chauhan leads a dedicated team committed to restoring mobility and improving lives. His commitment to ethical practice, affordable treatment, and excellence in orthopedic care forms the backbone of Sanjivani's patient-first philosophy.
                  </p>
                </div>
              </div>
            </div>

            {/* Credentials Cards */}
            <div className="space-y-4">
              {credentials.map((cred, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="group bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${cred.color} rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      {cred.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{cred.label}</p>
                      <p className="text-base font-bold text-slate-800 mt-1">{cred.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            >
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span>Book Consultation with Dr. Chauhan</span>
                <FaUserMd className="group-hover:scale-110 transition-transform" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}