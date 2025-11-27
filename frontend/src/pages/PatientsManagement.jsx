import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUsers, FaUserInjured, FaSearch, FaStethoscope, FaTrash } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function PatientsManagement() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_URL}/admin/patients`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPatients(res.data.data || []);
            setError(null);
        } catch (err) {
            console.error("Error fetching patients:", err);
            setError("Failed to load patients.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (patientId, patientName) => {
        if (!window.confirm(`Are you sure you want to delete ${patientName}? This action cannot be undone.`)) {
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/admin/users/${patientId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Refresh the patient list
            fetchPatients();
        } catch (err) {
            console.error("Error deleting patient:", err);
            alert("Failed to delete patient. Please try again.");
        }
    };

    const filteredPatients = patients.filter(
        (patient) =>
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.phone.includes(searchTerm)
    );

    if (loading)
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );

    if (error) return <div className="text-red-500 text-center p-10">{error}</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                    <FaUserInjured className="text-accent" /> Patients Management
                </h2>
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search patients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-semibold uppercase">Total Patients</p>
                            <p className="text-3xl font-bold text-gray-800">{patients.length}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                            <FaUsers size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Patients Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-primary text-white">
                            <tr>
                                <th className="px-6 py-3 text-left">Patient Name</th>
                                <th className="px-6 py-3 text-left">Contact Info</th>
                                <th className="px-6 py-3 text-left">Appointments</th>
                                <th className="px-6 py-3 text-left">Last Visit</th>
                                <th className="px-6 py-3 text-left">Doctors Visited</th>
                                <th className="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredPatients.length > 0 ? (
                                filteredPatients.map((patient) => (
                                    <tr key={patient._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-800">{patient.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <p className="text-gray-800">{patient.email}</p>
                                                <p className="text-gray-500">{patient.phone}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                {patient.totalAppointments}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {patient.lastAppointment
                                                ? new Date(patient.lastAppointment).toLocaleDateString()
                                                : "Never"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                {patient.doctorsVisited.length > 0 ? (
                                                    patient.doctorsVisited.map((doc, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs border border-green-200"
                                                        >
                                                            <FaStethoscope size={10} /> {doc}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400 text-sm italic">None</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleDelete(patient._id, patient.name)}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                                                title="Delete Patient"
                                            >
                                                <FaTrash size={12} /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No patients found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
