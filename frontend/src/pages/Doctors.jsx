import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaUserMd,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaStar,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_URL}/doctors`);
      setDoctors(res.data.doctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const specialties = ["all", ...new Set(doctors.map((doc) => doc.specialty))];

  const filteredDoctors =
    filter === "all"
      ? doctors
      : doctors.filter((doc) => doc.specialty === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Our Expert Doctors
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Book appointments with our experienced medical professionals
            specialized in various fields.
          </p>
        </div>

        {/* Specialty Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {specialties.map((specialty) => (
            <button
              key={specialty}
              onClick={() => setFilter(specialty)}
              className={`px-6 py-2 rounded-full font-semibold transition transform hover:scale-105 ${filter === specialty
                  ? "bg-accent text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-accent"
                }`}
            >
              {specialty.charAt(0).toUpperCase() + specialty.slice(1)}
            </button>
          ))}
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden group"
            >
              {/* Doctor Image */}
              <div className="relative h-64 bg-gradient-to-br from-accent to-primary overflow-hidden">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <FaStar />
                    <span className="font-semibold">4.8</span>
                  </div>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-primary mb-2">
                  {doctor.name}
                </h3>
                <p className="text-accent font-semibold mb-3 flex items-center gap-2">
                  <FaUserMd /> {doctor.specialty}
                </p>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {doctor.qualification} • {doctor.experience}+ years experience
                </p>

                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <FaMoneyBillWave className="text-green-500" />₹
                    {doctor.consultationFee}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt className="text-blue-500" />
                    Available Today
                  </span>
                </div>

                {/* Book Button */}
                {user ? (
                  <Link
                    to={`/book-appointment/${doctor._id}`}
                    className="block w-full text-center bg-accent hover:bg-accent-600 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105"
                  >
                    Book Appointment
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="block w-full text-center bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 rounded-lg transition"
                  >
                    Login to Book
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No doctors found */}
        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No doctors found in this specialty.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
