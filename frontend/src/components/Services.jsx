import React from 'react';
import { motion } from 'framer-motion';
import { FaBone, FaCrutch, FaXRay, FaProcedures } from 'react-icons/fa';

const services = [
  {
    title: "Joint & Bone Diseases",
    icon: <FaBone className="text-3xl text-[#67c0b3]" />,
    desc: "Diagnosis and treatment of arthritis, osteoporosis, and chronic joint pain.",
  },
  {
    title: "Trauma & Fracture Care",
    icon: <FaCrutch className="text-3xl text-[#67c0b3]" />,
    desc: "Emergency and surgical care for all types of bone fractures and trauma injuries.",
  },
  {
    title: "Arthroscopy (Knee & Shoulder)",
    icon: <FaXRay className="text-3xl text-[#67c0b3]" />,
    desc: "Minimally invasive arthroscopic procedures for joint repair and diagnostics.",
  },
  {
    title: "Knee & Hip Replacement",
    icon: <FaProcedures className="text-3xl text-[#67c0b3]" />,
    desc: "Advanced joint replacement surgeries with high success rate and recovery support.",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-[#2d3f4e] mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Our <span className="text-[#67c0b3]">Services</span>
        </motion.h2>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-[#f7f9fa] p-6 rounded-2xl shadow hover:shadow-lg transition"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-[#2d3f4e] mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
