import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FaClock, FaCalendarAlt, FaSave, FaCheck, FaTimes, FaRupeeSign, FaTrash } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function DoctorDashboard() {
    const { user } = useContext(AuthContext);
    const [doctor, setDoctor] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [schedule, setSchedule] = useState({
        startTime: "09:00",
        endTime: "17:00",
        lunchStart: "13:00",
        lunchEnd: "14:00",
        slotDuration: 15,
    });
    const [message, setMessage] = useState({ type: "", text: "" });
    const [activeTab, setActiveTab] = useState("upcoming");

    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                const resDoctors = await axios.get(`${API_URL}/doctors`);
                const myDoc = resDoctors.data.doctors.find(d => d.email === user.email);

                if (myDoc) {
                    setDoctor(myDoc);
                    setSchedule({
                        startTime: myDoc.startTime || "09:00",
                        endTime: myDoc.endTime || "17:00",
                        lunchStart: myDoc.lunchStart || "13:00",
                        lunchEnd: myDoc.lunchEnd || "14:00",
                        slotDuration: myDoc.slotDuration || 15,
                    });

                    fetchAppointments(myDoc._id);
                }
            } catch (error) {
                console.error("Error fetching doctor data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.email) {
            fetchDoctorData();
        }
    }, [user]);

    const fetchAppointments = async (doctorId) => {
        try {
            const resApps = await axios.get(`${API_URL}/doctors/${doctorId}/appointments`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setAppointments(resApps.data.appointments);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };

    const handleScheduleChange = (e) => {
        setSchedule({ ...schedule, [e.target.name]: e.target.value });
    };

    const saveSchedule = async () => {
        try {
            await axios.put(`${API_URL}/doctors/${doctor._id}`, schedule, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setMessage({ type: "success", text: "Schedule updated successfully!" });
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } catch (error) {
            setMessage({ type: "error", text: "Failed to update schedule." });
        }
    };

    const updateStatus = async (appointmentId, newStatus, newPaymentStatus) => {
        try {
            const payload = {};
            if (newStatus) payload.status = newStatus;
            if (newPaymentStatus) payload.paymentStatus = newPaymentStatus;

            await axios.put(`${API_URL}/doctors/appointments/${appointmentId}/status`, payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            // Refresh appointments
            fetchAppointments(doctor._id);
            setMessage({ type: "success", text: "Appointment updated successfully!" });
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } catch (error) {
            console.error("Error updating status:", error);
            setMessage({ type: "error", text: "Failed to update appointment." });
        }
    };

    const handleDelete = async (appointmentId) => {
        if (!window.confirm("Are you sure you want to permanently delete this appointment? This action cannot be undone.")) {
            return;
        }

        try {
            await axios.delete(`${API_URL}/appointments/${appointmentId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            // Refresh appointments
            fetchAppointments(doctor._id);
            setMessage({ type: "success", text: "Appointment deleted successfully!" });
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } catch (error) {
            console.error("Error deleting appointment:", error);
            setMessage({ type: "error", text: "Failed to delete appointment." });
        }
    };

    const filteredAppointments = appointments.filter(app => {
        if (activeTab === "upcoming") return app.status === "pending" || app.status === "confirmed";
        if (activeTab === "completed") return app.status === "completed";
        if (activeTab === "cancelled") return app.status === "cancelled";
        return true;
    });

    if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;
    if (!doctor) return <div className="p-10 text-center">Access Denied. You are not registered as a doctor.</div>;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Profile Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
                    <img
                        src={doctor.image || "https://via.placeholder.com/150"}
                        alt={doctor.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-[#67c0b3]"
                    />
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl font-bold text-[#2d3f4e] mb-2">{doctor.name}</h1>
                        <p className="text-[#67c0b3] font-semibold text-lg mb-1">{doctor.specialty}</p>
                        <p className="text-gray-600 mb-2">{doctor.qualification}</p>
                        <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-500">
                            <span>Experience: {doctor.experience} Years</span>
                            <span>•</span>
                            <span>Fee: ₹{doctor.consultationFee}</span>
                        </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center min-w-[200px]">
                        <p className="text-gray-600 text-sm font-semibold">Total Appointments</p>
                        <p className="text-3xl font-bold text-blue-600">{appointments.length}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Schedule Management */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#2d3f4e]">
                                <FaClock className="text-[#67c0b3]" /> Manage Schedule
                            </h2>

                            {message.text && (
                                <div className={`p-3 mb-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {message.text}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Start Time</label>
                                    <input type="time" name="startTime" value={schedule.startTime} onChange={handleScheduleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#67c0b3] focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">End Time</label>
                                    <input type="time" name="endTime" value={schedule.endTime} onChange={handleScheduleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#67c0b3] focus:outline-none" />
                                </div>
                                <div className="pt-2 border-t border-gray-200">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Lunch Start</label>
                                    <input type="time" name="lunchStart" value={schedule.lunchStart} onChange={handleScheduleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#67c0b3] focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Lunch End</label>
                                    <input type="time" name="lunchEnd" value={schedule.lunchEnd} onChange={handleScheduleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#67c0b3] focus:outline-none" />
                                </div>

                                <button onClick={saveSchedule} className="w-full bg-[#67c0b3] text-white py-3 rounded-lg font-semibold hover:bg-[#5ab0a3] flex items-center justify-center gap-2 transition shadow-md mt-4">
                                    <FaSave /> Update Schedule
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Appointments List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                                <h2 className="text-xl font-bold text-[#2d3f4e] flex items-center gap-2">
                                    <FaCalendarAlt className="text-[#67c0b3]" /> Appointments
                                </h2>
                                <div className="flex bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setActiveTab("upcoming")}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === "upcoming" ? "bg-white text-[#67c0b3] shadow" : "text-gray-500 hover:text-gray-700"}`}
                                    >
                                        Upcoming
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("completed")}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === "completed" ? "bg-white text-blue-600 shadow" : "text-gray-500 hover:text-gray-700"}`}
                                    >
                                        Completed
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("cancelled")}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === "cancelled" ? "bg-white text-red-600 shadow" : "text-gray-500 hover:text-gray-700"}`}
                                    >
                                        Cancelled
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                                            <th className="py-4 px-6 rounded-l-lg">Token</th>
                                            <th className="py-4 px-6">Patient</th>
                                            <th className="py-4 px-6">Date & Time</th>
                                            <th className="py-4 px-6">Payment</th>
                                            <th className="py-4 px-6 rounded-r-lg text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600 text-sm">
                                        {filteredAppointments.map((app) => (
                                            <tr key={app._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                                <td className="py-4 px-6">
                                                    <span className="bg-[#67c0b3] text-white px-3 py-1 rounded-full font-bold text-xs">
                                                        #{app.tokenNumber}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="font-semibold text-gray-800">{app.patientName}</div>
                                                    <div className="text-xs text-gray-500">{app.patientPhone}</div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="font-medium">{new Date(app.date).toLocaleDateString()}</div>
                                                    <div className="text-[#67c0b3] font-semibold">{app.timeSlot}</div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <button
                                                        onClick={() => updateStatus(app._id, null, app.paymentStatus === 'paid' ? 'pending' : 'paid')}
                                                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold border ${app.paymentStatus === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}
                                                    >
                                                        <FaRupeeSign size={10} /> {app.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                                                    </button>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex justify-center gap-2">
                                                        {activeTab === "upcoming" && (
                                                            <>
                                                                <button
                                                                    onClick={() => updateStatus(app._id, "completed")}
                                                                    className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                                                                    title="Mark Completed"
                                                                >
                                                                    <FaCheck />
                                                                </button>
                                                                <button
                                                                    onClick={() => updateStatus(app._id, "cancelled")}
                                                                    className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                                                                    title="Cancel Appointment"
                                                                >
                                                                    <FaTimes />
                                                                </button>
                                                            </>
                                                        )}
                                                        {activeTab !== "upcoming" && (
                                                            <>
                                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${app.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                                                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                                                </span>
                                                                <button
                                                                    onClick={() => handleDelete(app._id)}
                                                                    className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-red-100 hover:text-red-600 transition"
                                                                    title="Delete Appointment"
                                                                >
                                                                    <FaTrash size={12} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredAppointments.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-gray-400 text-lg">No {activeTab} appointments found.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
