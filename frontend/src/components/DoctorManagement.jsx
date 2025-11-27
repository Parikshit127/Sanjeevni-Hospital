import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaUserMd, FaClock, FaCalendarAlt, FaSave } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

export default function DoctorManagement({ doctorId, onClose }) {
    const [doctor, setDoctor] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [schedule, setSchedule] = useState({
        startTime: '',
        endTime: '',
        lunchStart: '',
        lunchEnd: '',
        slotDuration: 15
    });

    const fetchDoctorData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('🔍 Fetching data for doctor:', doctorId);

            // Fetch doctor details
            const doctorRes = await axios.get(`${API_URL}/doctors/${doctorId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('✅ Doctor data:', doctorRes.data);
            setDoctor(doctorRes.data.doctor);
            setSchedule({
                startTime: doctorRes.data.doctor.startTime || '',
                endTime: doctorRes.data.doctor.endTime || '',
                lunchStart: doctorRes.data.doctor.lunchStart || '',
                lunchEnd: doctorRes.data.doctor.lunchEnd || '',
                slotDuration: doctorRes.data.doctor.slotDuration || 15
            });

            // Fetch doctor's appointments
            console.log('📋 Fetching appointments for doctor:', doctorId);
            const appointmentsRes = await axios.get(`${API_URL}/admin/doctors/${doctorId}/appointments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('✅ Appointments response:', appointmentsRes.data);
            console.log('📊 Number of appointments:', appointmentsRes.data.appointments?.length || 0);
            setAppointments(appointmentsRes.data.appointments || []);
        } catch (error) {
            console.error('❌ Error fetching doctor data:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
        } finally {
            setLoading(false);
        }
    }, [doctorId]);

    useEffect(() => {
        fetchDoctorData();
    }, [fetchDoctorData]);

    const handleScheduleUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/admin/doctors/${doctorId}/schedule`, schedule, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Schedule updated successfully!');
            fetchDoctorData();
        } catch (error) {
            alert('Failed to update schedule');
        }
    };

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/admin/appointments/${appointmentId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchDoctorData();
        } catch (error) {
            alert('Failed to update appointment status');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-primary text-white p-6 rounded-t-xl flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <FaUserMd /> Manage Dr. {doctor?.name}
                        </h2>
                        <p className="text-sm opacity-90">{doctor?.specialty}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 rounded-full p-2 transition"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Schedule Management */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                            <FaClock /> Schedule Management
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                                <input
                                    type="time"
                                    value={schedule.startTime}
                                    onChange={(e) => setSchedule({ ...schedule, startTime: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                                <input
                                    type="time"
                                    value={schedule.endTime}
                                    onChange={(e) => setSchedule({ ...schedule, endTime: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Slot Duration (min)</label>
                                <input
                                    type="number"
                                    value={schedule.slotDuration}
                                    onChange={(e) => setSchedule({ ...schedule, slotDuration: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Lunch Start</label>
                                <input
                                    type="time"
                                    value={schedule.lunchStart}
                                    onChange={(e) => setSchedule({ ...schedule, lunchStart: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Lunch End</label>
                                <input
                                    type="time"
                                    value={schedule.lunchEnd}
                                    onChange={(e) => setSchedule({ ...schedule, lunchEnd: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={handleScheduleUpdate}
                                    className="w-full bg-accent hover:bg-accent-600 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                                >
                                    <FaSave /> Save Schedule
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Appointments List */}
                    <div>
                        <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                            <FaCalendarAlt /> Appointments ({appointments.length})
                        </h3>
                        <div className="space-y-3">
                            {appointments.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    <FaCalendarAlt className="mx-auto text-4xl text-gray-300 mb-2" />
                                    <p className="text-gray-500">No appointments found for this doctor.</p>
                                </div>
                            ) : (
                                appointments.map((apt) => (
                                    <div key={apt._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-lg text-primary">{apt.patientName}</h4>
                                                <p className="text-sm text-gray-600">📧 {apt.patientEmail}</p>
                                                <p className="text-sm text-gray-600">📞 {apt.patientPhone}</p>
                                                <p className="text-sm text-gray-600 mt-2">
                                                    📅 {new Date(apt.date).toLocaleDateString()} at {apt.timeSlot}
                                                </p>
                                                {apt.reason && <p className="text-sm text-gray-600 mt-1">💬 {apt.reason}</p>}
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                    apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {apt.status}
                                                </span>
                                                {apt.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(apt._id, 'confirmed')}
                                                        className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                                    >
                                                        Confirm
                                                    </button>
                                                )}
                                                {apt.status === 'confirmed' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(apt._id, 'completed')}
                                                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                                    >
                                                        Complete
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
