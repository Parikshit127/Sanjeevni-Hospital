import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    service: '',
    phone: '',
    date: '',
    time: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, service, phone, date, time, notes } = formData;

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

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2d3f4e] mb-10">
          Book Your <span className="text-[#67c0b3]">Appointment</span>
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-[#f4f8fa] p-8 rounded-xl shadow-lg space-y-6"
        >
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#67c0b3]"
          />

          {/* Service */}
          <select
            name="service"
            required
            value={formData.service}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#67c0b3]"
          >
            <option value="">Select Service</option>
            <option value="Joint Pain">Joint Pain</option>
            <option value="Fracture Treatment">Fracture Treatment</option>
            <option value="Knee/Hip Replacement">Knee/Hip Replacement</option>
            <option value="Arthroscopy">Arthroscopy</option>
            <option value="Back Pain">Back Pain</option>
            <option value="Other">Other</option>
          </select>

          {/* Phone */}
          <input
            type="tel"
            name="phone"
            required
            pattern="[0-9]{10}"
            placeholder="Contact Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#67c0b3]"
          />

          {/* Date */}
          <input
            type="date"
            name="date"
            required
            min={new Date().toISOString().split('T')[0]}
            value={formData.date}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#67c0b3]"
          />

          {/* Time */}
          <select
            name="time"
            required
            value={formData.time}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#67c0b3]"
          >
            <option value="">Select Preferred Time</option>
            {Array.from({ length: 12 }, (_, i) => {
              const hour = 10 + i;
              return (
                <option key={hour} value={`${hour}:00`}>
                  {hour}:00
                </option>
              );
            })}
          </select>

          {/* Notes */}
          <textarea
            name="notes"
            rows="3"
            placeholder="Other notes (optional)"
            value={formData.notes}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#67c0b3]"
          />

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-4">
            <button
              type="submit"
              className="bg-[#67c0b3] hover:bg-[#58aa9f] text-white font-semibold py-3 px-6 rounded-md transition"
            >
              Send via WhatsApp
            </button>
            <a
              href="tel:+918950466995"
              className="bg-[#2d3f4e] hover:bg-[#1e2e3c] text-white font-semibold py-3 px-6 rounded-md transition text-center"
            >
              📞 Call Now
            </a>
          </div>
        </form>
      </div>
    </section>
  );
}
