import React from 'react';
import { motion } from 'framer-motion';
import doctorImg from '../assets/hos1.jpg'; // replace with actual image

export default function DoctorSection() {
  return (
    <section id="doctor" className="py-24 bg-[#f4f8fa]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-[#2d3f4e] mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Meet <span className="text-[#67c0b3]">Dr. S.S. Chauhan</span>
        </motion.h2>

        <div className="flex flex-col md:flex-row gap-10 items-center">
          {/* Left: Doctor Image */}
          <motion.div
            className="md:w-1/2 flex justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={doctorImg}
              alt="Dr. S.S. Chauhan"
              className="rounded-2xl w-80 h-80 object-cover shadow-xl"
            />
          </motion.div>

          {/* Right: Doctor Bio */}
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold text-[#2d3f4e] mb-3">Senior Orthopedic Surgeon</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              <strong>Dr. S.S. Chauhan</strong> is a highly respected and experienced orthopedic surgeon with a legacy
              of over <strong>25 years</strong> in bone and joint care. He previously served as a Senior Surgeon at
              <span className="text-[#67c0b3] font-medium"> Civil Hospital, Jhajjar</span>, where he handled thousands of
              complex trauma and joint replacement cases with excellence and empathy.
            </p>

            <p className="mt-4 text-gray-700 leading-relaxed text-lg">
              Known for his calm demeanor, sharp diagnostic skills, and surgical precision, Dr. Chauhan has gained
              the trust of countless patients not just in Jhajjar, but across Haryana. He specializes in:
            </p>

            <ul className="list-disc list-inside text-gray-700 mt-4 ml-2 space-y-2 text-base">
              <li>Joint replacement surgeries (Knee & Hip)</li>
              <li>Complex trauma & fracture management</li>
              <li>Minimally invasive arthroscopy procedures</li>
              <li>Geriatric bone care & osteoporosis treatment</li>
            </ul>

            <p className="mt-5 text-gray-700 leading-relaxed text-lg">
              As the founder of <strong>Sanjivani Hospital</strong>, Dr. Chauhan leads a dedicated team committed to restoring
              mobility and improving lives. His commitment to ethical practice, affordable treatment, and excellence
              in orthopedic care forms the backbone of Sanjivani’s patient-first philosophy.
            </p>

            <div className="mt-6">
              <p className="text-[#2d3f4e] font-semibold">
                👨‍⚕️ Qualification: <span className="text-gray-700">M.B.B.S, M.S. (Ortho)</span>
              </p>
              <p className="text-[#2d3f4e] font-semibold">
                🏥 Experience: <span className="text-gray-700">25+ Years in Orthopedic Surgery</span>
              </p>
              <p className="text-[#2d3f4e] font-semibold">
                📍 Location: <span className="text-gray-700">Rishi Colony, Dadri Road, Jhajjar</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
