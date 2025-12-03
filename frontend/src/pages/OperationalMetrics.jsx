import React, { useState, useEffect, useCallback } from "react";
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
import { FaChartLine, FaCalendarCheck, FaFilter, FaSync, FaUserMd, FaUsers } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#FF6B9D"];

export default function OperationalMetrics() {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [filterType, setFilterType] = useState("30days"); // 'today', '7days', '30days', 'custom'
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showFilterPanel, setShowFilterPanel] = useState(false);

    const fetchMetrics = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            // Build query params based on filter
            let params = {};
            const today = new Date();

            if (filterType === "today") {
                params.startDate = today.toISOString().split('T')[0];
                params.endDate = today.toISOString().split('T')[0];
            } else if (filterType === "7days") {
                const sevenDaysAgo = new Date(today);
                sevenDaysAgo.setDate(today.getDate() - 7);
                params.startDate = sevenDaysAgo.toISOString().split('T')[0];
                params.endDate = today.toISOString().split('T')[0];
            } else if (filterType === "30days") {
                const thirtyDaysAgo = new Date(today);
                thirtyDaysAgo.setDate(today.getDate() - 30);
                params.startDate = thirtyDaysAgo.toISOString().split('T')[0];
                params.endDate = today.toISOString().split('T')[0];
            } else if (filterType === "custom" && startDate && endDate) {
                params.startDate = startDate;
                params.endDate = endDate;
            }

            console.log('🔍 Fetching metrics with params:', params);

            const res = await axios.get(`${API_URL}/admin/analytics/operational`, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });
            setMetrics(res.data.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching operational metrics:", err);
            setError("Failed to load metrics.");
        } finally {
            setLoading(false);
        }
    }, [filterType, startDate, endDate]);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    const handleRefresh = () => {
        fetchMetrics();
    };

    const getFilterLabel = () => {
        switch (filterType) {
            case "today": return "Today";
            case "7days": return "Last 7 Days";
            case "30days": return "Last 30 Days";
            case "custom": return `${startDate || '...'} to ${endDate || '...'} `;
            default: return "Last 30 Days";
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading operational metrics...</p>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center">
                <p className="font-bold text-lg mb-2">Error Loading Metrics</p>
                <p className="mb-4">{error}</p>
                <button
                    onClick={handleRefresh}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                    Retry
                </button>
            </div>
        );

    return (
        <div className="space-y-6">
            {/* Header with Filters */}
            <div className="bg-gradient-to-r from-primary to-accent rounded-xl shadow-lg p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-3 rounded-lg">
                            <FaChartLine className="text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold">Operational Metrics</h2>
                            <p className="text-sm text-white/80 mt-1">Period: {getFilterLabel()}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowFilterPanel(!showFilterPanel)}
                            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg font-semibold transition text-sm"
                        >
                            <FaFilter />
                            <span className="hidden sm:inline">Filters</span>
                        </button>
                        <button
                            onClick={handleRefresh}
                            className="flex items-center gap-2 bg-white text-primary hover:bg-white/90 px-4 py-2 rounded-lg font-semibold transition text-sm"
                        >
                            <FaSync className={loading ? "animate-spin" : ""} />
                            <span className="hidden sm:inline">Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilterPanel && (
                    <div className="mt-6 bg-white/10 backdrop-blur-md rounded-lg p-4 space-y-4">
                        <div className="flex flex-wrap gap-3">
                            {[
                                { value: "today", label: "Today" },
                                { value: "7days", label: "Last 7 Days" },
                                { value: "30days", label: "Last 30 Days" },
                                { value: "custom", label: "Custom Range" }
                            ].map((filter) => (
                                <button
                                    key={filter.value}
                                    onClick={() => setFilterType(filter.value)}
                                    className={`px - 4 py - 2 rounded - lg font - semibold transition text - sm ${filterType === filter.value
                                        ? "bg-white text-primary shadow-lg"
                                        : "bg-white/20 hover:bg-white/30"
                                        } `}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>

                        {/* Custom Date Range */}
                        {filterType === "custom" && (
                            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                                <div className="flex items-center gap-2 text-sm">
                                    <label className="font-semibold whitespace-nowrap">From:</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        max={endDate || new Date().toISOString().split('T')[0]}
                                        className="px-3 py-2 rounded-lg bg-white/90 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-white"
                                    />
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <label className="font-semibold whitespace-nowrap">To:</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        min={startDate}
                                        max={new Date().toISOString().split('T')[0]}
                                        className="px-3 py-2 rounded-lg bg-white/90 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-white"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Key Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm text-gray-500 font-semibold uppercase tracking-wide">Total Appointments</p>
                            <p className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
                                {metrics.appointmentsTrend?.reduce((sum, item) => sum + item.count, 0) || 0}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                            <FaCalendarCheck size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm text-gray-500 font-semibold uppercase tracking-wide">Active Doctors</p>
                            <p className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
                                {metrics.doctorPerformance?.length || 0}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full text-green-600">
                            <FaUserMd size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm text-gray-500 font-semibold uppercase tracking-wide">Total Patients</p>
                            <p className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
                                {metrics.doctorPerformance?.reduce((sum, doc) => sum + doc.patientsSeen, 0) || 0}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                            <FaUsers size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500 hover:shadow-xl transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm text-gray-500 font-semibold uppercase tracking-wide">No-Show Rate</p>
                            <p className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
                                {metrics.noShowRate || 0}%
                            </p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-full text-red-600">
                            <FaCalendarCheck size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Appointments Trend */}
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-accent rounded"></span>
                        Appointments Trend
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={metrics.appointmentsTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="_id"
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(str) => str.slice(5)}
                                />
                                <YAxis allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "12px",
                                        border: "none",
                                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                        padding: "12px"
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    name="Appointments"
                                    stroke="#5a8a5a"
                                    strokeWidth={3}
                                    dot={{ r: 5, fill: "#5a8a5a" }}
                                    activeDot={{ r: 7 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Department Load */}
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-accent rounded"></span>
                        Department-wise Patient Load
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={metrics.departmentLoad}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}% `}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="count"
                                    nameKey="_id"
                                >
                                    {metrics.departmentLoad?.map((entry, index) => (
                                        <Cell key={`cell - ${index} `} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Doctor Performance */}
                <div className="bg-white p-6 rounded-xl shadow-lg lg:col-span-2 hover:shadow-xl transition">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-accent rounded"></span>
                        Top Doctors by Patients Seen
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics.doctorPerformance} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                <XAxis type="number" allowDecimals={false} />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={150}
                                    tick={{ fontSize: 13, fontWeight: 500 }}
                                />
                                <Tooltip
                                    cursor={{ fill: "#f9fafb" }}
                                    contentStyle={{ borderRadius: "12px", padding: "12px" }}
                                />
                                <Bar
                                    dataKey="patientsSeen"
                                    name="Patients Seen"
                                    fill="#8884d8"
                                    radius={[0, 8, 8, 0]}
                                    barSize={30}
                                >
                                    {metrics.doctorPerformance?.map((entry, index) => (
                                        <Cell key={`cell - ${index} `} fill={COLORS[index % COLORS.length]} />
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
