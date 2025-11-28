import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
    FaClock,
    FaCalendarAlt,
    FaSave,
    FaCheck,
    FaTimes,
    FaRupeeSign,
    FaTrash,
} from "react-icons/fa";
import DoctorFinancialMetrics from "./DoctorFinancialMetrics";

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

    // 🔹 Filter state
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false); // controls "page" behavior
    const [filterMode, setFilterMode] = useState("today"); // 'all' | 'today' | 'date' | 'range' | 'month'
    const [selectedDate, setSelectedDate] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");

    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                const resDoctors = await axios.get(`${API_URL}/doctors`);
                const myDoc = resDoctors.data.doctors.find(
                    (d) => d.email === user.email
                );

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
            const resApps = await axios.get(
                `${API_URL}/doctors/${doctorId}/appointments`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
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
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setMessage({
                type: "success",
                text: "Schedule updated successfully!",
            });
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

            await axios.put(
                `${API_URL}/doctors/appointments/${appointmentId}/status`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            fetchAppointments(doctor._id);
            setMessage({
                type: "success",
                text: "Appointment updated successfully!",
            });
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } catch (error) {
            console.error("Error updating status:", error);
            setMessage({ type: "error", text: "Failed to update appointment." });
        }
    };

    const handleDelete = async (appointmentId) => {
        if (
            !window.confirm(
                "Are you sure you want to permanently delete this appointment? This action cannot be undone."
            )
        ) {
            return;
        }

        try {
            await axios.delete(`${API_URL}/appointments/${appointmentId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            fetchAppointments(doctor._id);
            setMessage({
                type: "success",
                text: "Appointment deleted successfully!",
            });
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } catch (error) {
            console.error("Error deleting appointment:", error);
            setMessage({ type: "error", text: "Failed to delete appointment." });
        }
    };

    // 🔹 Helpers
    const isSameDate = (d1, d2) => {
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        );
    };

    const parseYMD = (value) => {
        if (!value) return null;
        const d = new Date(value);
        return isNaN(d.getTime()) ? null : d;
    };

    // 🔹 Effective filter mode (simple page vs advanced page)
    const effectiveFilterMode = showAdvancedFilters ? filterMode : "today";

    // 🔹 Apply filters
    const filteredAppointments = appointments
        .slice()
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .filter((app) => {
            const appDate = new Date(app.date);

            if (effectiveFilterMode === "all") return true;

            if (effectiveFilterMode === "today") {
                const today = new Date();
                return isSameDate(appDate, today);
            }

            if (effectiveFilterMode === "date") {
                const target = parseYMD(selectedDate);
                if (!target) return true;
                return isSameDate(appDate, target);
            }

            if (effectiveFilterMode === "range") {
                const from = parseYMD(fromDate);
                const to = parseYMD(toDate);

                if (!from && !to) return true;
                if (from && appDate < from) return false;
                if (to) {
                    const toEnd = new Date(to);
                    toEnd.setHours(23, 59, 59, 999);
                    if (appDate > toEnd) return false;
                }
                return true;
            }

            if (effectiveFilterMode === "month") {
                if (!selectedMonth) return true;
                const [year, month] = selectedMonth.split("-");
                const appYear = appDate.getFullYear();
                const appMonth = appDate.getMonth() + 1;
                return appYear === Number(year) && appMonth === Number(month);
            }

            return true;
        });

    if (loading)
        return <div className="p-10 text-center">Loading Dashboard...</div>;
    if (!doctor)
        return (
            <div className="p-10 text-center">
                Access Denied. You are not registered as a doctor.
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Profile Section – improved UI, same white background */}
                <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 mb-10 border border-gray-100">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* LEFT — Avatar */}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-accent/20 shadow-lg">
                                <img
                                    src={
                                        doctor.image
                                            ? doctor.image.startsWith('http')
                                                ? doctor.image
                                                : `${API_URL.replace('/api', '')}${doctor.image}`
                                            : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect fill='%23e0e0e0' width='150' height='150'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='16' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EDoctor%3C/text%3E%3C/svg%3E"
                                    }
                                    alt={doctor.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect fill='%23e0e0e0' width='150' height='150'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='16' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EDoctor%3C/text%3E%3C/svg%3E";
                                    }}
                                />
                            </div>

                            {/* Specialty Tag */}
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                                {doctor.specialty || "Specialist"}
                            </div>
                        </div>

                        {/* CENTER — Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-primary">
                                {doctor.name}
                            </h1>

                            {doctor.qualification && (
                                <p className="text-gray-500 mt-1 text-sm">
                                    {doctor.qualification}
                                </p>
                            )}

                            {/* Info pills */}
                            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                                <div className="px-3 py-1 rounded-full border border-gray-200 text-gray-700 text-xs">
                                    Experience:{" "}
                                    <span className="font-semibold">
                                        {doctor.experience} Years
                                    </span>
                                </div>

                                <div className="px-3 py-1 rounded-full border border-gray-200 text-gray-700 text-xs">
                                    Fee:{" "}
                                    <span className="font-semibold">
                                        ₹{doctor.consultationFee}
                                    </span>
                                </div>

                                {(schedule.startTime || schedule.endTime) && (
                                    <div className="px-3 py-1 rounded-full border border-gray-200 text-gray-700 text-xs">
                                        Timings:{" "}
                                        <span className="font-semibold">
                                            {schedule.startTime} - {schedule.endTime}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT — Stats */}
                        <div className="grid grid-cols-2 gap-3 md:gap-4 w-full md:w-auto mt-6 md:mt-0">
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center shadow-sm">
                                <p className="text-gray-500 text-xs font-semibold tracking-wide">
                                    Total Appointments
                                </p>
                                <p className="text-2xl font-bold text-primary mt-1">
                                    {appointments.length}
                                </p>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center shadow-sm">
                                <p className="text-gray-500 text-xs font-semibold tracking-wide">
                                    Today
                                </p>
                                <p className="font-semibold mt-1 text-gray-800">
                                    {new Date().toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Schedule Management */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 lg:sticky lg:top-24">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
                                <FaClock className="text-accent" /> Manage Schedule
                            </h2>

                            {message.text && (
                                <div
                                    className={`p-3 mb-4 rounded-lg text-sm ${message.type === "success"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {message.text}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={schedule.startTime}
                                        onChange={handleScheduleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        End Time
                                    </label>
                                    <input
                                        type="time"
                                        name="endTime"
                                        value={schedule.endTime}
                                        onChange={handleScheduleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
                                    />
                                </div>
                                <div className="pt-2 border-t border-gray-200">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Lunch Start
                                    </label>
                                    <input
                                        type="time"
                                        name="lunchStart"
                                        value={schedule.lunchStart}
                                        onChange={handleScheduleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Lunch End
                                    </label>
                                    <input
                                        type="time"
                                        name="lunchEnd"
                                        value={schedule.lunchEnd}
                                        onChange={handleScheduleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
                                    />
                                </div>

                                <button
                                    onClick={saveSchedule}
                                    className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent-600 flex items-center justify-center gap-2 transition shadow-md mt-4"
                                >
                                    <FaSave /> Update Schedule
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Appointments List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            {/* Header + Simple/Advanced toggle */}
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                                        <FaCalendarAlt className="text-accent" /> Appointments
                                    </h2>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {showAdvancedFilters
                                            ? "Viewing appointments with advanced filters."
                                            : "Showing only today’s appointments."}
                                    </p>
                                </div>

                                <button
                                    onClick={() => setShowAdvancedFilters((prev) => !prev)}
                                    className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border border-accent text-accent hover:bg-accent hover:text-white transition"
                                >
                                    {showAdvancedFilters ? "Back to today view" : "See more"}
                                </button>
                            </div>

                            {/* Advanced Filter Bar – only if See More is clicked */}
                            {showAdvancedFilters && (
                                <div className="bg-gray-50 rounded-xl p-3 mb-5 flex flex-col gap-3">
                                    <div className="flex flex-wrap gap-2 text-xs font-medium">
                                        <button
                                            onClick={() => {
                                                setFilterMode("all");
                                                setSelectedDate("");
                                                setFromDate("");
                                                setToDate("");
                                                setSelectedMonth("");
                                            }}
                                            className={`px-3 py-1 rounded-full border ${filterMode === "all"
                                                ? "bg-accent text-white border-accent"
                                                : "border-gray-300 text-gray-700 hover:bg-white"
                                                }`}
                                        >
                                            All
                                        </button>
                                        <button
                                            onClick={() => {
                                                setFilterMode("today");
                                                setSelectedDate("");
                                                setFromDate("");
                                                setToDate("");
                                                setSelectedMonth("");
                                            }}
                                            className={`px-3 py-1 rounded-full border ${filterMode === "today"
                                                ? "bg-accent text-white border-accent"
                                                : "border-gray-300 text-gray-700 hover:bg-white"
                                                }`}
                                        >
                                            Today
                                        </button>
                                        <button
                                            onClick={() => {
                                                setFilterMode("date");
                                                setFromDate("");
                                                setToDate("");
                                                setSelectedMonth("");
                                            }}
                                            className={`px-3 py-1 rounded-full border ${filterMode === "date"
                                                ? "bg-accent text-white border-accent"
                                                : "border-gray-300 text-gray-700 hover:bg-white"
                                                }`}
                                        >
                                            Specific Date
                                        </button>
                                        <button
                                            onClick={() => {
                                                setFilterMode("range");
                                                setSelectedDate("");
                                                setSelectedMonth("");
                                            }}
                                            className={`px-3 py-1 rounded-full border ${filterMode === "range"
                                                ? "bg-accent text-white border-accent"
                                                : "border-gray-300 text-gray-700 hover:bg-white"
                                                }`}
                                        >
                                            Date Range
                                        </button>
                                        <button
                                            onClick={() => {
                                                setFilterMode("month");
                                                setSelectedDate("");
                                                setFromDate("");
                                                setToDate("");
                                            }}
                                            className={`px-3 py-1 rounded-full border ${filterMode === "month"
                                                ? "bg-accent text-white border-accent"
                                                : "border-gray-300 text-gray-700 hover:bg-white"
                                                }`}
                                        >
                                            Month
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 text-xs">
                                        {filterMode === "date" && (
                                            <div className="flex items-center gap-1">
                                                <span className="text-gray-500">Date:</span>
                                                <input
                                                    type="date"
                                                    value={selectedDate}
                                                    onChange={(e) =>
                                                        setSelectedDate(e.target.value)
                                                    }
                                                    className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-accent"
                                                />
                                            </div>
                                        )}

                                        {filterMode === "range" && (
                                            <>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-gray-500">From:</span>
                                                    <input
                                                        type="date"
                                                        value={fromDate}
                                                        onChange={(e) =>
                                                            setFromDate(e.target.value)
                                                        }
                                                        className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-accent"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-gray-500">To:</span>
                                                    <input
                                                        type="date"
                                                        value={toDate}
                                                        onChange={(e) =>
                                                            setToDate(e.target.value)
                                                        }
                                                        className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-accent"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {filterMode === "month" && (
                                            <div className="flex items-center gap-1">
                                                <span className="text-gray-500">Month:</span>
                                                <input
                                                    type="month"
                                                    value={selectedMonth}
                                                    onChange={(e) =>
                                                        setSelectedMonth(e.target.value)
                                                    }
                                                    className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-accent"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                                            <th className="py-3 px-4 rounded-l-lg">Token</th>
                                            <th className="py-3 px-4">Patient</th>
                                            <th className="py-3 px-4">Date & Time</th>
                                            <th className="py-3 px-4">Payment</th>
                                            <th className="py-3 px-4">Status</th>
                                            <th className="py-3 px-4 rounded-r-lg text-center">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-700 text-sm">
                                        {filteredAppointments.map((app) => (
                                            <tr
                                                key={app._id}
                                                className="border-b border-gray-100 hover:bg-gray-50 transition"
                                            >
                                                <td className="py-3 px-4">
                                                    <span className="bg-accent text-white px-3 py-1 rounded-full font-bold text-xs">
                                                        #{app.tokenNumber}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="font-semibold text-gray-900">
                                                        {app.patientName}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {app.patientPhone}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="font-medium">
                                                        {new Date(
                                                            app.date
                                                        ).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-accent font-semibold">
                                                        {app.timeSlot}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <button
                                                        onClick={() =>
                                                            updateStatus(
                                                                app._id,
                                                                null,
                                                                app.paymentStatus === "paid"
                                                                    ? "pending"
                                                                    : "paid"
                                                            )
                                                        }
                                                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold border ${app.paymentStatus === "paid"
                                                            ? "bg-green-50 text-green-700 border-green-200"
                                                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                                            }`}
                                                    >
                                                        <FaRupeeSign size={10} />{" "}
                                                        {app.paymentStatus === "paid"
                                                            ? "Paid"
                                                            : "Pending"}
                                                    </button>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${app.status === "booked"
                                                            ? "bg-green-100 text-green-700"
                                                            : app.status === "cancelled"
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-gray-100 text-gray-700"
                                                            }`}
                                                    >
                                                        {app.status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            app.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex justify-center gap-2">
                                                        {app.status === "booked" && (
                                                            <button
                                                                onClick={() =>
                                                                    updateStatus(
                                                                        app._id,
                                                                        "cancelled"
                                                                    )
                                                                }
                                                                className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                                                                title="Cancel Appointment"
                                                            >
                                                                <FaTimes />
                                                            </button>
                                                        )}

                                                        {app.status === "cancelled" && (
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(app._id)
                                                                }
                                                                className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-red-100 hover:text-red-600 transition"
                                                                title="Delete Appointment"
                                                            >
                                                                <FaTrash size={12} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {filteredAppointments.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-gray-400 text-lg">
                                            No appointments found for this view.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financial Metrics Section */}
                <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
                    <DoctorFinancialMetrics doctorId={doctor._id} />
                </div>
            </div>
        </div>
    );
}
