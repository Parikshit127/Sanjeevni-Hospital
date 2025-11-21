import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    AreaChart,
    Area,
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
import { FaMoneyBillWave } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function FinancialMetrics() {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${API_URL}/admin/analytics/financial`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMetrics(res.data.data);
            } catch (err) {
                console.error("Error fetching financial metrics:", err);
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

    // Calculate Total Revenue for Summary Card
    const totalRevenue = metrics.revenueTrend.reduce((acc, curr) => acc + curr.revenue, 0);

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-[#2d3f4e] flex items-center gap-2">
                <FaMoneyBillWave className="text-[#67c0b3]" /> Financial Metrics
            </h2>

            {/* Key Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-semibold uppercase">Total Revenue (30d)</p>
                            <p className="text-3xl font-bold text-gray-800">₹{totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full text-green-600">
                            <FaMoneyBillWave size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Trend */}
                <div className="bg-white p-6 rounded-xl shadow-lg lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Revenue Trend (Last 30 Days)</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={metrics.revenueTrend}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="_id" tick={{ fontSize: 12 }} tickFormatter={(str) => str.slice(5)} />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <Tooltip formatter={(value) => `₹${value}`} contentStyle={{ borderRadius: "8px" }} />
                                <Area type="monotone" dataKey="revenue" stroke="#82ca9d" fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Doctors by Revenue */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Top Doctors by Revenue</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics.topDoctors} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12, fontWeight: 500 }} />
                                <Tooltip formatter={(value) => `₹${value}`} cursor={{ fill: "#f9fafb" }} contentStyle={{ borderRadius: "8px" }} />
                                <Bar dataKey="revenue" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={20}>
                                    {metrics.topDoctors.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue by Service Type */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Revenue by Service Type</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={metrics.revenueBySpecialty}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="revenue"
                                    nameKey="_id"
                                >
                                    {metrics.revenueBySpecialty.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `₹${value}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
