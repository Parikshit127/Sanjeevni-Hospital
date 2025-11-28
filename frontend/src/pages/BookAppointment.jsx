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

// Load Razorpay script
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      return resolve(true);
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

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

  // Fetch doctor details
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`${API_URL}/doctors/${doctorId}`);
        setDoctor(res.data.doctor);
      } catch (error) {
        console.error("Error fetching doctor:", error);
      }
    };

    if (doctorId) fetchDoctor();
  }, [doctorId]);

  // Fetch available slots when date changes
  useEffect(() => {
    if (!selectedDate) return;

    const fetchAvailableSlots = async () => {
      try {
        const res = await axios.get(`${API_URL}/appointments/available-slots`, {
          params: { doctorId, date: selectedDate },
        });
        setAvailableSlots(res.data.allSlots || []);
        setBookedSlots(res.data.bookedSlots || []);
        setSelectedSlot(""); // reset if date changes
      } catch (error) {
        console.error("Error fetching slots:", error);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate, doctorId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Helper: min & max date
  const today = new Date().toISOString().split("T")[0];
  const maxDateObj = new Date();
  maxDateObj.setDate(maxDateObj.getDate() + 30);
  const maxDateStr = maxDateObj.toISOString().split("T")[0];

  // 🔹 Payment + booking flow
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      setMessage({ type: "error", text: "Please select a date" });
      return;
    }
    if (!selectedSlot) {
      setMessage({ type: "error", text: "Please select a time slot" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setMessage({
          type: "error",
          text: "Unable to load payment gateway. Please check your internet connection.",
        });
        setLoading(false);
        return;
      }

      // 1️⃣ Ask backend to create Razorpay order
      const orderRes = await axios.post(
        `${API_URL}/payments/create-order`,
        {
          doctorId,
          date: selectedDate,
          timeSlot: selectedSlot,
          reason: formData.reason,
          patientName: formData.patientName,
          patientEmail: formData.patientEmail,
          patientPhone: formData.patientPhone,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { key, amount, currency, orderId } = orderRes.data;

      // 2️⃣ Configure Razorpay checkout
      const options = {
        key,
        amount,
        currency,
        name: "Hospital Appointment",
        description: `Consultation with Dr. ${doctor.name}`,
        order_id: orderId,
        prefill: {
          name: formData.patientName,
          email: formData.patientEmail,
          contact: formData.patientPhone,
        },
        theme: {
          color: "#0f766e", // match your accent
        },
        handler: async function (response) {
          // 3️⃣ On payment success → verify + create appointment
          try {
            const verifyRes = await axios.post(
              `${API_URL}/payments/verify-and-create`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                appointmentData: {
                  doctorId,
                  date: selectedDate,
                  timeSlot: selectedSlot,
                  ...formData,
                },
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (verifyRes.data.success) {
              setMessage({
                type: "success",
                text: "Payment successful! Appointment booked.",
              });
              setTimeout(() => navigate("/my-appointments"), 2000);
            } else {
              setMessage({
                type: "error",
                text: "Something went wrong after payment. Please contact support.",
              });
            }
          } catch (error) {
            console.error("Error verifying payment / creating appointment:", error);
            setMessage({
              type: "error",
              text:
                error.response?.data?.message ||
                "Payment succeeded but appointment was not created. Please contact support.",
            });
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setMessage({
              type: "error",
              text: "Payment cancelled. Appointment not booked.",
            });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error starting payment:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to start payment. Please try again.",
      });
      setLoading(false);
    }
  };

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Doctor Info Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={
                doctor.image
                  ? doctor.image.startsWith('http')
                    ? doctor.image
                    : `${API_URL.replace('/api', '')}${doctor.image}`
                  : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect fill='%23e0e0e0' width='150' height='150'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='16' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EDoctor%3C/text%3E%3C/svg%3E"
              }
              alt={doctor.name}
              className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-accent"
              onError={(e) => {
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect fill='%23e0e0e0' width='150' height='150'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='16' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EDoctor%3C/text%3E%3C/svg%3E";
              }}
            />
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-primary">
                {doctor.name}
              </h2>
              <p className="text-accent font-semibold mt-1">
                {doctor.specialty}
              </p>
              <p className="text-gray-600 mt-1">{doctor.qualification}</p>

              <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-3 text-sm">
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                  Consultation Fee:{" "}
                  <span className="font-semibold">
                    ₹{doctor.consultationFee}
                  </span>
                </span>
                {doctor.experience && (
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    Experience:{" "}
                    <span className="font-semibold">
                      {doctor.experience} Years
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Booking Layout */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <h3 className="text-2xl font-bold text-primary mb-4">
            Book Your Appointment
          </h3>

          {/* Message */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
                }`}
            >
              {message.type === "success" ? (
                <FaCheckCircle />
              ) : (
                <FaTimesCircle />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* 2-column layout: left (date + slots), right (patient details) */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* LEFT: Date & Time Selection */}
            <div className="md:col-span-2 space-y-6 border md:border-0 rounded-xl md:rounded-none p-4 md:p-0">
              {/* Select Date */}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  You can book up to 30 days in advance.
                </p>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <FaClock /> Select Time Slot
                </label>

                {!selectedDate && (
                  <p className="text-xs text-gray-500">
                    Please select a date first to view available slots.
                  </p>
                )}

                {selectedDate && (
                  <>
                    {availableSlots.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No slots available for this date. Please choose another day.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                        {availableSlots.map((slot) => {
                          const isBooked = bookedSlots.includes(slot);
                          const isSelected = selectedSlot === slot;

                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => !isBooked && setSelectedSlot(slot)}
                              disabled={isBooked}
                              className={`py-2.5 px-3 rounded-lg text-sm font-semibold border transition transform ${isBooked
                                  ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200"
                                  : isSelected
                                    ? "bg-accent text-white border-accent shadow-md scale-105"
                                    : "bg-white text-gray-700 border-gray-300 hover:border-accent hover:scale-105"
                                }`}
                            >
                              {slot}
                              {isBooked && (
                                <div className="text-[10px] mt-1 uppercase tracking-wide">
                                  Booked
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}

                {selectedSlot && (
                  <p className="mt-3 text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
                    Selected Slot: <strong>{selectedSlot}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* RIGHT: Patient Details */}
            <div className="md:col-span-3 space-y-5">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Reason for Visit
                  </label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
                    placeholder="Brief description of your concern..."
                  />
                </div>
              </div>

              {/* Summary + Button */}
              <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                  <p>
                    <span className="font-semibold text-gray-800">
                      Appointment Summary
                    </span>
                  </p>
                  <p className="mt-1">
                    Doctor:{" "}
                    <span className="font-semibold text-primary">
                      {doctor.name}
                    </span>
                  </p>
                  <p className="mt-1">
                    Fee:{" "}
                    <span className="font-semibold text-accent">
                      ₹{doctor.consultationFee}
                    </span>{" "}
                    (to be paid now)
                  </p>
                  {selectedDate && (
                    <p className="mt-1">
                      Date:{" "}
                      <span className="font-semibold">
                        {new Date(selectedDate).toLocaleDateString()}
                      </span>
                    </p>
                  )}
                  {selectedSlot && (
                    <p className="mt-1">
                      Time:{" "}
                      <span className="font-semibold">{selectedSlot}</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={
                    loading || !selectedDate || !selectedSlot || !formData.patientName
                  }
                  className={`w-full md:w-60 py-3 rounded-lg font-semibold text-white text-base transition transform ${loading || !selectedDate || !selectedSlot
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-accent hover:bg-accent-600 hover:scale-105 shadow-md"
                    }`}
                >
                  {loading ? "Processing Payment..." : "Pay & Confirm Appointment"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
