import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaPhone, FaMapMarkerAlt, FaClock, FaUser, FaCalendarAlt, FaStickyNote } from 'react-icons/fa';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    service: '',
    phone: '',
    date: '',
    time: '',
    notes: '',
  });

  const [focusedField, setFocusedField] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const { name, service, phone, date, time, notes } = formData;

    if (!name || !service || !phone || !date || !time) {
      alert('Please fill in all required fields');
      return;
    }

    const message = `Hello, I would like to book an appointment:

👤 Name: ${name}
🦴 Service: ${service}
📞 Contact: ${phone}
📅 Date: ${date}
⏰ Time: ${time}
📝 Notes: ${notes || 'N/A'}

Please confirm availability.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/918950466995?text=${encoded}`, '_blank');
  };

  const contactInfo = [
    {
      icon: <FaPhone />,
      title: 'Phone',
      content: '+91 89504 66995',
      link: 'tel:+918950466995',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Location',
      content: 'Jhajjar, Haryana',
      link: '#',
      color: 'from-teal-500 to-cyan-600'
    },
    {
      icon: <FaClock />,
      title: 'Working Hours',
      content: 'Mon-Sat: 10 AM - 10 PM',
      link: '#',
      color: 'from-purple-500 to-pink-600'
    },
  ];

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-teal-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
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
          <span className="bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold inline-block">
            Get in Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="text-slate-800">Book Your </span>
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Appointment
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Take the first step towards better joint health. Our team is ready to help you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {contactInfo.map((info, idx) => (
              <motion.a
                key={idx}
                href={info.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group block bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">{info.title}</h3>
                    <p className="text-gray-600 text-sm">{info.content}</p>
                  </div>
                </div>
              </motion.a>
            ))}

            {/* Why Choose Us */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-2xl"
            >
              <h3 className="font-bold text-slate-800 mb-4 text-lg">Why Choose Us?</h3>
              <ul className="space-y-3">
                {[
                  '25+ years of experience',
                  'Ayushman Bharat panel',
                  'Modern facilities',
                  'Personalized care'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* Appointment Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
              {/* Name Input */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <FaUser className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'name' ? 'text-teal-600' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField('')}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Service Select */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Service Required *
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="">Select a service</option>
                  <option value="Joint Pain">Joint Pain</option>
                  <option value="Fracture Treatment">Fracture Treatment</option>
                  <option value="Knee/Hip Replacement">Knee/Hip Replacement</option>
                  <option value="Arthroscopy">Arthroscopy</option>
                  <option value="Back Pain">Back Pain</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Phone Input */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Number *
                </label>
                <div className="relative">
                  <FaPhone className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'phone' ? 'text-teal-600' : 'text-gray-400'}`} />
                  <input
                    type="tel"
                    name="phone"
                    pattern="[0-9]{10}"
                    placeholder="Enter 10-digit number"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField('')}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Date and Time Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Date *
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      name="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Time *
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                  >
                    <option value="">Select time</option>
                    {Array.from({ length: 12 }, (_, i) => {
                      const hour = 10 + i;
                      return (
                        <option key={hour} value={`${hour}:00`}>
                          {hour}:00
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Notes Textarea */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <div className="relative">
                  <FaStickyNote className="absolute left-4 top-4 text-gray-400" />
                  <textarea
                    name="notes"
                    rows="4"
                    placeholder="Tell us more about your condition or any special requirements..."
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors bg-gray-50 focus:bg-white resize-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <FaWhatsapp className="text-xl group-hover:scale-110 transition-transform" />
                  <span>Send via WhatsApp</span>
                </button>
                <a
                  href="tel:+918950466995"
                  className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <FaPhone className="animate-pulse" />
                  <span>Call Now</span>
                </a>
              </div>

              {/* Privacy Notice */}
              <p className="text-xs text-gray-500 text-center pt-2">
                Your information is secure and will only be used for appointment scheduling.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}