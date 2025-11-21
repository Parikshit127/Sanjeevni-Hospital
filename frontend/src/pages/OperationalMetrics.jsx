import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { FaChartLine, FaCalendarCheck } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function OperationalMetrics() {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${API_URL}/admin/analytics/operational`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMetrics(res.data.data);
            } catch (err) {
                console.error("Error fetching operational metrics:", err);
                setError("Failed to load metrics.");
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    if (loading)
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-[#67c0b3] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );

    if (error) return <div className="text-red-500 text-center p-10">{error}</div>;

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-[#2d3f4e] flex items-center gap-2">
                <FaChartLine className="text-[#67c0b3]" /> Operational Metrics
            </h2>

            {/* Key Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-semibold uppercase">No-Show Rate</p>
                            <p className="text-3xl font-bold text-gray-800">{metrics.noShowRate}%</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                            <FaCalendarCheck size={24} />
                        </div>
                    </div>
                </div>
                {/* Add more summary cards if needed */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Appointments Trend */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Appointments Trend (Last 30 Days)</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={metrics.appointmentsTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="_id" tick={{ fontSize: 12 }} tickFormatter={(str) => str.slice(5)} />
                                <YAxis allowDecimals={false} />
                                <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }} />
                                <Legend />
                                <Line type="monotone" dataKey="count" name="Appointments" stroke="#67c0b3" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Department Load */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Department-wise Patient Load</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={metrics.departmentLoad}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="count"
                                    nameKey="_id"
                                >
                                    {metrics.departmentLoad.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Doctor Performance */}
                <div className="bg-white p-6 rounded-xl shadow-lg lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Top Doctors by Patients Seen</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics.doctorPerformance} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                <XAxis type="number" allowDecimals={false} />
                                <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 14, fontWeight: 500 }} />
                                <Tooltip cursor={{ fill: "#f9fafb" }} contentStyle={{ borderRadius: "8px" }} />
                                <Bar dataKey="patientsSeen" name="Patients Seen" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={30}>
                                    {metrics.doctorPerformance.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
