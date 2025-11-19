import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="py-20 bg-[#f4f8fa]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-[#2d3f4e] mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          About <span className="text-[#67c0b3]">Sanjivani Hospital</span>
        </motion.h2>

        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-lg text-gray-700 leading-relaxed">
            Sanjivani Hospital is a trusted orthopedic care center located in the heart of Jhajjar,
            led by <span className="font-semibold text-[#2d3f4e]">Dr. S.S. Chauhan</span>, a veteran orthopedic surgeon with over 25 years of experience.
            Our mission is to provide expert and compassionate care to every patient suffering from joint pain, fractures, and orthopedic trauma.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mt-6">
            We are empaneled under <span className="text-[#67c0b3] font-medium">Ayushman Bharat</span>, enabling cashless treatment for eligible patients.
            Our facilities are equipped with modern operation theatres, diagnostic services, and post-surgery rehabilitation.
            We combine surgical expertise with warmth, care, and patient-centric values.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mt-6">
            Whether it’s a complex knee replacement or a simple bone fracture, we ensure that every treatment plan is tailored to your needs.
            Our goal is simple — to get you back on your feet, pain-free.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
