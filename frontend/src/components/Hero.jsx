// import React from 'react';
// import { motion } from 'framer-motion';
// import heroImage from '../assets/hos.jpg'; // Replace with real image

// export default function Hero() {
//   return (
//     <section className="pt-32 pb-24 bg-white">
//       <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
//         {/* Text */}
//         <motion.div
//           className="md:w-1/2 space-y-6 text-center md:text-left"
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <h1 className="text-4xl md:text-5xl font-extrabold text-[#2d3f4e] leading-tight">
//             Your Joints. <span className="text-[#67c0b3]">Our Priority.</span>
//           </h1>
//           <p className="text-gray-600 text-lg">
//             At Sanjivani Hospital, we bring decades of orthopedic expertise to help you walk, run, and move with confidence again.
//           </p>
//           <a
//             href="#contact"
//             className="inline-block bg-[#67c0b3] text-white px-6 py-3 rounded-full font-medium shadow hover:bg-[#58aa9f] transition"
//           >
//             Book Your Appointment
//           </a>
//         </motion.div>

//         {/* Hero Image */}
//         <motion.div
//           className="md:w-1/2 mb-10 md:mb-0 flex justify-center"
//           initial={{ scale: 0.8, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ delay: 0.2, duration: 0.7 }}
//         >
//           <div className="rounded-full mt-10 bg-[#67c0b3] p-2 w-72 h-72 flex items-center justify-center">
//            <img
//               src={heroImage}
//               alt="Doctor"
//               className="rounded-full w-64 h-64 object-cover shadow-xl"
//             />
//           </div>
//         </motion.div>
//       </div>

//       {/* Stats Section */}
//       <motion.div
//         className="max-w-6xl mx-auto mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center"
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.6, delay: 0.2 }}
//       >
//         {[
//           { label: 'Years of Experience', value: '25+' },
//           { label: 'Surgeries Performed', value: '10,000+' },
//           { label: 'Happy Patients', value: '30,000+' },
//           { label: 'Replacement Success Rate', value: '98%' },
//         ].map((stat, i) => (
//           <div key={i} className="p-6 shadow-md rounded-lg bg-[#f7fafc]">
//             <h3 className="text-3xl font-bold text-[#2d3f4e]">{stat.value}</h3>
//             <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
//           </div>
//         ))}
//       </motion.div>

//       {/* Extra Info Block */}
//       <motion.div
//         className="max-w-5xl mx-auto mt-20 bg-[#f9fafa] p-8 rounded-2xl shadow-lg"
//         initial={{ opacity: 0, y: 60 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.7 }}
//       >
//         <h2 className="text-2xl md:text-3xl font-bold text-[#2d3f4e] mb-4 text-center">
//           Why Choose Sanjivani Hospital?
//         </h2>
//         <ul className="list-disc list-inside text-gray-700 space-y-3 text-lg">
//           <li>Run by Dr. S.S. Chauhan – Retired Civil Surgeon with 25+ years of experience</li>
//           <li>Ayushman Bharat panel hospital – cashless treatment available</li>
//           <li>Specialized care for bone fractures, joint replacements, and arthroscopy</li>
//           <li>Modern operation theatre & rehabilitation support</li>
//           <li>Empathetic nursing staff & personalized treatment plans</li>
//         </ul>
//       </motion.div>
//     </section>
//   );
// }

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, animate, useInView, useMotionValue } from 'framer-motion';
import heroImage from '../assets/hos.jpg';

// Counter Component: Animates from 0 to target when in view
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
    { label: 'Years of Experience', value: 25, suffix: '+' },
    { label: 'Surgeries Performed', value: 10000, suffix: '+' },
    { label: 'Happy Patients', value: 30000, suffix: '+' },
    { label: 'Replacement Success Rate', value: 98, suffix: '%' },
  ];

  return (
    <section className="pt-32 pb-24 bg-white">
      {/* Hero Top Section */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        {/* Text Content */}
        <motion.div
          className="md:w-1/2 space-y-6 text-center md:text-left"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#2d3f4e] leading-tight">
            Your Joints. <span className="text-[#67c0b3]">Our Priority.</span>
          </h1>
          <p className="text-gray-600 text-lg">
            At Sanjivani Hospital, we bring decades of orthopedic expertise to help you walk, run, and move with confidence again.
          </p>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <a
              href="#contact"
              className="inline-block bg-[#67c0b3] text-white px-6 py-3 rounded-full font-medium shadow hover:bg-[#58aa9f] transition duration-300"
            >
              Contact / Walk-in
            </a>

            {/* Book Online Appointment CTA */}
            <Link
              to="/doctors"
              className="inline-block bg-white text-[#67c0b3] border-2 border-[#67c0b3] px-6 py-3 rounded-full font-medium shadow hover:bg-[#ecfffb] transition duration-300"
            >
              Book Online Appointment
            </Link>
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          className="md:w-1/2 mb-10 md:mb-0 flex justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.9 }}
        >
          <div className="rounded-full mt-10 bg-[#67c0b3] p-2 w-72 h-72 flex items-center justify-center shadow-2xl">
            <img
              src={heroImage}
              alt="Doctor"
              className="rounded-full w-64 h-64 object-cover"
            />
          </div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <motion.div
        className="max-w-6xl mx-auto mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.2 }}
      >
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            className="p-6 shadow-md rounded-lg bg-[#f7fafc] hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold text-[#2d3f4e]">
              <AnimatedCounter to={stat.value} />{stat.suffix}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Why Choose Us Section */}
      <motion.div
        className="max-w-5xl mx-auto mt-20 bg-[#f9fafa] p-8 rounded-2xl shadow-lg"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-[#2d3f4e] mb-4 text-center">
          Why Choose Sanjivani Hospital?
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-3 text-lg">
          <li>Run by Dr. S.S. Chauhan – Retired Civil Surgeon with 25+ years of experience</li>
          <li>Ayushman Bharat panel hospital – cashless treatment available</li>
          <li>Specialized care for bone fractures, joint replacements, and arthroscopy</li>
          <li>Modern operation theatre & rehabilitation support</li>
          <li>Empathetic nursing staff & personalized treatment plans</li>
        </ul>
      </motion.div>
    </section>
  );
}
