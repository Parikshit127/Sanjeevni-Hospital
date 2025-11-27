import React from 'react';
import { motion } from 'framer-motion';
import { FaBone, FaCrutch, FaXRay, FaProcedures, FaArrowRight } from 'react-icons/fa';

const services = [
  {
    title: "Joint & Bone Diseases",
    icon: <FaBone className="text-4xl" />,
    desc: "Comprehensive diagnosis and treatment of arthritis, osteoporosis, and chronic joint pain with personalized care plans.",
    features: ["Arthritis Treatment", "Osteoporosis Care", "Joint Pain Management"],
    color: "from-blue-500 to-indigo-600"
  },
  {
    title: "Trauma & Fracture Care",
    icon: <FaCrutch className="text-4xl" />,
    desc: "Emergency and surgical care for all types of bone fractures and trauma injuries with 24/7 support.",
    features: ["Emergency Care", "Fracture Surgery", "Trauma Recovery"],
    color: "from-teal-500 to-cyan-600"
  },
  {
    title: "Arthroscopy",
    icon: <FaXRay className="text-4xl" />,
    desc: "Minimally invasive arthroscopic procedures for joint repair, diagnostics, and faster recovery times.",
    features: ["Knee Arthroscopy", "Shoulder Surgery", "Quick Recovery"],
    color: "from-purple-500 to-pink-600"
  },
  {
    title: "Joint Replacement",
    icon: <FaProcedures className="text-4xl" />,
    desc: "Advanced knee and hip replacement surgeries with high success rates and comprehensive rehabilitation support.",
    features: ["Hip Replacement", "Knee Replacement", "Post-Op Care"],
    color: "from-amber-500 to-orange-600"
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-5">
        <div className="absolute top-20 right-0 w-96 h-96 bg-teal-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
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
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-block"
          >
            <span className="bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold">
              Our Specializations
            </span>
          </motion.div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="text-slate-800">Expert </span>
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Orthopedic Services
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive orthopedic care with state-of-the-art facilities and experienced specialists
          </p>
        </motion.div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative"
            >
              {/* Card */}
              <div className="h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
                {/* Gradient Header */}
                <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
                
                {/* Card Content */}
                <div className="p-6 space-y-4">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center text-white transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                    {service.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-teal-600 transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.desc}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2 pt-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.color}`}></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Learn More Link */}
                  <div className="pt-4">
                    <button className="group/btn flex items-center gap-2 text-teal-600 font-semibold text-sm hover:gap-3 transition-all">
                      <span>Learn More</span>
                      <FaArrowRight className="text-xs group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <span>Schedule a Consultation</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}