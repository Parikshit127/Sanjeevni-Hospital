import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaUserMd, FaStar } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function DoctorsSection() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await axios.get(`${API_URL}/doctors`);
                // Take only first 4 doctors for the preview
                setDoctors(res.data.doctors.slice(0, 4));
            } catch (error) {
                console.error("Error fetching doctors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    if (loading) return null;

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#2d3f4e] mb-4">
                        Meet Our Specialists
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Our team of experienced doctors is dedicated to providing the best medical care.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {doctors.map((doctor) => (
                        <div
                            key={doctor._id}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                                {doctor.image ? (
                                    <img
                                        src={doctor.image}
                                        alt={doctor.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FaUserMd className="text-6xl text-gray-300" />
                                )}
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-[#2d3f4e] mb-1">
                                    {doctor.name}
                                </h3>
                                <p className="text-[#67c0b3] font-semibold text-sm mb-2">
                                    {doctor.specialty}
                                </p>
                                <div className="flex items-center mb-4">
                                    <FaStar className="text-yellow-400 mr-1" />
                                    <span className="text-gray-600 text-sm">
                                        {doctor.rating || "New"} ({doctor.totalReviews || 0} reviews)
                                    </span>
                                </div>
                                <Link
                                    to={`/doctors`}
                                    className="block w-full text-center bg-gray-100 hover:bg-[#67c0b3] hover:text-white text-gray-700 font-semibold py-2 rounded-lg transition-colors duration-300"
                                >
                                    View Profile
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link
                        to="/doctors"
                        className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#67c0b3] hover:bg-[#5ab0a3] md:text-lg transition-transform transform hover:scale-105 shadow-lg"
                    >
                        View All Doctors
                    </Link>
                </div>
            </div>
        </section>
    );
}
