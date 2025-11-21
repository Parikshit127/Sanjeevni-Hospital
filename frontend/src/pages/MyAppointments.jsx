import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaClock,
  FaUserMd,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API_URL}/appointments/my-appointments`);
      const apps = res.data.appointments || [];

      // Filter out mock/placeholder appointments before showing to the user.
      // Criteria: flag `isMock` set, missing doctor info, or placeholder images.
      const realAppointments = apps.filter((a) => {
        if (!a) return false;
        if (a.isMock) return false;
        if (!a.doctorId || !a.doctorId._id) return false;
        const img = a.doctorId.image || "";
        if (img.includes("placeholder.com") || img.includes("via.placeholder")) return false;
        return true;
      });

      setAppointments(realAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await axios.put(`${API_URL}/appointments/${appointmentId}/cancel`);
      fetchAppointments();
      alert("Appointment cancelled successfully");
    } catch (error) {
      alert("Failed to cancel appointment");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <FaCheckCircle className="text-green-500" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500" />;
      case "completed":
        return <FaCheckCircle className="text-blue-500" />;
      default:
        return <FaHourglassHalf className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
    }
  };

  const filteredAppointments =
    filter === "all"
      ? appointments
      : appointments.filter((apt) => apt.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-16 h-16 border-4 border-[#67c0b3] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#2d3f4e] mb-2">
            My Appointments
          </h1>
          <p className="text-gray-600">
            View and manage your medical appointments
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          {["all", "pending", "confirmed", "completed", "cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-2 rounded-full font-semibold transition ${filter === status
                    ? "bg-[#67c0b3] text-white shadow-lg"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-[#67c0b3]"
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            )
          )}
        </div>

        {/* Appointments List */}
        {filteredAppointments.length > 0 ? (
          <div className="space-y-6">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Doctor Info */}
                    <div className="flex items-start gap-4">
                      <img
                        src={appointment.doctorId.image}
                        alt={appointment.doctorId.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-[#67c0b3]"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-[#2d3f4e] mb-1 flex items-center gap-2">
                          <FaUserMd className="text-[#67c0b3]" />
                          {appointment.doctorId.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {appointment.doctorId.specialty}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt className="text-blue-500" />
                            {new Date(appointment.date).toLocaleDateString(
                              "en-IN",
                              {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaClock className="text-green-500" />
                            {appointment.timeSlot}
                          </span>
                          {appointment.tokenNumber && (
                            <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-bold">
                              Token #{appointment.tokenNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col items-end gap-3">
                      <div
                        className={`px-4 py-2 rounded-full border-2 font-semibold flex items-center gap-2 ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {getStatusIcon(appointment.status)}
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          Consultation Fee
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          ₹{appointment.consultationFee}
                        </p>
                      </div>

                      {appointment.status === "pending" && (
                        <button
                          onClick={() => handleCancel(appointment._id)}
                          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition"
                        >
                          Cancel Appointment
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Reason */}
                  {appointment.reason && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Reason:</span>{" "}
                        {appointment.reason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No Appointments Found
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === "all"
                ? "You haven't booked any appointments yet."
                : `No ${filter} appointments found.`}
            </p>
            <a
              href="/doctors"
              className="inline-block bg-[#67c0b3] hover:bg-[#5ab0a3] text-white font-semibold px-8 py-3 rounded-lg transition"
            >
              Book Your First Appointment
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
