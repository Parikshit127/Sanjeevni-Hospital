import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { FaMoneyBillWave, FaCalendarAlt, FaFilter } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function DoctorFinancialMetrics({ doctorId }) {
    const { user } = useContext(AuthContext);
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("monthly"); // daily, monthly, range
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const fetchMetrics = async () => {
            if (!doctorId) return;

            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${API_URL}/doctors/${doctorId}/analytics/financial`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        filter,
                        startDate,
                        endDate: filter === 'range' ? endDate : undefined
                    }
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
    }, [user, filter, startDate, endDate]);

    if (loading)
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );

    if (error) return <div className="text-red-500 text-center p-10">{error}</div>;
    if (!metrics) return null;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                    <FaMoneyBillWave className="text-accent" /> Financial Overview
                </h2>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-2 px-2 border-r">
                        <FaFilter className="text-gray-400" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-transparent font-medium text-gray-700 focus:outline-none"
                        >
                            <option value="daily">Daily</option>
                            <option value="monthly">Monthly</option>
                            <option value="range">Custom Range</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type={filter === 'monthly' ? "month" : "date"}
                            value={startDate.substring(0, filter === 'monthly' ? 7 : 10)}
                            onChange={(e) => {
                                if (filter === 'monthly') {
                                    setStartDate(`${e.target.value}-01`);
                                } else {
                                    setStartDate(e.target.value);
                                }
                            }}
                            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                        {filter === 'range' && (
                            <>
                                <span className="text-gray-400">-</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Key Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-semibold uppercase">Total Revenue</p>
                            <p className="text-3xl font-bold text-gray-800">₹{metrics.totalRevenue.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {filter === 'daily' ? 'For selected date' :
                                    filter === 'monthly' ? 'For selected month' : 'For selected range'}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full text-green-600">
                            <FaMoneyBillWave size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-semibold uppercase">Paid Appointments</p>
                            <p className="text-3xl font-bold text-gray-800">{metrics.appointmentCount}</p>
                            <p className="text-xs text-gray-500 mt-1">Total completed payments</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                            <FaCalendarAlt size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Revenue Trend Chart */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold text-gray-700 mb-4">Revenue Trend</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={metrics.revenueTrend}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="_id"
                                tick={{ fontSize: 12 }}
                                tickFormatter={(str) => {
                                    if (filter === 'daily') return str; // Show hours
                                    return str.slice(5); // Show MM-DD
                                }}
                            />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <Tooltip formatter={(value) => `₹${value}`} contentStyle={{ borderRadius: "8px" }} />
                            <Area type="monotone" dataKey="revenue" stroke="#82ca9d" fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
