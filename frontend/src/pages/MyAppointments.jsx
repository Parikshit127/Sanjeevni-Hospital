import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaClock,
  FaUserMd,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Reschedule modal state
  const [rescheduleModal, setRescheduleModal] = useState({ open: false, appointment: null });
  const [newDate, setNewDate] = useState("");
  const [newTimeSlot, setNewTimeSlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [rescheduling, setRescheduling] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/appointments/my-appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const apps = res.data.appointments || [];
      console.log('📊 Fetched appointments:', apps.length);
      console.log('Appointments data:', apps.map(a => ({
        id: a._id,
        status: a.status,
        doctor: a.doctorId?.name,
        hasDoctor: !!a.doctorId
      })));

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

      console.log('✅ Real appointments after filtering:', realAppointments.length);
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
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/appointments/${appointmentId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments();
      alert("Appointment cancelled successfully");
    } catch (error) {
      console.error("Cancel error:", error);
      alert("Failed to cancel appointment");
    }
  };

  const openRescheduleModal = (appointment) => {
    setRescheduleModal({ open: true, appointment });
    setNewDate("");
    setNewTimeSlot("");
    setAvailableSlots([]);
  };

  const closeRescheduleModal = () => {
    setRescheduleModal({ open: false, appointment: null });
  };

  const fetchSlotsForDate = async (date) => {
    if (!date || !rescheduleModal.appointment) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/appointments/available-slots`, {
        params: { doctorId: rescheduleModal.appointment.doctorId._id, date },
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableSlots(res.data.allSlots || []);
      setBookedSlots(res.data.bookedSlots || []);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  const handleReschedule = async () => {
    if (!newDate || !newTimeSlot) {
      alert("Please select both date and time slot");
      return;
    }

    setRescheduling(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/appointments/${rescheduleModal.appointment._id}/reschedule`,
        { newDate, newTimeSlot },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Appointment rescheduled successfully!");
      fetchAppointments();
      closeRescheduleModal();
    } catch (error) {
      console.error("Reschedule error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      const errorMsg = error.response?.data?.message || error.message || "Failed to reschedule appointment";
      alert(errorMsg);
    } finally {
      setRescheduling(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "booked":
        return <FaCheckCircle className="text-green-500" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaCheckCircle className="text-green-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "booked":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-green-100 text-green-800 border-green-300";
    }
  };

  const filteredAppointments =
    filter === "all"
      ? appointments
      : appointments.filter((apt) => apt.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            My Appointments
          </h1>
          <p className="text-gray-600">
            View and manage your medical appointments
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          {["all", "booked", "cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-2 rounded-full font-semibold transition ${filter === status
                  ? "bg-accent text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-accent"
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
                        src={
                          appointment.doctorId.image
                            ? appointment.doctorId.image.startsWith('http')
                              ? appointment.doctorId.image
                              : `${API_URL.replace('/api', '')}${appointment.doctorId.image}`
                            : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect fill='%23e0e0e0' width='150' height='150'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='16' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EDoctor%3C/text%3E%3C/svg%3E"
                        }
                        alt={appointment.doctorId.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-accent"
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect fill='%23e0e0e0' width='150' height='150'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='16' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EDoctor%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      <div>
                        <h3 className="text-xl font-bold text-primary mb-1 flex items-center gap-2">
                          <FaUserMd className="text-accent" />
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

                      {appointment.status === "booked" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openRescheduleModal(appointment)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition text-sm"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancel(appointment._id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition text-sm"
                          >
                            Cancel
                          </button>
                        </div>
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
              className="inline-block bg-accent hover:bg-accent-600 text-white font-semibold px-8 py-3 rounded-lg transition"
            >
              Book Your First Appointment
            </a>
          </div>
        )}

        {/* Reschedule Modal */}
        {rescheduleModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-primary mb-4">Reschedule Appointment</h3>
              <p className="text-gray-600 mb-6">
                Dr. {rescheduleModal.appointment.doctorId.name} - {rescheduleModal.appointment.doctorId.specialty}
              </p>

              {/* Date Picker */}
              <label className="block text-gray-700 font-semibold mb-2">Select New Date</label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={newDate}
                onChange={(e) => {
                  setNewDate(e.target.value);
                  setNewTimeSlot("");
                  fetchSlotsForDate(e.target.value);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-accent focus:outline-none"
              />

              {/* Time Slot Selection */}
              {newDate && availableSlots.length > 0 && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Select Time Slot</label>
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto mb-4">
                    {availableSlots.map((slot) => {
                      const isBooked = bookedSlots.includes(slot);
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => !isBooked && setNewTimeSlot(slot)}
                          disabled={isBooked}
                          className={`py-2 px-3 rounded-lg font-medium text-sm transition ${isBooked
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : newTimeSlot === slot
                              ? "bg-accent text-white"
                              : "bg-white border-2 border-gray-300 hover:border-accent"
                            }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {newDate && availableSlots.length === 0 && (
                <p className="text-red-500 text-sm mb-4">No available slots for this date.</p>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeRescheduleModal}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReschedule}
                  disabled={!newTimeSlot || rescheduling}
                  className={`flex-1 font-semibold py-3 rounded-lg transition ${!newTimeSlot || rescheduling
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-accent hover:bg-accent-600 text-white"
                    }`}
                >
                  {rescheduling ? "Rescheduling..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
