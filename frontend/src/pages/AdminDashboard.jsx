import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import axios from "axios";
import {
  FaUsers,
  FaUserMd,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaChartLine,
  FaHome,
  FaPlusCircle,
  FaEdit,
  FaTrash,
  FaUserInjured,
} from "react-icons/fa";
import OperationalMetrics from "./OperationalMetrics";
import FinancialMetrics from "./FinancialMetrics";
import PatientsManagement from "./PatientsManagement";
import DoctorManagement from "../components/DoctorManagement";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance with auth interceptor
const createAxiosConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

// Dashboard Home Component
function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const config = createAxiosConfig();

      const [statsRes, appointmentsRes, revenueRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`, config),
        axios.get(`${API_URL}/admin/appointments-chart`, config),
        axios.get(`${API_URL}/admin/revenue-chart`, config),
      ]);

      setStats(statsRes.data.stats || {});
      setAppointmentsData(appointmentsRes.data.data || []);
      setRevenueData(revenueRes.data.data || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);

      if (error.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else {
        setError("Failed to load dashboard data");
      }

      // Set default empty stats to prevent errors
      setStats({
        totalPatients: 0,
        totalDoctors: 0,
        totalAppointments: 0,
        todayAppointments: 0,
        totalRevenue: 0,
        thisMonthRevenue: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/admin/patients">
          <StatCard
            icon={<FaUsers />}
            title="Total Patients"
            value={stats?.totalPatients || 0}
            color="bg-primary-600"
          />
        </Link>
        <Link to="/admin/doctors">
          <StatCard
            icon={<FaUserMd />}
            title="Total Doctors"
            value={stats?.totalDoctors || 0}
            color="bg-accent-600"
          />
        </Link>
        <Link to="/admin/appointments">
          <StatCard
            icon={<FaCalendarCheck />}
            title="Appointments"
            value={stats?.totalAppointments || 0}
            subtitle={`${stats?.todayAppointments || 0} today`}
            color="bg-primary-500"
          />
        </Link>
        <Link to="/admin/financial">
          <StatCard
            icon={<FaMoneyBillWave />}
            title="Total Revenue"
            value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
            subtitle={`₹${(
              stats?.thisMonthRevenue || 0
            ).toLocaleString()} this month`}
            color="bg-accent-500"
          />
        </Link>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaChartLine className="text-accent" />
            Appointments (Last 7 Days)
          </h3>
          {appointmentsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={appointmentsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#5a8a5a"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              <p>No appointment data available</p>
            </div>
          )}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaMoneyBillWave className="text-accent" />
            Revenue (Last 6 Months)
          </h3>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#5a8a5a" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              <p>No revenue data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, title, value, subtitle, color }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-semibold mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`${color} text-white p-4 rounded-full text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Appointments Management Component
function AppointmentsManagement() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterMode, setFilterMode] = useState("today"); // 'all' | 'today' | 'date' | 'range' | 'month'
  const [selectedDate, setSelectedDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const config = createAxiosConfig();
      const res = await axios.get(`${API_URL}/admin/appointments`, config);
      setAppointments(res.data.appointments || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else {
        setError("Failed to load appointments");
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter helpers
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

  // Effective filter mode
  const effectiveFilterMode = showAdvancedFilters ? filterMode : "today";

  // Apply filters
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <button
          onClick={fetchAppointments}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header with filter toggle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Appointments ({filteredAppointments.length} of {appointments.length})
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {showAdvancedFilters
              ? "Viewing appointments with advanced filters."
              : "Showing only today's appointments."}
          </p>
        </div>

        <button
          onClick={() => setShowAdvancedFilters((prev) => !prev)}
          className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-accent text-accent hover:bg-accent hover:text-white transition"
        >
          {showAdvancedFilters ? "Back to today view" : "See more"}
        </button>
      </div>

      {/* Advanced Filter Bar */}
      {showAdvancedFilters && (
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => {
                setFilterMode("all");
                setSelectedDate("");
                setFromDate("");
                setToDate("");
                setSelectedMonth("");
              }}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${filterMode === "all"
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
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${filterMode === "today"
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
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${filterMode === "date"
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
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${filterMode === "range"
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
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${filterMode === "month"
                ? "bg-accent text-white border-accent"
                : "border-gray-300 text-gray-700 hover:bg-white"
                }`}
            >
              Month
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            {filterMode === "date" && (
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">Date:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            )}

            {filterMode === "range" && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium">From:</span>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium">To:</span>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </>
            )}

            {filterMode === "month" && (
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">Month:</span>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Appointments Table */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <FaCalendarCheck className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No appointments found for this view</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm whitespace-nowrap">Token</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm whitespace-nowrap">Patient</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm whitespace-nowrap">Contact</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm whitespace-nowrap">Doctor</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm whitespace-nowrap">Date & Time</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm whitespace-nowrap">Fee</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm whitespace-nowrap">Status</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm whitespace-nowrap">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAppointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className="bg-accent text-white px-2 sm:px-3 py-1 rounded-full font-bold text-xs">
                        #{apt.tokenNumber}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <p className="font-semibold text-gray-900 text-xs sm:text-sm">{apt.patientName}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <p className="text-xs sm:text-sm text-gray-600">{apt.patientEmail}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{apt.patientPhone}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <p className="font-medium text-xs sm:text-sm">{apt.doctorId?.name || "N/A"}</p>
                      {apt.doctorId?.specialty && (
                        <p className="text-xs text-gray-500">{apt.doctorId.specialty}</p>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <p className="font-medium text-xs sm:text-sm">{new Date(apt.date).toLocaleDateString()}</p>
                      <p className="text-xs sm:text-sm text-accent font-semibold">{apt.timeSlot}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-green-600 text-xs sm:text-sm">
                      ₹{apt.consultationFee}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold ${apt.status === "booked"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {apt.status === "booked" ? "Booked" : "Cancelled"}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        Paid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Doctors Management Component
function DoctorsManagement() {
  const [doctors, setDoctors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [managingDoctor, setManagingDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    qualification: "",
    experience: "",
    consultationFee: "",
    email: "",
    phone: "",
    image: "",
    about: "",
    password: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const config = createAxiosConfig();
      const res = await axios.get(`${API_URL}/admin/all-doctors`, config);
      setDoctors(res.data.doctors || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else {
        setError("Failed to load doctors");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return null;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', selectedFile);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      const response = await axios.post(
        `${API_URL}/upload/image`,
        uploadFormData,
        config
      );

      return response.data.imagePath;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image: ' + (error.response?.data?.message || error.message));
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = createAxiosConfig();

      // Upload image first if a new file is selected
      let imageUrl = formData.image;
      if (selectedFile) {
        const uploadedPath = await uploadImage();
        if (uploadedPath) {
          imageUrl = uploadedPath;
        } else {
          // If upload failed and there's no existing image, don't proceed
          if (!formData.image) {
            alert('Please try uploading the image again');
            return;
          }
        }
      }

      if (editingDoctor) {
        // Construct a clean payload with only allowed fields
        const updateData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          specialty: formData.specialty,
          qualification: formData.qualification,
          experience: formData.experience,
          consultationFee: formData.consultationFee,
          startTime: formData.startTime,
          endTime: formData.endTime,
          lunchStart: formData.lunchStart,
          lunchEnd: formData.lunchEnd,
          slotDuration: formData.slotDuration,
          image: imageUrl,
          about: formData.about
        };

        // Only include password if it has a value
        if (formData.password && formData.password.trim() !== "") {
          updateData.password = formData.password;
        }

        console.log("Updating doctor with clean data:", updateData);
        const url = `${API_URL}/doctors/${editingDoctor._id}`;
        console.log("PUT URL:", url);

        await axios.put(
          url,
          updateData,
          config
        );
      } else {
        const createData = { ...formData, image: imageUrl };
        console.log("Creating doctor with data:", createData);
        await axios.post(`${API_URL}/doctors`, createData, config);
      }
      fetchDoctors();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving doctor:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      alert(
        "Failed to save doctor: " +
        (error.response?.data?.message || error.message)
      );
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData(doctor);
    setSelectedFile(null);
    setImagePreview(doctor.image || "");
    setShowModal(true);
  };

  const handleDelete = async (doctorId) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      const config = createAxiosConfig();
      await axios.delete(`${API_URL}/doctors/${doctorId}`, config);
      fetchDoctors();
    } catch (error) {
      console.error("Error deleting doctor:", error);
      alert("Failed to delete doctor");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      specialty: "",
      qualification: "",
      experience: "",
      consultationFee: "",
      email: "",
      phone: "",
      image: "",
      about: "",
      password: "",
    });
    setSelectedFile(null);
    setImagePreview("");
    setEditingDoctor(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <button
          onClick={fetchDoctors}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Manage Doctors ({doctors.length})
        </h2>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-accent hover:bg-accent-600 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition"
        >
          <FaPlusCircle /> Add New Doctor
        </button>
      </div>

      {/* Doctors Grid */}
      {doctors.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <FaUserMd className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            No doctors found. Add your first doctor!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition"
            >
              <img
                src={
                  doctor.image
                    ? doctor.image.startsWith('http')
                      ? doctor.image
                      : `${API_URL.replace('/api', '')}${doctor.image}`
                    : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e0e0e0' width='400' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='24' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EDoctor%3C/text%3E%3C/svg%3E"
                }
                alt={doctor.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e0e0e0' width='400' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='24' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EDoctor%3C/text%3E%3C/svg%3E";
                }}
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {doctor.name}
                </h3>
                <p className="text-accent font-semibold mb-2">
                  {doctor.specialty}
                </p>
                <p className="text-gray-600 text-sm mb-3">
                  {doctor.qualification}
                </p>
                <p className="text-lg font-semibold text-accent-700 mb-4">
                  ₹{doctor.consultationFee}
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setManagingDoctor(doctor._id)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <FaUserMd /> Manage
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(doctor)}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(doctor._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Doctor Name *"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
                <input
                  type="text"
                  placeholder="Specialty *"
                  value={formData.specialty}
                  onChange={(e) =>
                    setFormData({ ...formData, specialty: e.target.value })
                  }
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
                <input
                  type="text"
                  placeholder="Qualification *"
                  value={formData.qualification}
                  onChange={(e) =>
                    setFormData({ ...formData, qualification: e.target.value })
                  }
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
                <input
                  type="number"
                  placeholder="Experience (years) *"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
                <input
                  type="number"
                  placeholder="Consultation Fee *"
                  value={formData.consultationFee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      consultationFee: e.target.value,
                    })
                  }
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
                <input
                  type="password"
                  placeholder={editingDoctor ? "New Password (leave blank to keep)" : "Password *"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required={!editingDoctor}
                />
                <input
                  type="tel"
                  placeholder="Phone *"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              {/* Image Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Doctor Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload an image (max 5MB). Supported formats: JPG, PNG, GIF, WebP
                </p>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-3">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Preview:</p>
                    <img
                      src={imagePreview.startsWith('http') || imagePreview.startsWith('/')
                        ? `${API_URL.replace('/api', '')}${imagePreview}`
                        : imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect fill='%23e0e0e0' width='150' height='150'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='16' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EDoctor%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                )}
              </div>

              <textarea
                placeholder="About Doctor"
                value={formData.about}
                onChange={(e) =>
                  setFormData({ ...formData, about: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                rows="3"
              ></textarea>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className={`flex-1 py-3 rounded-lg font-semibold transition text-sm sm:text-base ${uploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-accent hover:bg-accent-600 text-white'
                    }`}
                >
                  {uploading ? 'Uploading...' : editingDoctor ? "Update Doctor" : "Add Doctor"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-lg font-semibold transition text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doctor Management Modal */}
      {managingDoctor && (
        <DoctorManagement
          doctorId={managingDoctor}
          onClose={() => setManagingDoctor(null)}
        />
      )}
    </div>
  );
}

// Main Admin Dashboard Component
export default function AdminDashboard() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: <FaHome /> },
    {
      path: "/admin/appointments",
      label: "Appointments",
      icon: <FaCalendarCheck />,
    },
    { path: "/admin/doctors", label: "Doctors", icon: <FaUserMd /> },
    { path: "/admin/patients", label: "Patients", icon: <FaUserInjured /> },
    { path: "/admin/operational", label: "Operational Metrics", icon: <FaChartLine /> },
    { path: "/admin/financial", label: "Financial Metrics", icon: <FaMoneyBillWave /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="flex">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed top-24 left-4 z-50 bg-primary-900 text-white p-3 rounded-lg shadow-lg hover:bg-primary-800 transition"
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isSidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 top-20"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            w-64 bg-primary-900 text-white min-h-screen p-6 fixed left-0 top-20 z-40 transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${currentPath === item.path
                  ? "bg-accent text-white"
                  : "hover:bg-gray-700"
                  }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64 w-full">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/appointments" element={<AppointmentsManagement />} />
            <Route path="/doctors" element={<DoctorsManagement />} />
            <Route path="/patients" element={<PatientsManagement />} />
            <Route path="/operational" element={<OperationalMetrics />} />
            <Route path="/financial" element={<FinancialMetrics />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
