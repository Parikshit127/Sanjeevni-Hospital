import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function BookAppointment() {
  const { doctorId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [formData, setFormData] = useState({
    patientName: user?.name || "",
    patientEmail: user?.email || "",
    patientPhone: user?.phone || "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    // fetchDoctor is defined inline to satisfy the exhaustive-deps rule
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`${API_URL}/doctors/${doctorId}`);
        setDoctor(res.data.doctor);
      } catch (error) {
        console.error("Error fetching doctor:", error);
      }
    };

    if (doctorId) {
      fetchDoctor();
    }
  }, [doctorId]);

  useEffect(() => {
    if (!selectedDate) return;

    // inline fetchAvailableSlots so eslint doesn't require adding the function to deps
    const fetchAvailableSlots = async () => {
      try {
        const res = await axios.get(`${API_URL}/appointments/available-slots`, {
          params: { doctorId, date: selectedDate },
        });
        setAvailableSlots(res.data.allSlots);
        setBookedSlots(res.data.bookedSlots);
      } catch (error) {
        console.error("Error fetching slots:", error);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate, doctorId]);

  // fetchDoctor and fetchAvailableSlots are now inlined into their useEffects to avoid
  // react-hooks/exhaustive-deps warnings while preserving behavior.

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSlot) {
      setMessage({ type: "error", text: "Please select a time slot" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await axios.post(`${API_URL}/appointments`, {
        doctorId,
        date: selectedDate,
        timeSlot: selectedSlot,
        ...formData,
      });

      setMessage({ type: "success", text: "Appointment booked successfully!" });

      setTimeout(() => {
        navigate("/my-appointments");
      }, 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to book appointment",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  // Get maximum date (30 days from now)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#67c0b3] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Doctor Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-6">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-[#67c0b3]"
            />
            <div>
              <h2 className="text-3xl font-bold text-[#2d3f4e] mb-2">
                {doctor.name}
              </h2>
              <p className="text-[#67c0b3] font-semibold mb-2">
                {doctor.specialty}
              </p>
              <p className="text-gray-600">{doctor.qualification}</p>
              <p className="text-lg font-semibold text-green-600 mt-2">
                Consultation Fee: ₹{doctor.consultationFee}
              </p>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-[#2d3f4e] mb-6">
            Book Your Appointment
          </h3>

          {/* Success/Error Message */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {message.type === "success" ? (
                <FaCheckCircle />
              ) : (
                <FaTimesCircle />
              )}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Patient Name
                </label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#67c0b3] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="patientEmail"
                  value={formData.patientEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#67c0b3] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="patientPhone"
                  value={formData.patientPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#67c0b3] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <FaCalendarAlt /> Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={today}
                  max={maxDateStr}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#67c0b3] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Reason for Visit */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Reason for Visit
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#67c0b3] focus:outline-none"
                placeholder="Brief description of your concern..."
              ></textarea>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div>
                <label className="block text-gray-700 font-semibold mb-4 flex items-center gap-2">
                  <FaClock /> Select Time Slot
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {availableSlots.map((slot) => {
                    const isBooked = bookedSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => !isBooked && setSelectedSlot(slot)}
                        disabled={isBooked}
                        className={`py-3 px-4 rounded-lg font-semibold transition transform ${
                          isBooked
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : selectedSlot === slot
                            ? "bg-[#67c0b3] text-white shadow-lg scale-105"
                            : "bg-white border-2 border-gray-300 hover:border-[#67c0b3] hover:scale-105"
                        }`}
                      >
                        {slot}
                        {isBooked && <div className="text-xs mt-1">Booked</div>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !selectedSlot}
              className={`w-full py-4 rounded-lg font-semibold text-white text-lg transition transform ${
                loading || !selectedSlot
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#67c0b3] hover:bg-[#5ab0a3] hover:scale-105 shadow-lg"
              }`}
            >
              {loading ? "Booking..." : "Confirm Appointment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
