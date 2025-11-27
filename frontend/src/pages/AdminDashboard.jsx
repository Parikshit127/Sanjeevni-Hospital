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

  const updateStatus = async (appointmentId, status, paymentStatus) => {
    try {
      const config = createAxiosConfig();
      await axios.put(
        `${API_URL}/admin/appointments/${appointmentId}/status`,
        { status, paymentStatus },
        config
      );
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert("Failed to update appointment");
    }
  };

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

  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <FaCalendarCheck className="text-6xl text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No appointments found</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        All Appointments ({appointments.length})
      </h2>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-6 py-3 text-left">Patient</th>
                <th className="px-6 py-3 text-left">Doctor</th>
                <th className="px-6 py-3 text-left">Date & Time</th>
                <th className="px-6 py-3 text-left">Fee</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {appointments.map((apt) => (
                <tr key={apt._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold">{apt.patientName}</p>
                      <p className="text-sm text-gray-600">
                        {apt.patientEmail}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{apt.doctorId?.name || "N/A"}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p>{new Date(apt.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">{apt.timeSlot}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    ₹{apt.consultationFee}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={apt.status}
                      onChange={(e) =>
                        updateStatus(apt._id, e.target.value, apt.paymentStatus)
                      }
                      className="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={apt.paymentStatus}
                      onChange={(e) =>
                        updateStatus(apt._id, apt.status, e.target.value)
                      }
                      className="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = createAxiosConfig();
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
          image: formData.image,
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
        console.log("Creating doctor with data:", formData);
        await axios.post(`${API_URL}/doctors`, formData, config);
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
                  doctor.image ||
                  "https://via.placeholder.com/400x300?text=Doctor"
                }
                alt={doctor.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x300?text=Doctor";
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
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">
              {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                <input
                  type="url"
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
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
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-accent hover:bg-accent-600 text-white py-3 rounded-lg font-semibold transition"
                >
                  {editingDoctor ? "Update" : "Add"} Doctor
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-lg font-semibold transition"
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
        {/* Sidebar */}
        <div className="w-64 bg-primary-900 text-white min-h-screen p-6 fixed left-0 top-20">
          <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
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
        <div className="flex-1 p-8 ml-64">
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
