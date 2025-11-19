import React from 'react';
import { motion } from 'framer-motion';

const reviews = [
  {
    name: 'Rahul Mehra',
    feedback:
      'My knee surgery was successful, and I was able to walk within 10 days. The doctor is very experienced.',
  },
  {
    name: 'Neha Sharma',
    feedback:
      'Mummy ka hip replacement yahan hua tha. Doctor ne bahut achhi tarah se samjhaya aur care bhi excellent thi.',
  },
  {
    name: 'Amit Yadav',
    feedback:
      'The hospital is clean and modern. Treatment was done quickly, and the staff is very cooperative.',
  },
  {
    name: 'Savita Devi',
    feedback:
      'Ayushman card se free treatment mila. Staff ne har step pe madad ki. Dhanyavaad Sanjivani team!',
  },
  {
    name: 'Jyoti Kumari',
    feedback:
      'I came with unbearable joint pain. After the treatment, I’m able to work again. Great service!',
  },
  {
    name: 'Ramesh Dagar',
    feedback:
      'Fracture ke baad mere pair kaafi weak ho gaye the. Yahan treatment ke baad main phir se chalne laga. Best experience!',
  },
];

export default function Reviews() {
  return (
    <section id="reviews" className="py-20 bg-[#2d3f4e]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Patient <span className="text-[#67c0b3]">Reviews</span>
        </motion.h2>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md border-t-4 border-[#67c0b3] hover:shadow-xl transition"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <p className="text-gray-700 text-sm italic">"{review.feedback}"</p>
              <h4 className="mt-4 font-semibold text-[#2d3f4e] text-sm">- {review.name}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
